// Global variables
var optimizer;
var running = false;
var stopIssued = false;

// Event loop handler
//self.addEventListener(function(e) {
onmessage = function(e) {
  switch(e.data.cmd) {
    case 'run':
      self.runOptimizer(e.data);
      break;
    case 'stop':
      self.stopOptimizer(e.data);
      break;
  }
};
//});

// Run optimization
function runOptimizer(data) {

  // imports
  importScripts(
    'timelineproblem.js', 
    'taoptimizer.js',
    'preprocess.js'
  );

  var p = new navigator.TimeLineProblem(data.problemData);
  optimizer = new navigator.TAOptimizer(p, data.params); 

  optimizer.start();

  // loop while running
  running = true;
  while(running && ! stopIssued) {
    // step maxThresholdIter iterations
    running = optimizer.step(data.params.stepIter);

    // send a redraw command
    var redrawCommand = {
      cmd: 'redraw',
      optimizer: optimizer,
      cost: optimizer.instance.energy(),
    }
    postMessage(redrawCommand);
  }

}

// Stop optimization
function stopOptimizer(data) {
  console.log('stop Optimizer called');
  stopIssued = true;
}