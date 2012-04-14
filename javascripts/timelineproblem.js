(function() {
  var TimeLineProblem;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  TimeLineProblem = (function() {
    __extends(TimeLineProblem, ProblemInstance);
    TimeLineProblem.solution = [];
    TimeLineProblem.prevSolution = [];
    TimeLineProblem.numGroups = 0;
    TimeLineProblem.numCharacters = 0;
    TimeLineProblem.characterPosition = {};
    TimeLineProblem.problem = [];
    TimeLineProblem.groupPosition = [];
    function TimeLineProblem(problem) {
      var delta, i, k, v, _len, _len2, _ref, _ref2, _ref3, _ref4;
      this.problem = problem;
      this.numCharacters = 0;
      _ref = this.problem.eventList;
      for (v = 0, _len = _ref.length; v < _len; v++) {
        k = _ref[v];
        this.numCharacters++;
      }
      this.numCharacters = this.problem.eventList;
      this.numGroups = 0;
      _ref2 = this.problem.groups;
      for (v = 0, _len2 = _ref2.length; v < _len2; v++) {
        k = _ref2[v];
        this.numGroups++;
      }
      this.solution = new Array(this.numCharacters);
      for (i = 0, _ref3 = this.numCharacters; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
        this.solution[i] = [];
      }
      this.groupPosition = new Array(this.numGroups);
      delta = 100.0 / this.numGroups;
      for (i = 0, _ref4 = this.numGroups; 0 <= _ref4 ? i <= _ref4 : i >= _ref4; 0 <= _ref4 ? i++ : i--) {
        this.groupPosition[i] = delta * i;
      }
      this.prevSolution = new Array(this.numCharacters);
    }
    TimeLineProblem.prototype.energy = function() {
      var c, charData, cost, i, k, numSegments, segment, segments, _len;
      charData = mergeSegments(this.problem.eventList, this.groupPosition);
      cost = 0;
      for (c = 0, _len = charData.length; c < _len; c++) {
        k = charData[c];
        segments = c.segments;
        numSegments = segments.length;
        for (i = 0; 0 <= numSegments ? i <= numSegments : i >= numSegments; 0 <= numSegments ? i++ : i--) {
          segment = segments[i];
          cost += Math.abs(segment.end[1] - segment.start[1]);
        }
      }
      return cost;
    };
    TimeLineProblem.prototype.step = function() {
      var delta, i, item, j, numOperations, op, prevPos;
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
      i = Math.round(Math.random() * this.numGroups);
      if (i > this.numGroups) {
        i = this.numGroups - 1;
      }
      j = Math.round(Math.random() * this.numGroups);
      if (j > this.numGroups) {
        j = this.numGroups - 1;
      }
      delta = (Math.random() - 0.5) * (0.2 * 100.0 / this.numGroups);
      numOperations = 2;
      op = Math.round(Math.random() * numOperations);
      if (op === 0) {
        prevPos = this.groupPosition[i];
        this.groupPosition[i] = this.groupPosition[j];
        this.groupPosition[j] = prevPos;
      } else if (op === 1) {
        this.groupPosition[i] += delta;
      }
      return this.solution;
    };
    TimeLineProblem.prototype.discard = function() {
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
    return TimeLineProblem;
  })();
  window.TimeLineProblem = TimeLineProblem;
}).call(this);
