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
    TimeLineProblem.groupNames = [];
    function TimeLineProblem(problem) {
      var delta, i, k, v, _ref, _ref2, _ref3, _ref4;
      this.problem = problem;
      this.numCharacters = 0;
      _ref = this.problem.eventList;
      for (k in _ref) {
        v = _ref[k];
        this.numCharacters++;
      }
      this.groupPosition = {};
      this.numGroups = 0;
      _ref2 = this.problem.groups;
      for (k in _ref2) {
        v = _ref2[k];
        this.numGroups++;
      }
      delta = 100.0 / this.numGroups;
      i = 0;
      this.groupNames = new Array(this.numGroups);
      _ref3 = this.problem.groups;
      for (k in _ref3) {
        v = _ref3[k];
        this.groupNames[i] = k;
        this.groupPosition[k] = delta * i;
        i++;
      }
      this.solution = new Array(this.numCharacters);
      for (i = 0, _ref4 = this.numCharacters; 0 <= _ref4 ? i <= _ref4 : i >= _ref4; 0 <= _ref4 ? i++ : i--) {
        this.solution[i] = [];
      }
    }
    TimeLineProblem.prototype.energy = function() {
      var charData, cost, i, j, numSegments, segment, segments, _ref, _ref2;
      charData = mergeSegments(this.problem.eventList, this.groupPosition);
      cost = 0;
      for (j = 0, _ref = charData.length - 1; 0 <= _ref ? j <= _ref : j >= _ref; 0 <= _ref ? j++ : j--) {
        segments = charData[j].segments;
        numSegments = segments.length;
        for (i = 0, _ref2 = numSegments - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
          segment = segments[i];
          cost += Math.abs(segment.end[1] - segment.start[1]);
        }
      }
      return cost;
    };
    TimeLineProblem.prototype.step = function() {
      var delta, from, i, j, k, numOperations, op, prevPos, to, v, _ref;
      this.prevGroupPosition = {};
      _ref = this.problem.groups;
      for (k in _ref) {
        v = _ref[k];
        this.prevGroupPosition[k] = this.groupPosition[k];
      }
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
        from = this.groupNames[i];
        to = this.groupNames[j];
        prevPos = this.groupPosition[to];
        this.groupPosition[to] = this.groupPosition[from];
        this.groupPosition[from] = prevPos;
      } else if (op === 1) {
        from = this.groupNames[i];
        this.groupPosition[from] += delta;
      }
      this.solution = mergeSegments(this.problem.eventList, this.groupPosition);
      return this.solution;
    };
    TimeLineProblem.prototype.discard = function() {
      var k, v, _ref, _results;
      this.groupPosition = {};
      _ref = this.problem.groups;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(this.groupPosition[k] = this.prevGroupPosition[k]);
      }
      return _results;
    };
    return TimeLineProblem;
  })();
  window.TimeLineProblem = TimeLineProblem;
}).call(this);
