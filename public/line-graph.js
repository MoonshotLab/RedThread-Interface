// data       : min, max, strategies : { 'celebrate' : [ { date : UTC, score : x }] }
RedThread.LineGraph = function(opts){
  var self = this;
  for(var key in opts){ self[key] = opts[key]; }

  return this;
};


RedThread.LineGraph.prototype.draw = function(opts){
  var self = this;
  for(var key in opts){ self[key] = opts[key]; }

  var x = d3.time.scale().range([0, this.width]);
  var y = d3.scale.linear().range([this.height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
    .tickFormat(d3.time.format('%m/%d'));

  var svg = d3.select(this.selector)
    .append('svg').attr('width', this.width).attr('height', this.height);
  var context = svg.append('g').attr('class', 'context');

  x.domain(d3.extent(self.data.dateRange));
  y.domain([0, self.data.maxScore]);

  var line = d3.svg.line()
    .x(function(d) { return x(d.date);  })
    .y(function(d) { return y(d.score); });

  // draw the graph
  for(var keyz in this.data.strategies){
    context.append('path')
      .datum(self.data.strategies[keyz])
      .attr('class', 'line ' + keyz)
      .attr('d', line)
      .attr('transform', 'translate(0, -25)');
  }

  // draw the x axis
  var xAxisOffset = this.height - 25;
  context.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + xAxisOffset + ')')
    .call(xAxis);
};
