#!/bin/bash -x 

coffee -o js -c src/taoptimizer.coffee 
coffee -o js -c src/test/areaoptimization.coffee 
