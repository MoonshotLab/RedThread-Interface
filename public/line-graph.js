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
  var y = d3.scale.linear().range([this.height, 35]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
    .tickFormat(d3.time.format('%m/%d'));

  var svg = d3.select(this.selector)
    .append('svg').attr('width', this.width).attr('height', this.height);
  var context = svg.append('g').attr('class', 'context');

  x.domain(d3.extent(self.data.dateRange));
  y.domain([0, self.data.maxScore]);

  fillInBlankDates(this.data.strategies);

  var line = d3.svg.line()
    .x(function(d) { return x(d.date);  })
    .y(function(d) { return y(d.score); });

  // draw the graph
  for(var name in this.data.strategies){
    this.data.strategies[name].children = _.sortBy(
      this.data.strategies[name].children, 'date');
    context.append('path')
      .datum(self.data.strategies[name].children)
      .attr('class', 'line ' + name)
      .attr('d', line)
      .attr('transform', 'translate(0, -25)');
  }

  // draw the x axis
  var xAxisOffset = this.height - 25;
  context.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + xAxisOffset + ')')
    .call(xAxis);


  // when the dates get passed they can have a lot of dates where no score
  // is calculated. This takes each day and ensures there's a score of zero
  // at every day
  function fillInBlankDates(strategies){
    var domain = x.domain();
    var format = d3.time.format('%d-%m-%Y');
    var maxDay = new Date(domain[1]);

    maxDay.setDate(maxDay.getDate() + 1);
    var days = d3.time.days(domain[0], maxDay);

    for(var key in strategies){
      days.forEach(function(day){
        var match = _.findWhere(strategies[key].children, { date : day });
        if(!match){
          strategies[key].children.push({
            date        : day,
            dateString  : format(day),
            score       : 0
          });
        }
      });
    }
  }
};
