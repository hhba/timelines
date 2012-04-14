
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
  @groupNames: []

  constructor: (@problem) ->

    # contar personajes
    @numCharacters = 0
    for k, v of @problem.eventList
      @numCharacters++
   
    # contar grupos
    @groupPosition = {}
    @numGroups = 0
    for k, v of @problem.groups
      @numGroups++

    delta = 100.0 / @numGroups
    i = 0
    @groupNames = new Array(@numGroups);
    for k, v of @problem.groups
      @groupNames[i] = k
      @groupPosition[k] = delta * i
      i++
  
    @solution = new Array(@numCharacters)

    for i in [0 .. @numCharacters]
      @solution[i] = []

    #@groupPosition = new Array(@numGroups)
    #for i in [ 0 .. @numGroups]
    #  @groupPosition[i] = delta * i

    # Create array to save current solution
    #@prevSolution = new Array(@numCharacters)

  energy: ->

    charData = mergeSegments(@problem.eventList, @groupPosition)

    # calculo la longitud
    cost = 0
    for j in [0 .. charData.length - 1]
      segments = charData[j].segments
      numSegments = segments.length
      for i in [0 .. numSegments - 1]
        segment = segments[i]
        cost += Math.abs(segment.end[1] - segment.start[1])

    return cost

  step: ->

    # Make a backup
    @prevGroupPosition = {}
    for k, v of @problem.groups
      @prevGroupPosition[k] = @groupPosition[k]

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
      from = @groupNames[i]
      to   = @groupNames[j]
      prevPos = @groupPosition[to]
      @groupPosition[to] = @groupPosition[from]
      @groupPosition[from] = prevPos
    else if op == 1
      from = @groupNames[i]
      @groupPosition[from] += delta
    
    @solution = mergeSegments(@problem.eventList, @groupPosition)
    return @solution

  discard: ->
    # restore previous solution
    @groupPosition = {}
    for k, v of @problem.groups
      @groupPosition[k] = @prevGroupPosition[k]

window.TimeLineProblem = TimeLineProblem

# vim: se ts=2 sw=2 expandtab ai: