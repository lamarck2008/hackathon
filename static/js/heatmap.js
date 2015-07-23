String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    
    return theString;
}

plotHeatmap = function(data, rowText, colText) {
  //height of each row in the heatmap
  //width of each column in the heatmap
  var gridSize = 100,
      h = gridSize,
      w = gridSize,
      offset = 5,
      rectPadding = 60,
      legendElementWidth = gridSize / 2,
      legendElementHeight = gridSize / 4;

  var colorLow = 'green', colorMed = 'yellow', colorHigh = 'red';
  var colors = ['green', 'yellow', 'red'];

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = 640 - margin.left - margin.right,
      height = 280 - margin.top - margin.bottom;


  var colorScale = d3.scale.linear()
       .domain([0, 0.5001, 1])
       .range([colorLow, colorMed, colorHigh]);

  var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var rowLabels = svg.selectAll(".bottlerLabel")
                         .data(rowText)
                         .enter().append("text")
                         .text(function (d) { return d; })
                         .attr("x", 0)
                         .attr("y", function (d, i) { return i * gridSize; })
                         .style("text-anchor", "end")
                         .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

  var colLabels = svg.selectAll(".checkLabel")
                       .data(colText)
                       .enter().append("text")
                       .text(function(d) { return d; })
                       .attr("x", function(d, i) { return i * (gridSize + offset); })
                       .attr("y", 0)
                       .style("text-anchor", "middle")
                       .attr("transform", "translate(" + gridSize / 2 + ", -6)");

  var heatMap = svg.selectAll(".chart")
                   .data(data, function(d) { return d.col + ':' + d.row; })
                   .enter().append("svg:rect")
                   .attr("y", function(d) { return d.row * (w + offset); })
                   .attr("x", function(d) { return d.col * (h + offset); })
                   .attr("width", function(d) { return w; })
                   .attr("height", function(d) { return h; })
                   .style("fill", function(d) { return colorScale(d.score); });

  heatMap.on("click", function(d,i) {
                      var bottler = bottlers[d.row];
                      var test_name = colText[d.col].replace(' ', '_');
                      var url = String.format("/bottler_report/?test_name:{0}&bottler_name:{1}", test_name, bottler);
                      console.log(url);
                      window.location.href = url;
                      return url;
              }
  );


  var heatMapText = svg.selectAll(".chart")
                       .data(data, function(d) { return d.col + ':' + d.row; })
                       .enter().append('text')
                       .attr("y", function(d) { return d.row * (w + offset) + gridSize / 2; })
                       .attr("x", function(d) { return d.col * (h + offset) + gridSize / 4; })
                       .text(function(d) {return d.score.toFixed(2) * 100 + ' %'});

  var legendScore = [0, 0.5, 1];
  var legend = svg.selectAll(".legend")
                  .data(legendScore)
                  .enter().append("g")
                  .attr("class", "legend");

  legend.append("rect")
        .attr("x", function(d, i) { return (legendElementWidth + offset) * i; })
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", legendElementHeight)
        .style("fill", function(d, i) { return colors[i]; });

  var labels = ['Passed', '', 'Failed'];

  legend.append("text")
        .text(function(d, i) { return labels[i]; })
        .attr("x", function(d, i) { return (legendElementWidth + offset) * i; })
        .attr("y", height)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + legendElementWidth / 2 + ", -6)");
}