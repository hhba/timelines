(function() {
  var ProblemInstance, TAOptimizer;
  ProblemInstance = (function() {
    function ProblemInstance() {}
    ProblemInstance.prototype.energy = function() {
      return 1;
    };
    ProblemInstance.prototype.step = function() {};
    ProblemInstance.prototype.discard = function() {};
    return ProblemInstance;
  })();
  TAOptimizer = (function() {
    TAOptimizer.prototype.callback = null;
    TAOptimizer.prototype.instance = function() {};
    TAOptimizer.prototype.solution = null;
    TAOptimizer.prototype.candidateSolution = null;
    TAOptimizer.prototype.params = {
      maxE: -1000000,
      minE: 1000000,
      initialThreshold: 1,
      scaleIterationFactor: 0.99,
      maxThresholdIter: 100,
      maxIter: 290000,
      debug: true
    };
    function TAOptimizer(instance, params) {
      this.instance = instance;
      if (params == null) {
        params = null;
      }
      if (params !== null) {
        this.params = params;
      }
    }
    TAOptimizer.prototype.start = function() {
      if (this.params.debug) {
        console.log('Starting optimization.');
      }
      this.running = true;
      this.currentE = this.params.minE;
      this.threshold = this.params.initialThreshold;
      this.solution = null;
      return this.numIter = 0;
    };
    TAOptimizer.prototype.step = function(count) {
      var deltaE, i, newE;
      for (i = 0; 0 <= count ? i <= count : i >= count; 0 <= count ? i++ : i--) {
        this.candidateSolution = this.instance.step();
        newE = this.instance.energy();
        deltaE = newE - this.currentE;
        if (deltaE < 0 || deltaE < this.threshold) {
          this.currentE = newE;
          this.solution = this.candidateSolution;
        } else {
          this.instance.discard();
        }
        this.numIter++;
        if (this.numIter % this.params.maxThresholdIter === 0) {
          this.threshold = this.params.scaleIterationFactor * this.threshold;
          console.log("currentE =  " + this.currentE + " ");
          if (this.callback !== null) {
            this.callback(this);
          }
        }
        if (this.numIter > this.params.maxIter) {
          this.running = false;
        }
      }
      return this.running;
    };
    return TAOptimizer;
  })();
  window.TAOptimizer = TAOptimizer;
  window.ProblemInstance = ProblemInstance;
}).call(this);
