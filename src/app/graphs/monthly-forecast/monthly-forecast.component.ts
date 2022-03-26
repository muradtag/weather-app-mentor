import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-monthly-forecast',
  templateUrl: './monthly-forecast.component.html',
  styleUrls: ['./monthly-forecast.component.css'],
})
export class MonthlyForecastComponent implements OnInit {
  @ViewChild('monthly-chart', { static: true }) chart!: ElementRef;
  @Input() monthlyData: any;

  constructor() {}

  ngOnInit(): void {
    console.log(this.monthlyData);

    let margin = {
      top: 15,
      right: 35,
      bottom: 20,
      left: 35,
    };
    let width = 800 - margin.left - margin.right;
    let height = 150 - margin.top - margin.bottom;

    // Parse the time
    let dateFormat = d3.timeFormat('%d/%m');

    let svg = d3
      .select('#monthly-chart')
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let graphData = this.monthlyData.data.weather;

    console.log(graphData);

    for (let i = 0, temp_counter = 1, len = graphData.length; i < len; i++) {
      // Parse Date and Chance of rain
      // let [year, month, day] = graphData[i].date.split('-');
      graphData[i].date = new Date(graphData[i].date);
      graphData[i].avgtempC = +graphData[i].avgtempC;
      graphData[i].uvIndex = +graphData[i].uvIndex;

      // Group Similar tempratures together
      if (i < len - 1) {
        if (graphData[i].avgtempC === graphData[i + 1].avgtempC) {
          temp_counter++;
        } else {
          let moveHere = i - Math.round(--temp_counter / 2);
          graphData[moveHere].temp_read = graphData[i].avgtempC;
          temp_counter = 1;
        }
      } else {
        if (graphData[i].avgtempC === graphData[i - 1].avgtempC) {
          var moveHere = i - Math.round(--temp_counter / 2);
          graphData[moveHere].temp_read = graphData[i].avgtempC;
          temp_counter = 1;
        } else {
          graphData[i].temp_read = graphData[i].avgtempC;
        }
      }
    }

    console.log(graphData);

    // X and Y scales
    let xScale = d3
      .scaleTime()
      .domain(d3.extent(graphData, (d: any) => d.date) as Iterable<Date>)
      .range([0, width]);

    let yScale = d3
      .scaleLinear()
      .domain([
        Number(d3.max(graphData, (d: any) => Number(d.avgtempC))),
        Number(d3.min(graphData, (d: any) => Number(d.avgtempC))),
      ])
      .range([height - 30, 30]);

    // Draw X-axis
    let x_axis = d3.axisBottom(xScale).tickFormat((d) => dateFormat(d as Date));
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(x_axis);

    // Draw Temprature Line
    svg
      .append('path')
      .datum(graphData)
      .style('stroke', 'black')
      .style('stroke-width', '1')
      .style('fill', 'none')
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveCardinal)
          .x((d: any) => xScale(d.date))
          .y((d: any) => height - yScale(d.avgtempC))
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
          .x((d: any) => xScale(d.date))
          .y0(height)
          .y1((d: any) => height - yScale(d.avgtempC))
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
      .attr('stroke-width', '1')
      .attr('cx', (d: any) => {
        return xScale(d.date);
      })
      .attr('cy', (d: any) => {
        return height - yScale(d.temp_read);
      })
      .attr('r', 3);

    tempPoint
      .append('text')
      .attr('x', (d: any) => xScale(d.date))
      .attr('y', (d: any) => height - yScale(d.temp_read))
      .attr('font-size', '10px')
      .attr('dy', '-5px')
      .style('text-anchor', 'middle')
      .text((d: any) => d.temp_read + '°');

    // Define chance of rain Y scale
    let uvIndexY = d3.scaleLinear().domain([0, 10]).range([0, 20]);

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
          .x((d: any) => xScale(d.date))
          .y((d: any) => height - uvIndexY(d.uvIndex))
      );

    // Paint chance of rain Area
    svg
      .append('path')
      .datum(graphData)
      .attr('fill', 'yellow')
      .attr('stroke-width', '0')
      .attr('fill-opacity', '0.5')
      .attr(
        'd',
        d3
          .area()
          .curve(d3.curveStep)
          .x((d: any) => xScale(d.date))
          .y0(height)
          .y1((d: any) => height - uvIndexY(d.uvIndex))
      );

    // chance of rain value
    svg
      .selectAll('.pop-value')
      .data(graphData)
      .enter()
      .append('text')
      .attr('font-size', '8px')
      .attr('x', (d: any) => xScale(d.date))
      .attr('y', (d: any) => height - uvIndexY(d.uvIndex))
      .attr('dy', '-5px')
      .style('text-anchor', 'middle')
      .text(function (d: any) {
        if (d.uvIndex != 0) return d.uvIndex + '';
        else return '';
      });

    // Get the data
    // d3.json(
    //   'https://gist.githubusercontent.com/bojanvidanovic/4bfcdf766867bd65c6b07882c01abd9f/raw/8ce8482f9e2335d15c5b1a3bdd7573c3cc105318/forecast.json'
    // ).then((data: any) => {
    //   // console.log('API data', data);
    //   // Hourly forecast data
    //   var data = data.hourly_forecast;

    //   // Format the data
    //   for (
    //     var i = 0, temp_counter = 1, icon_counter = 1, len = data.length;
    //     i < len;
    //     i++
    //   ) {
    //     // Parse time
    //     var timeBase = data[i].FCTTIME;
    //     var hour = timeBase.hour_padded;
    //     var minutes = timeBase.min;
    //     var day = timeBase.mday_padded;
    //     var month = timeBase.mon_padded;
    //     var year = timeBase.year;
    //     var date = [hour, minutes, day, month, year].join(' ');
    //     data[i].time = parseDate(date);

    //     // POP value to Int
    //     data[i].pop = +data[i].pop;

    //     // Group temperature
    //     if (i < len - 1) {
    //       if (data[i].temp.metric === data[i + 1].temp.metric) {
    //         temp_counter++;
    //       } else {
    //         var moveHere = i - Math.round(--temp_counter / 2);
    //         data[moveHere].temp_read = data[i].temp.metric;
    //         temp_counter = 1;
    //       }
    //     } else {
    //       if (data[i].temp.metric === data[i - 1].temp.metric) {
    //         var moveHere = i - Math.round(--temp_counter / 2);
    //         data[moveHere].temp_read = data[i].temp.metric;
    //         temp_counter = 1;
    //       } else {
    //         data[i].temp_read = data[i].temp.metric;
    //       }
    //     }

    //     // Group weather icons
    //     if (i < len - 1) {
    //       if (data[i].icon_url === data[i + 1].icon_url) {
    //         if (data[i + 2]) {
    //           icon_counter++;
    //         }
    //       } else {
    //         if (icon_counter === 1) {
    //           data[i].graph_icon = data[i].icon_url;
    //           data[i + 1].icon_limit = true;
    //         } else {
    //           var moveHere = i - Math.round(icon_counter / 2);
    //           data[moveHere].graph_icon = data[i].icon_url;
    //           data[i].icon_limit = true;
    //           icon_counter = 1;
    //         }
    //       }
    //     } else {
    //       if (data[i].icon_url === data[i - 1].icon_url) {
    //         var moveHere = i - Math.round(icon_counter / 2) - 1;
    //         data[moveHere].graph_icon = data[i].icon_url;
    //       } else {
    //         data[i].graph_icon = data[i].icon_url;
    //         icon_counter = 1;
    //       }
    //     }
    //   }

    //   // console.log("API Result", data);

    //   // let x = data.map((d: any) => d.temp.metric);
    //   // console.log(x);
    //   // console.log(d3.max(data, (d: any) => Number(d.temp.metric)));

    //   // Set scales
    //   var xScale = d3
    //     .scaleTime()
    //     .domain(d3.extent(data, (d: any) => d.time) as Iterable<Date>)
    //     .range([0, width]);

    //   var yScale = d3
    //     .scaleLinear()
    //     .domain([
    //       Number(d3.min(data, (d: any) => Number(d.temp.metric))),
    //       Number(d3.max(data, (d: any) => Number(d.temp.metric))),
    //     ])
    //     .range([60, height - 30]);

    //   // console.log(xScale);

    //   // Bottom scale
    //   let x_axis = d3
    //     .axisBottom(xScale)
    //     .tickFormat((d) => timeFormat(d as Date));
    //   svg
    //     .append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(x_axis);

    //   // Draw temperature line
    //   svg
    //     .append('path')
    //     .datum(data)
    //     .style('stroke', 'steelblue')
    //     .style('stroke-width', '3')
    //     .style('fill', 'none')
    //     .attr(
    //       'd',
    //       d3
    //         .line()
    //         .curve(d3.curveCardinal)
    //         .x((d: any) => xScale(d.time))
    //         .y((d: any) => height - yScale(d.temp.metric))
    //     );

    //   // Fill temperature area
    //   svg
    //     .append('path')
    //     .datum(data)
    //     .attr('fill', 'steelblue')
    //     .attr('stroke-width', '0')
    //     .attr('opacity', '.2')
    //     .attr(
    //       'd',
    //       d3
    //         .area()
    //         .curve(d3.curveCardinal)
    //         .x((d: any) => xScale(d.time))
    //         .y0(height)
    //         .y1((d: any) => height - yScale(d.temp.metric))
    //     );

    //   // console.log(
    //   //   data.filter((d: any) => {
    //   //     return d.temp_read;
    //   //   })
    //   // );

    //   // Temperature change point and value
    //   var tempPoint = svg
    //     .selectAll('.temp-point')
    //     .data(data)
    //     .enter()
    //     .filter((d: any) => {
    //       return d.temp_read;
    //     });

    //   tempPoint
    //     .append('circle')
    //     .attr('fill', 'steelblue')
    //     .attr('stroke', 'steelblue')
    //     .attr('stroke-width', '2')
    //     .attr('cx', (d: any) => {
    //       return xScale(d.time);
    //     })
    //     .attr('cy', (d: any) => {
    //       return height - yScale(d.temp_read);
    //     })
    //     .attr('r', 3);

    //   tempPoint
    //     .append('text')
    //     .attr('x', (d: any) => xScale(d.time))
    //     .attr('y', (d: any) => height - yScale(d.temp_read))
    //     .attr('dy', '-10px')
    //     .style('text-anchor', 'middle')
    //     .text((d: any) => d.temp_read + '°');

    //   // Define POP Y scale
    //   var popY = d3
    //     .scaleLinear()
    //     .domain([0, Number(d3.max(data, (d: any) => d.pop))])
    //     .range([0, 20]);

    //   // Draw POP line
    //   svg
    //     .append('path')
    //     .datum(data)
    //     .attr('stroke', '#000')
    //     .attr('stroke-width', '.3')
    //     .attr('fill', 'none')
    //     .attr(
    //       'd',
    //       d3
    //         .line()
    //         .curve(d3.curveStep)
    //         .x((d: any) => xScale(d.time))
    //         .y((d: any) => height - popY(d.pop))
    //     );

    //   // Paint POP Area
    //   svg
    //     .append('path')
    //     .datum(data)
    //     .attr('class', 'pop-area')
    //     .attr('fill', '#3590df')
    //     .attr('stroke-width', '0')
    //     .attr(
    //       'd',
    //       d3
    //         .area()
    //         .curve(d3.curveStep)
    //         .x((d: any) => xScale(d.time))
    //         .y0(height)
    //         .y1((d: any) => height - popY(d.pop))
    //     );

    //   // POP value
    //   var pop = svg
    //     .selectAll('.pop-value')
    //     .data(data)
    //     .enter()
    //     .append('text')
    //     .attr('class', 'pop-value')
    //     .attr('font-size', '8px')
    //     .attr('x', (d: any) => xScale(d.time))
    //     .attr('y', (d: any) => height - popY(d.pop))
    //     .attr('dy', '-5px')
    //     .style('text-anchor', 'middle')
    //     .text(function (d: any) {
    //       if (d.pop != 0) return d.pop + '%';
    //       else return '';
    //     });

    //   // Forecast icon
    //   svg
    //     .selectAll('image')
    //     .data(data)
    //     .enter()
    //     .filter((d: any) => {
    //       if (d.graph_icon) return d.time;
    //     })
    //     .append('image')
    //     .attr('xlink:href', (d: any) => d.graph_icon)
    //     .attr('height', '19')
    //     .attr('width', '20')
    //     .attr('x', (d: any) => xScale(d.time))
    //     .attr('y', 65);

    //   // Separate forecast icons
    //   svg
    //     .selectAll('.divider-line')
    //     .data(data)
    //     .enter()
    //     .filter((d: any) => {
    //       if (d.icon_limit) return d.time;
    //     })
    //     .append('line')
    //     .style('stroke-dasharray', '3,3')
    //     .style('stroke', 'grey')
    //     .attr('class', 'divider-line')
    //     .attr('x1', (d: any) => xScale(d.time))
    //     .attr('y1', height)
    //     .attr('x2', (d: any) => xScale(d.time))
    //     .attr('y2', (d: any) => height - yScale(d.temp.metric) + 2);
    // });
  }
}
