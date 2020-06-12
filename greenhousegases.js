var xScale = d3.scaleLinear()
			.range([ padding[3], w - padding[1] ]);

		var xAxis = d3.axisBottom(xScale)
			.ticks(10, ".0s")
            .tickSizeOuter(0);
            var countriesCircles = svg.selectAll(".countries")
			.data(dataSet, function(d) { return d.countryCode});//join the data

		countriesCircles.exit()//this is the exit selection
			.transition()
	    	.duration(1000)
	    	.attr("cx", 0)
			.attr("cy", (h / 2)-padding[2]/2)
			.remove();

		countriesCircles.enter()//this is the enter selection
			.append("circle")
			.attr("class", "countries")
			.attr("cx", 0)
			.attr("cy", (h / 2)-padding[2]/2)
			.attr("r", 3)
			.attr("fill", function(d){ return colors(d.continent)})
			.merge(countriesCircles)//and the "merge" unify enter and update selections!
			.transition()
	    	.duration(2000)
	    	.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });


    