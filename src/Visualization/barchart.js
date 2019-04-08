import * as d3 from 'd3';

export function divergingBarChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: -6},
    width = 1600,
    height = 150,
    barHeight = 50,
    padding = 20,
    // the '+' symbol here turns the d.data value into a positive integer.
    // All references to this variable will then become normalized as "positive" in integer value.
    dataValue = function(d) { return +d.data; },
    labelValue = function(d) { return d.label; },
    color = ['#5FA659','#99D8CA','#5A69DC','#C178F2','#767D8E'];

  //This function 'chart' will be the main function that is executed when references are called to
  // divergingBarChart() in in the higher-order Predict.js component in the function drawChart().
  function chart(selection) {
    //d3 documentation: https://github.com/d3/d3-selection/blob/master/README.md#selection
    //selection represents the selected document element
    //that is provided in the parameter-argument when calling using the d3 object.
    selection.each(function(data) {
      data = data.map(function(d) {
        return { value: dataValue(d), label: labelValue(d) };
      });
      //Reusable function that sums all values within the parameter-argument data object.
      var sumVals = d3.sum(data, function(d) {
        return d.value;
      });

      //creates a continuous horizontal scale. https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear
      var barScale = d3.scaleLinear()
        /* the domain of this scale is set to -20, so that the x-values of both rect position and padding can display entirely. */
        .domain([-20, sumVals])
        .range([0, (width-margin.left-margin.right)]);
      
      /*This svg var establishes itself as a object capable of controlling an svg tag and giving it data. */
      var svgController = d3.select(this).selectAll('svg').data([data]);
      /* gEnter is a variable that means 
      
      The most important part of this d3 report is here at the .enter() function.
      .enter() means "let's enter into the html element that
      is selected and do stuff inside it."

      Here, it is appending an svg and then appending a g tag right after.
      https://d3indepth.com/enterexit/#enter
      */
      var gEnter = svgController.enter().append('svg').append('g');
      /* There is currently 1 existing g tag.
      The below code add yet another g tag under it,
      and then assigns it a class name of 'rects' 
      
      You call .selectAll on any and all child elements within the g tag
      with className of .data-rects, of which none exist.
      https://github.com/d3/d3-selection/blob/master/README.md#selectAll
      In d3, however, you can call .data() after a selection of non-existing elements
      to immediately create new elements based off of the amount of entries
      within the data array.
      */
      gEnter.append('g').attr('class', 'rects')
        .selectAll('.data-rects').data(data).enter()
        .append('rect').attr('class', 'data-rects');

      gEnter.selectAll('text.value')
        .data(data).enter()
        .append('text').attr('class', 'metricValue')
        .attr('x', function(d, i) { return data.slice(0, i).reduce(function (a, d) { return a + barScale(d.value); }, 5) + (padding/2) + 5; })
        .attr('y', height-margin.bottom-10)
        .attr('fill', 'white')
        .attr('font-size', 12)
        .text(function(d) { return d.value; });

      gEnter.selectAll('line.legend')
        .data(data).enter()
        .append('line').attr('class', 'legend');

      gEnter.selectAll('text.legend')
        .data(data).enter()
        .append('text')
        .attr('class', 'legend')
        .attr('font-size', 12);

      svgController = selection.select('svg');
      svgController.attr('width', width).attr('height', height);
      var g = svgController.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var rectG = g.select('g.rects');
      var dataRects = rectG.selectAll('.data-rects').data(data, function(d) { return d.label; });
      dataRects.exit().remove();
      dataRects.enter().append('rect').attr('class', 'data-rects');
      rectG.selectAll('.data-rects').transition()
        .duration(750)
        .attr('x', function(d, i) {
          //calculate the horizontal x-axis position of the currently selected data rect. adding + (padding / 2) at the end aligns it with the legend.
          return data.slice(0, i).reduce(function (a, d) { return a + barScale(d.value); }, 5) + (padding / 2);
        })
        .attr('y', height-margin.bottom-barHeight)
        //calculate the horizontal width of the currently selected data rect.
        .attr('width', function(d) {
          //if the value of the data is more than 1000, divide it by 10.
          if(d.value >= 1000){
            //In the case that the data graph is the n_true or n_pred graph,
            //then just scale it slightly so it displays a little more semantically.
            if(d.label === 'n_true' || d.label === 'n_pred'){
              return d.value/4.5;
            }
            return d.value/10;
          }
          else{
            //Math.max returns either the value of barScale(d.value) - (padding / 2) OR 10. This is because if the first value
            //is too low, then it defaults to a value of 10 to give it some presence on the bar graph.
            return Math.max(barScale(d.value) - (padding / 2), 5);
          }
        })
        .attr('height', barHeight)
        .attr('fill', function(d, i) { return color[i]; });

      // Getting midpoint for legend
      function legendX(d, i) {
        /* Original iValue
        var iValue = Math.max((barScale(d.value) - (padding / 2)), 1) / 2 + (padding / 2);
        */
        var iValue = Math.max((barScale(d.value) - (padding / 2)), 10) + (padding / 2);
        /* if the value of the data is higher than 1000, we scale it back a tad so that it can display nicely with other small values. */
        if(d.value >= 1000){
          iValue = Math.max((barScale(d.value/10) - (padding / 2)), 1) + (padding / 2);
        }
        //calculate the position of the legend text
        return data.slice(0, i).reduce(
          function (a, d) {
            //due to the scaling we apply to the 1000 or greater values for data rects, we must apply it here to the legend as well as the width and x-position of the rects.
            if( d.value >= 1000){
              return a+barScale(d.value/10);
            }
            else{
              return a + barScale(d.value);
            }
          },
          iValue);
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
        .text(function(d) { return d.label ;});
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