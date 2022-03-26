import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css'],
})
export class WorldMapComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  width = 960;
  height = 480;
  π = Math.PI;
  radians = this.π / 180;
  degrees = 180 / this.π;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.container);
    let element = this.container.nativeElement;
    // console.log(element);

    let projection = d3
      .geoNaturalEarth1()
      .translate([this.width / 2, this.height / 2])
      .scale(153)
      .precision(0.1);

    let circle = d3
      .geoCircle()
      .center([this.width / 2, this.height / 2])
      .radius(90);

    let path = d3.geoPath().projection(projection);

    let svg = d3
      .select(element)
      .append('svg')
      // .attr('width', this.width)
      // .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json').then(
      (world: any) => {
        svg
          .append('path')
          .datum(topojson.feature(world, world.objects.land))
          .attr('class', 'land')
          .attr('d', path);

        let night = svg
          .datum(topojson.feature(world, world.objects.land))
          .append('path')
          .style('fill', 'steelblue')
          .style('fill-opacity', '0.5')
          .style('stroke', 'steelblue')
          .attr('d', path);

        let redraw = () => {
          night
            .datum(circle.center(this.antipode(this.solarPosition(new Date()))))
            .attr('d', path);
        };

        redraw();
        setInterval(redraw, 1000);
      }
    );
  }

  antipode(position: any): [number, number] {
    return [position[0] + 180, -position[1]];
  }

  solarPosition(time: any) {
    let centuries = (time - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525, // since J2000
      longitude = (((d3.utcDay.floor(time) as any) - time) / 864e5) * 360 - 180;
    return [
      longitude - this.equationOfTime(centuries) * this.degrees,
      this.solarDeclination(centuries) * this.degrees,
    ];
  }

  // Equations based on NOAA’s Solar Calculator; all angles in radians.
  // http://www.esrl.noaa.gov/gmd/grad/solcalc/

  equationOfTime(centuries: any) {
    let e = this.eccentricityEarthOrbit(centuries),
      m = this.solarGeometricMeanAnomaly(centuries),
      l = this.solarGeometricMeanLongitude(centuries),
      y = Math.tan(this.obliquityCorrection(centuries) / 2);
    y *= y;
    return (
      y * Math.sin(2 * l) -
      2 * e * Math.sin(m) +
      4 * e * y * Math.sin(m) * Math.cos(2 * l) -
      0.5 * y * y * Math.sin(4 * l) -
      1.25 * e * e * Math.sin(2 * m)
    );
  }

  solarDeclination(centuries: any) {
    return Math.asin(
      Math.sin(this.obliquityCorrection(centuries)) *
        Math.sin(this.solarApparentLongitude(centuries))
    );
  }

  solarApparentLongitude(centuries: any) {
    return (
      this.solarTrueLongitude(centuries) -
      (0.00569 +
        0.00478 * Math.sin((125.04 - 1934.136 * centuries) * this.radians)) *
        this.radians
    );
  }

  solarTrueLongitude(centuries: any) {
    return (
      this.solarGeometricMeanLongitude(centuries) +
      this.solarEquationOfCenter(centuries)
    );
  }

  solarGeometricMeanAnomaly(centuries: any) {
    return (
      (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) *
      this.radians
    );
  }

  solarGeometricMeanLongitude(centuries: any) {
    var l =
      (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
    return ((l < 0 ? l + 360 : l) / 180) * this.π;
  }

  solarEquationOfCenter(centuries: any) {
    var m = this.solarGeometricMeanAnomaly(centuries);
    return (
      (Math.sin(m) *
        (1.914602 - centuries * (0.004817 + 0.000014 * centuries)) +
        Math.sin(m + m) * (0.019993 - 0.000101 * centuries) +
        Math.sin(m + m + m) * 0.000289) *
      this.radians
    );
  }

  obliquityCorrection(centuries: any) {
    return (
      this.meanObliquityOfEcliptic(centuries) +
      0.00256 *
        Math.cos((125.04 - 1934.136 * centuries) * this.radians) *
        this.radians
    );
  }

  meanObliquityOfEcliptic(centuries: any) {
    return (
      (23 +
        (26 +
          (21.448 -
            centuries *
              (46.815 + centuries * (0.00059 - centuries * 0.001813))) /
            60) /
          60) *
      this.radians
    );
  }

  eccentricityEarthOrbit(centuries: any) {
    return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
  }
}
