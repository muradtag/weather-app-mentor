import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  @ViewChild('chart', { static: true }) chart!: ElementRef;
  @Input() weatherData: any;

  constructor() {}

  ngOnInit(): void {
    // console.log('WEATHERDATA:', this.weatherData);

    // Graph dimensions
    let margin = {
      top: 15,
      right: 35,
      bottom: 20,
      left: 35,
    };
    let width = 800 - margin.left - margin.right;
    let height = 150 - margin.top - margin.bottom;

    // Parse the time
    let timeFormat = d3.timeFormat('%H:%M');

    // Graph
    let svg = d3
      .select('#chart')
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Graph Data from API
    let graphData = this.weatherData.data.weather[0].hourly;
    let [year, month, day] = this.weatherData.data.weather[0].date.split('-');

    // console.log(graphData);

    for (let i = 0, temp_counter = 1, len = graphData.length; i < len; i++) {
      // Parse Date and Chance of rain
      graphData[i].time = new Date(year, month, day, +graphData[i].time / 100);
      graphData[i].chanceofrain = +graphData[i].chanceofrain;
      // graphData[i].chanceofrain = i * 4;

      if (i < len - 1) {
        // Group Similar tempratures together
        if (graphData[i].tempC === graphData[i + 1].tempC) {
          temp_counter++;
        } else {
          let moveHere = i - Math.round(--temp_counter / 2);
          graphData[moveHere].temp_read = graphData[i].tempC;
          temp_counter = 1;
        }
      } else {
        if (graphData[i].tempC === graphData[i - 1].tempC) {
          var moveHere = i - Math.round(--temp_counter / 2);
          graphData[moveHere].temp_read = graphData[i].tempC;
          temp_counter = 1;
        } else {
          graphData[i].temp_read = graphData[i].tempC;
        }
      }
    }

    // console.log(graphData);

    // X and Y scales
    let xScale = d3
      .scaleTime()
      .domain(d3.extent(graphData, (d: any) => d.time) as Iterable<Date>)
      .range([0, width]);

    let yScale = d3
      .scaleLinear()
      .domain([
        Number(d3.min(graphData, (d: any) => Number(d.tempC))),
        Number(d3.max(graphData, (d: any) => Number(d.tempC))),
      ])
      .range([30, height - 20]);

    // Draw X-axis
    let x_axis = d3.axisBottom(xScale).tickFormat((d) => timeFormat(d as Date));
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(x_axis);

    // Draw Temprature Line
    svg
      .append('path')
      .datum(graphData)
      .style('stroke', 'black')
      .style('stroke-width', '2')
      .style('fill', 'none')
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveCardinal)
          .x((d: any) => xScale(d.time))
          .y((d: any) => height - yScale(d.tempC))
      );

    // Fill temperature area
    svg
      .append('path')
      .datum(graphData)
      .attr('fill', 'black')
      .attr('stroke-width', '0')
      .attr('opacity', '.1')
      .attr(
        'd',
        d3
          .area()
          .curve(d3.curveCardinal)
          .x((d: any) => xScale(d.time))
          .y0(height)
          .y1((d: any) => height - yScale(d.tempC))
      );

    // Temperature change point and value
    let tempPoint = svg
      .selectAll('.temp-point')
      .data(graphData)
      .enter()
      .filter((d: any) => {
        return d.temp_read;
      });

    tempPoint
      .append('circle')
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', '2')
      .attr('cx', (d: any) => {
        return xScale(d.time);
      })
      .attr('cy', (d: any) => {
        return height - yScale(d.temp_read);
      })
      .attr('r', 3);

    tempPoint
      .append('text')
      .attr('x', (d: any) => xScale(d.time))
      .attr('y', (d: any) => height - yScale(d.temp_read))
      .attr('dy', '-10px')
      .style('text-anchor', 'middle')
      .text((d: any) => d.temp_read + '°');

    // console.log(graphData[5].chanceofrain);

    // Define chance of rain Y scale
    let chanceOfRainY = d3.scaleLinear().domain([0, 100]).range([0, 20]);

    // Draw chance of rain line
    svg
      .append('path')
      .datum(graphData)
      .attr('stroke', '#000')
      .attr('stroke-width', '.3')
      .attr('fill', 'none')
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveStep)
          .x((d: any) => xScale(d.time))
          .y((d: any) => height - chanceOfRainY(d.chanceofrain))
      );

    // Paint chance of rain Area
    svg
      .append('path')
      .datum(graphData)
      .attr('fill', '#3590df')
      .attr('stroke-width', '0')
      .attr('fill-opacity', '0.7')
      .attr(
        'd',
        d3
          .area()
          .curve(d3.curveStep)
          .x((d: any) => xScale(d.time))
          .y0(height)
          .y1((d: any) => height - chanceOfRainY(d.chanceofrain))
      );

    // chance of rain value
    svg
      .selectAll('.pop-value')
      .data(graphData)
      .enter()
      .append('text')
      .attr('class', 'pop-value')
      .attr('font-size', '8px')
      .attr('x', (d: any) => xScale(d.time))
      .attr('y', (d: any) => height - chanceOfRainY(d.chanceofrain))
      .attr('dy', '-5px')
      .style('text-anchor', 'middle')
      .text(function (d: any) {
        if (d.chanceofrain != 0) return d.chanceofrain + '%';
        else return '';
      });
  }
}
