########################################################################
# This class represents the problem of finding a geometrycal
# shape which is made of a list of x,y coordinates limited to
# the x in [-1,1] and y [0,1] which describe a shape with the
# lowest area to permiter ration. The @solution should be a 
# circle
#
########################################################################

class CircleProblem extends ProblemInstance

  @solution: []
  @prevSolution: []
  numPoints: 10

  constructor: (@numPoints) ->
    @solution = new Array(numPoints + 1)
    for i in [0 .. @numPoints]
      @solution[i] = Math.random()
    @solution[0] = 0;
    @solution[@numPoints] = 0;

    # Create array to save current solution
    @prevSolution = new Array(numPoints + 1)

  energy: ->
    perimeter = @solution[0] + @solution[@numPoints]
    area = 0.0
    delta = 2.0 / @numPoints
    for i in [0..@numPoints - 1]
      area += delta * (@solution[i] + @solution[i+1]) / 2.0
      perimeter += Math.sqrt( delta * delta + Math.pow(@solution[i+1] - @solution[i], 2) )

    return  perimeter * perimeter / area

  step: ->
    # Make a backup
    @prevSolution = (item for item in @solution)

    # Choose one vertex and change it
    i = Math.round( Math.random() *  @numPoints )
    i = @numPoints - 1 if i >= @numPoints
    i = 1 if i == 0

    # delta is a randum number between +/- 0.1
    delta = ( Math.random() - 0.5 ) * 0.1
    @solution[i] +=  delta
    if @solution[i] < 0
      @solution[i] = 0
    if @solution[i] > 1
      @solution[i] = 1

    return @solution

  discard: ->
    # restore previous solution
    @solution = (item for item in @prevSolution)

window.CircleProblem = CircleProblem
# vim: se ts=2 sw=2 expandtab ai:
