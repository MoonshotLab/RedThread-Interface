// onHover  : callback for hover events
// click    : callback for click events
// width    : the width
// height   : the height
RedThread.Sunburst = function(opts){
  var self = this;

  this.totalSize = 0;
  for(var key in opts){
    self[key] = opts[key];
  }

  return this;
};



RedThread.Sunburst.prototype.updateViewModel = function(type){
  var value = type === "count" ? function() { return 1; } : function(d) { return d.score; };
  this.viewModel = type;

  this.path.data(this.partition.value(value).nodes)
    .transition()
    .duration(500)
    .attrTween('d', this.arcTweenData);
};



RedThread.Sunburst.prototype.draw = function(opts){
  var self = this;
  for(var key in opts){
    self[key] = opts[key];
  }

  var radius = Math.min(this.width, this.height) / 2;

  var x = d3.scale.linear().range([0, 2 * Math.PI]);
  var y = d3.scale.sqrt().range([0, radius]);

  var svgTranslate = 'translate(' + this.width / 2 + ',' + (this.height / 2 + 10) + ')';
  var svg = d3.select(this.selector).append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .append('g')
    .attr('transform', svgTranslate);

  this.partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return 1; });

  var arc = d3.svg.arc()
    .startAngle(function(d)   { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d)     { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d)  { return Math.max(0, y(d.y)); })
    .outerRadius(function(d)  { return Math.max(0, y(d.y + d.dy)); });


  var scoreModel = function(d){ return d.score; };
  if(this.viewModel == 'count')
    scoreModel = function() { return 1; };


  var node = opts.data;
  this.path = svg.datum(node).selectAll('path')
    .data(this.partition.value(scoreModel).nodes)
    .enter()
    .append('path')
    .attr('d', arc)
    .style('fill', function(d) {
      if(d.name == 'sunburst') return '#202020';

      var strategy;
      var alpha;
      if(d.depth === 4){
        alpha = 0.25;
        strategy = d.parent.parent.parent.variety;
      } else if(d.depth === 3){
        alpha = 0.5;
        strategy = d.parent.parent.variety;
      } else if(d.depth === 2){
        alpha = 0.75;
        strategy = d.parent.variety;
      } else if(d.variety){
        alpha = 1;
        strategy = d.variety;
      } else{
        alpha = 1;
        strategy = 'default';
      }

      var color = RedThread.utils.colorScheme[strategy];
      return 'rgba(' + color.join(',') + ', ' + alpha + ')';
    })
    .on('mouseover', mouseover)
    .on('click', click).each(stash);


  this.totalSize = this.path.node().__data__.value;


  function mouseover(d){
    if(self.onHover) self.onHover(d, self.totalSize);
  }


  function click(d){
    node = d;
    self.path.transition().duration(1000).attrTween("d", arcTweenZoom(d));
    if(self.click) self.click(d);
  }


  d3.select(self.frameElement).style('height', opts.height + 'px');


  // Setup for switching data: stash the old values for transition.
  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }


  // When switching data: interpolate the arcs in data space.
  this.arcTweenData = function(a, i) {
    var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    function tween(t) {
      var b = oi(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return arc(b);
    }
    if(i === 0){
     // If we are on the first arc, adjust the x domain to match the root node
     // at the current zoom level. (We only need to do this once.)
      var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
      return function(t) {
        x.domain(xd(t));
        return tween(t);
      };
    } else {
      return tween;
    }
  };


  // When zooming: interpolate the scales.
  function arcTweenZoom(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
      return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }


  function isParentOf(p, c) {
    if (p === c) return true;
    if (p.children) {
      return p.children.some(function(d) {
        return isParentOf(d, c);
      });
    }
    return false;
  }
};
