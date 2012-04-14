// --------------------------------------------------------------------------
// Main JS code
// --------------------------------------------------------------------------

// Called when onLoad triggers
$(function() {

  var params = {
      maxE: -1000000, 
      minE: 1000000, 
      initialThreshold: 1,
      scaleIterationFactor: 0.9,
      maxThresholdIter: 4000, 
      maxIter: 2000000,
      debug: true
  };

  var p = new TimeLineProblem(input);

  var optimizer = new TAOptimizer(p, params);

  optimizer.paper = Raphael('solution-div', 400, 400);

  var redraw = function(o) {
    //console.log("Redraw called!");
    var scale = 150;
    var pathString = 'M' + Math.round(0) + ',' + Math.round(o.solution[0] * scale);
    var dx = 2 / o.instance.numPoints * scale;
    for(i = 1; i <= o.instance.numPoints; i++) {
      pathString += 'L' + Math.round(i * dx) + ',' + Math.round(o.solution[i] * scale);
    }
    o.paper.clear()
    o.paper.circle(150,0,150).attr({stroke: '#cc3', 'stroke-width': 4, 'stroke-linejoin': 'round'});
    var path = o.paper.path(pathString).attr({stroke: '#393', "stroke-width": 4, "stroke-linejoin": "round"});
  }

  optimizer.callback = redraw
  optimizer.start();

  window.optimizer = optimizer;

  // loop and see how it changes
  var doLoop = function() { 
    r = optimizer.step(2000); 
    if (r) { 
      $('#energy').html('<p>Current energy: ' + optimizer.instance.energy() + '</p>'); 
      window.setTimeout(doLoop, 1) 
    } 
  };

  $('#start-button').click(function() {
    doLoop();
  });

});


// vim: se ts=2 sw=2 expandtab:
