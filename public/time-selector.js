// data       : min, max, strategies : { 'celebrate' : [ { date : UTC, score : x }] }
// onChange   : callback after the time selecton has changed
RedThread.TimeSelector = function(opts){
  var self = this;
  for(var key in opts){ self[key] = opts[key]; }

  return this;
};


RedThread.TimeSelector.prototype.draw = function(opts){
  var self = this;
  for(var key in opts){ self[key] = opts[key]; }

  var x = d3.time.scale().range([0, this.width]);
  var y = d3.scale.linear().range([this.height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom');
  var brush = d3.svg.brush().x(x).on('brush', function(){
    if(self.onChange) self.onChange(brush.extent());
  });

  var svg = d3.select('.time-selector')
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
      .attr('d', line);
  }

  // draw the x axis
  context.append('g')
    .attr('class', 'x-axis')
    .call(xAxis);

  // draw the brush
  context.append('g')
    .attr('class', 'brush')
    .call(brush)
    .selectAll('rect')
    .attr('y', 0)
    .attr('height', this.height);
};
