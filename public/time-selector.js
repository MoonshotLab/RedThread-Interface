// strategies : { 'celebrate' : [ { date : UTC, score : x }] }
// onChange   : callback after the time selecton has changed
var TimeSelector = function(opts){
  var self = this;

  for(var key in opts){
    self[key] = opts[key];
  }

  return this;
};


TimeSelector.prototype.create = function(){
  var self = this;
  var graphHeight = this.height - 25;

  var x = d3.time.scale().range([0, this.width]);
  var y = d3.scale.linear().range([this.height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom');
  var brush = d3.svg.brush().x(x).on('brush', function(){
    if(self.onChange) self.onChange(brush.extent());
  });

  var svg = d3.select('.time-selector')
    .append('svg').attr('width', this.width).attr('height', this.height);
  var context = svg.append('g').attr('class', 'context');

  x.domain(d3.extent(self.data.craft.map(function(d)  { return d.date; })));
  y.domain([0, d3.max(self.data.craft.map(function(d) { return d.score; }))]);

  var line = d3.svg.line()
    .x(function(d) { console.log(d.date); return x(d.date);  })
    .y(function(d) { return y(d.score); });

  // draw the graph
  for(var key in this.data){
    context.append('path')
      .datum(self.data[key])
      .attr('class', key)
      .attr('d', line);
  }

  // draw the x axis
  context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(xAxis);

  // darw the brush
  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", 0)
    .attr("height", graphHeight);
};
