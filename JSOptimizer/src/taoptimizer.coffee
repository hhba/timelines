
#
# This class represents a problem instance you wish to optimize. To
# use it subclass it and implement the energy() (cost function) and
# the step() function which generates a new configuration.
#

class ProblemInstance

	# Calculate cost function for current configuration
	energy: ->
		return 1

	# Change current configuration and return it
	step: ->

	# Discard last step
	discard: ->


#
#
# This is a threshold acceptance (TA) optimizer implemented
# in Coffeescript.
#

class TAOptimizer

	# Callback function
	callback: null

	# Problem instance to optimize
	instance: ->

	# Current solution
	solution: null

	# Current solution we are evaluating
	candidateSolution: null

	# Optimization params
	params: {
		maxE: -1000000, # Max cost function
		minE: 1000000,  # Min cost function.
		initialThreshold: 1,       # Threshold for acceptance
		scaleIterationFactor: 0.99, # How much to scale the current threshold (always < 1!)
		maxThresholdIter: 100,	# Max number of iterations before lowering threshold
		maxIter: 290000,	# Max number of iterations
		debug: true,
	}

	constructor: (@instance, params = null) ->
		if params != null
			@params = params

	# Main routine 
	start: ->
		console.log 'Starting optimization.' if @params.debug

		# initial values
		@running   = true
		@currentE  = @params.minE
		@threshold = @params.initialThreshold
		@solution  = null
		@numIter   = 0

	step: (count) ->

		for i in [0..count]
			# step
			@candidateSolution = @instance.step()

			# calculate energy
			newE = @instance.energy()

			deltaE = newE - @currentE
			if deltaE < 0 or deltaE < @threshold
				@currentE = newE
				@solution = @candidateSolution
			else
				@instance.discard()

			# see if we need to change threshold
			@numIter++
			if @numIter % @params.maxThresholdIter == 0
				@threshold = @params.scaleIterationFactor * @threshold
				console.log "currentE =  #{@currentE} "
				#console.log @solution if @params.debug

				# Make call to callback if set
				@callback(this) if @callback != null

			if @numIter > @params.maxIter
				@running = false

		return @running

# Set to window
window.TAOptimizer = TAOptimizer
window.ProblemInstance = ProblemInstance

# vim: se ts=2 sw=2 ai expantab:
