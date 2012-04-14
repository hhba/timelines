(function() {
  var CircleProblem;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  CircleProblem = (function() {
    __extends(CircleProblem, ProblemInstance);
    CircleProblem.solution = [];
    CircleProblem.prevSolution = [];
    CircleProblem.prototype.numPoints = 10;
    function CircleProblem(numPoints) {
      var i, _ref;
      this.numPoints = numPoints;
      this.solution = new Array(numPoints + 1);
      for (i = 0, _ref = this.numPoints; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        this.solution[i] = Math.random();
      }
      this.solution[0] = 0;
      this.solution[this.numPoints] = 0;
      this.prevSolution = new Array(numPoints + 1);
    }
    CircleProblem.prototype.energy = function() {
      var area, delta, i, perimeter, _ref;
      perimeter = this.solution[0] + this.solution[this.numPoints];
      area = 0.0;
      delta = 2.0 / this.numPoints;
      for (i = 0, _ref = this.numPoints - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        area += delta * (this.solution[i] + this.solution[i + 1]) / 2.0;
        perimeter += Math.sqrt(delta * delta + Math.pow(this.solution[i + 1] - this.solution[i], 2));
      }
      return perimeter * perimeter / area;
    };
    CircleProblem.prototype.step = function() {
      var delta, i, item;
      this.prevSolution = (function() {
        var _i, _len, _ref, _results;
        _ref = this.solution;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item);
        }
        return _results;
      }).call(this);
      i = Math.round(Math.random() * this.numPoints);
      if (i >= this.numPoints) {
        i = this.numPoints - 1;
      }
      if (i === 0) {
        i = 1;
      }
      delta = (Math.random() - 0.5) * 0.1;
      this.solution[i] += delta;
      if (this.solution[i] < 0) {
        this.solution[i] = 0;
      }
      if (this.solution[i] > 1) {
        this.solution[i] = 1;
      }
      return this.solution;
    };
    CircleProblem.prototype.discard = function() {
      var item;
      return this.solution = (function() {
        var _i, _len, _ref, _results;
        _ref = this.prevSolution;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item);
        }
        return _results;
      }).call(this);
    };
    return CircleProblem;
  })();
  window.CircleProblem = CircleProblem;
}).call(this);
