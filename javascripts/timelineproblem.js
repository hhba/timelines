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
      _ref3 = this.problem.groups;
      for (k in _ref3) {
        v = _ref3[k];
        this.groupPosition[k] = delta * i;
        i++;
      }
      this.solution = new Array(this.numCharacters);
      for (i = 0, _ref4 = this.numCharacters; 0 <= _ref4 ? i <= _ref4 : i >= _ref4; 0 <= _ref4 ? i++ : i--) {
        this.solution[i] = [];
      }
    }
    TimeLineProblem.prototype.energy = function() {
      var charData, cost, i, j, numSegments, segment, segments, _ref;
      charData = mergeSegments(this.problem.eventList, this.groupPosition);
      cost = 0;
      for (j = 0, _ref = charData.length; 0 <= _ref ? j <= _ref : j >= _ref; 0 <= _ref ? j++ : j--) {
        segments = charData[j].segments;
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
        _ref = this.groupPosition;
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
