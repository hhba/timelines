
class TimeLineProblem extends ProblemInstance

  @solution: []
  @prevSolution: []
 
  @numGroups: 0
  @numCharacters: 0

  @characterPosition: {}

  # problem instance
  @problem: []
 
  # Hash con las posiciones de cada 
  @groupPosition: []

  constructor: (@problem) ->

    # contar personajes
    @numCharacters = 0
    for k, v of @problem.eventList
      @numCharacters++
    @numCharacters = @problem.eventList

    # contar grupos
    @numGroups = 0
    for k, v of @problem.groups
      @numGroups++
  
    @solution = new Array(@numCharacters)

    for i in [0 .. @numCharacters]
      @solution[i] = []

    @groupPosition = new Array(@numGroups)
    delta = 100.0 / @numGroups;
    for i in [0 .. @numGroups]
      @groupPosition[i] = delta * i

    # Create array to save current solution
    @prevSolution = new Array(@numCharacters)

  energy: ->

    charData = mergeSegments(@problem.eventList, @groupPosition)

    # calculo la longitud
    cost = 0
    for j in [0 .. charData.length]
      segments = charData[j].segments
      numSegments = segments.length
      for i in [0 .. numSegments]
        segment = segments[i]
        cost += Math.abs(segment.end[1] - segment.start[1])

    return cost

  step: ->

    # Make a backup
    @prevSolution = (item for item in @groupPosition)

    # Choose one vertex
    i = Math.round( Math.random() *  @numGroups )
    i = @numGroups - 1 if i > @numGroups

    # Choose another vertex
    j = Math.round( Math.random() *  @numGroups )
    j = @numGroups - 1 if j > @numGroups

    # delta is a randum number between +/- 0.1
    delta = ( Math.random() - 0.5 ) * ( 0.2 * 100.0 / @numGroups )

    # Determine what to do
    numOperations = 2
    op = Math.round( Math.random() * numOperations )
    if op == 0
      prevPos = @groupPosition[i]
      @groupPosition[i] = @groupPosition[j]
      @groupPosition[j] = prevPos
    else if op == 1
      @groupPosition[i] += delta
    
    return @solution

  discard: ->
    # restore previous solution
    @solution = (item for item in @prevSolution)

window.TimeLineProblem = TimeLineProblem

# vim: se ts=2 sw=2 expandtab ai: