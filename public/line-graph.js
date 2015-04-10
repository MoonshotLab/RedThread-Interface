// data : min, max, strategies : { 'celebrate' : [ { date : UTC, score : x }] }
RedThread.LineGraph = function(opts){
  var self = this;
  for(var key in opts){ self[key] = opts[key]; }

  return this;
};


RedThread.LineGraph.prototype.draw = function(opts){
  var self = this;
  for(var key in opts){ self[key] = opts[key]; }

  // establish min and max values for x and y with an offset for proper drawing
  var x = d3.time.scale().range([0, this.width]);
  var y = d3.scale.linear().range([this.height, 200]);

  // build the x axis, offset and create a month/day format
  var xAxis = d3.svg.axis().scale(x).orient('bottom')
    .tickFormat(d3.time.format('%m/%d'));

  // make the root svg
  var svg = d3.select(this.selector)
    .append('svg').attr('width', this.width).attr('height', this.height);

  // create an invisible rectangle to catch the hover events
  svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', this.width)
    .attr('height', this.height)
    .on('mousemove', mouseMove);

  // create a scondary legend used to show index scores at a given time
  var legend = svg.append('g').attr('class', 'legend');
  legend.append('text')
    .attr('x', 9)
    .attr('dy', '.35em');

  // establish min and max values for x and y
  x.domain(d3.extent(self.data.dateRange));
  y.domain([0, self.data.maxScore]);

  // ensure each date has an associated value
  fillInBlankDates(this.data.strategies);

  // create a line function
  var line = d3.svg.line()
    .x(function(d) { return x(d.date);  })
    .y(function(d) { return y(d.score); });

  // draw the lines for each strategy
  for(var name in this.data.strategies){
    this.data.strategies[name].children = _.sortBy(
      this.data.strategies[name].children, 'date');

    svg.append('path')
      .datum(self.data.strategies[name].children)
      .attr('class', 'line ' + name)
      .attr('d', line)
      .attr('transform', 'translate(0, -25)');
  }

  // draw the x axis
  var xAxisOffset = this.height - 25;
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + xAxisOffset + ')')
    .call(xAxis);

  // reference a sample object so we can bisect it's date and use it as a
  // reference for the legend
  var sample = {};
  for(var strategyName in this.data.strategies){
    sample = this.data.strategies[strategyName];
    break;
  }

  // draw a secondary key showing the given red thread index per strategy
  // at any given date time
  var bisectDate = d3.bisector(function(d) { return d.date; }).left;
  var $legend = $('#legend');
  function mouseMove(e){
    var xPos = d3.mouse(this)[0];
    var yPos = d3.mouse(this)[1];

    var i = bisectDate(sample.children, x.invert(xPos), 1);

    var nameScores = [];
    for(var strategyName in self.data.strategies){
      nameScores.push({
        name  : strategyName,
        score : self.data.strategies[strategyName].children[i].score
      });
    }

    $legend.css({ top : yPos, left : xPos });
    // $legend.html(RedThread.templates.legend({ nameScores : nameScores }));
  }


  // when the dates get passed they can have a lot of dates where no score
  // is calculated. This takes each day and ensures there's a score of zero
  // at every day
  function fillInBlankDates(strategies){
    var fill = function(day){
      var match = _.findWhere(strategies[key].children, { date : day });
      if(!match){
        strategies[key].children.push({
          date        : day,
          dateString  : format(day),
          score       : 0
        });
      }
    };

    var domain = x.domain();
    var format = d3.time.format('%d-%m-%Y');
    var maxDay = new Date(domain[1]);

    maxDay.setDate(maxDay.getDate() + 1);
    var days = d3.time.days(domain[0], maxDay);

    for(var key in strategies){ days.forEach(fill); }
  }
};
