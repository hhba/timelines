# JSOptimizer

This is a simple optimization class written in Coffeescript. It can be used to solve minimization
problems. It uses the Threshold Accepting (TA) algorithm. To use it you must implement the 
ProblemInstance interface which has three methods:

 * step() generates a new state by perturbing the current state. You need to save
   the current state because you might have to discard that state via de discard()
   method
 * energy() - returns the energy of the current state. The algorithm tries to
   minimize this energy
 * discard() - if the new state is not good it can be discarded so all operations
   done in step must be reversed

To use the optimization class do:


```javascript
    // params for optimizer.
    var params = {
        maxE: -1000000,
        minE: 1000000,
        initialThreshold: 1,
        scaleIterationFactor: 0.9,
        maxThresholdIter: 2000,
        maxIter: 2000000,
        debug: true
    };

    // instantiate your problem instance (should implement the ProblemInstance interface)
    var problemInstance = new CircleProblem(50);

    // create an instance of the optimizer and initialize it
    var optimizer = new TAOptimizer(problemInstance, params);
    optimizer.start();

    // save it to window so it is global
    window.optimizer = optimizer;

    // loop and see how it changes. This method will not freeze your browser since if
    // while the optimizer is executing the step() function the browser will freeze.
    var doLoop = function() { 
      r = optimizer.step(2000); 
      if (r) {
            window.setTimeout(doLoop, 1);
        }
    };
    doLoop();
```
