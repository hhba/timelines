#!/bin/bash -x 

coffee -o javascripts -c JSOptimizer/src/taoptimizer.coffee 
coffee -o javascripts -c src/timelineproblem.coffee 
