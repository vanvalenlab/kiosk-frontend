import * as d3 from 'd3';

export function divergingBarChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 600,
    height = 150,
    barHeight = 50,
    padding = 10,
    dataValue = function(d) { return +d.data; },
    labelValue = function(d) { return d.label; },
    color = [];

  function chart(selection) {
    //d3 documentation: https://github.com/d3/d3-selection/blob/master/README.md#selection
    //selection represents the selected document element
    //that is provided when calling using the d3 object.
    selection.each(function(data) {
      data = data.map(function(d) {
        //calculate a random color hue.
        var randomhue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        //for each piece of data, assign a new color to that data and push it to the color array.
        color.push(randomhue);
        return { value: dataValue(d), label: labelValue(d) };
      });

      var sumVals = d3.sum(data, function(d) { return d.value; });
      var barScale = d3.scaleLinear()
        .domain([0, sumVals])
        .range([0, (width-margin.left-margin.right)]);

      var svg = d3.select(this).selectAll('svg').data([data]);
      var gEnter = svg.enter().append('svg').append('g');
      gEnter.append('g').attr('class', 'rects')
        .selectAll('.data-rects').data(data).enter()
        .append('rect').attr('class', 'data-rects');

      gEnter.selectAll('line.legend')
        .data(data).enter()
        .append('line').attr('class', 'legend');

      gEnter.selectAll('text.legend')
        .data(data).enter()
        .append('text')
        .attr('class', 'legend')
        .attr('font-size', 12);

      svg = selection.select('svg');
      svg.attr('width', width).attr('height', height);
      var g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var rectG = g.select('g.rects');
      var dataRects = rectG.selectAll('.data-rects').data(data, function(d) { return d.label; });
      dataRects.exit().remove();
      dataRects.enter().append('rect').attr('class', 'data-rects');
      rectG.selectAll('.data-rects').transition()
        .duration(750)
        .attr('x', function(d, i) {
          //calculate the horizontal x-axis position of the currently selected data rect. d.value is divided by 1.3.
          return data.slice(0, i).reduce(function (a, d) { return a + barScale(d.value/1.3); }, 1) + (padding / 2);
        })
        .attr('y', height-margin.bottom-barHeight)
        //calculate the horizontal width of the currently selected data rect. d.value is divided by 1.3.
        .attr('width', function(d) { return Math.max(barScale(d.value/1.3) - (padding / 2), 1); })
        .attr('height', barHeight)
        .attr('fill', function(d, i) { return color[i]; });

      // Getting midpoint for legend
      function legendX(d, i) {
        //calculate the position of the legend text, d.value is divided by 1.3
        return data.slice(0, i).reduce(function (a, d) { return a + barScale(d.value/1.3); }, (Math.max((barScale(d.value) - (padding / 2)), 1) / 2)) + (padding / 2);
      }

      var legendLines = g.selectAll('line.legend').data(data, function(d) { return d.label; });
      legendLines.exit().remove();
      legendLines.enter().append('line').attr('class', 'legend');
      g.selectAll('line.legend').transition()
        .duration(750)
        .attr('x1', legendX)
        .attr('x2', legendX)
        .attr('y1', height-margin.bottom-barHeight-15)
        .attr('y2', height-margin.bottom-barHeight-45)
        .attr('stroke', '#000000')
        .attr('stroke-width', 0.5);

      var legendText = g.selectAll('text.legend').data(data, function(d) { return d.label; });
      legendText.enter()
        .append('text')
        .attr('class', 'legend')
        .attr('font-size', 12);
      legendText.exit().remove();
      g.selectAll('text.legend').transition()
        .duration(750)
        .attr('text-anchor', 'middle')
        .attr('x', legendX)
        .attr('y', height-margin.bottom-barHeight-55)
        .text(function(d) { return d.label;});
      // .text(function(d) { return d3.format(',')(d.value); });
    });
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.dataValue = function(_) {
    if (!arguments.length) return dataValue;
    dataValue = _;
    return chart;
  };

  chart.labelValue = function(_) {
    if (!arguments.length) return labelValue;
    labelValue = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

  return chart;
}