window.onload = function() {	
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	
	// scale functions
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
		
	var y = d3.scale.linear()
		.range([height, 0]);

	// create axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.outerTickSize(0);
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// create tip for showing data above bar
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.html(function(d){
			return d.Temp + " \u2103";
		})
		
	// create chart and append a g so there is space for the title and axis
	var chart = d3.select(".chart")
		.attr("class", "test Chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.call(tip)
		.append("g")
			.attr("class", "test g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add a title
	chart.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top/5))
		.attr("class", "title")
		.attr("text-anchor", "middle")
        .text("Average temperature in the Netherlands per month in 1997");
		

	// load data and plot it the bar chart
	d3.json("data.json", function(error, data) {
		
		// from temperature in 0.1 degrees Celsius to degrees Celsius
		data.forEach(function(d) {
			d.Temp = d.Temp/10;
		})	
		
		x.domain(data.map(function(d) { return d.Date; }));
		y.domain([d3.min(data, function(d) { return d.Temp; }), 
				d3.max(data, function(d) { return d.Temp; })]).nice();
		
		// draw the y axis including the y axis title
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -margin.left/1.2)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Temperature in degrees Celsius (\u2103)");
		
		// draw the bars
		chart.selectAll(".bar")
			.data(data)
			.enter().append("rect")
				.attr("class", function(d) { 
						return d.Temp < 0 ? "bar neg" : "bar pos"
					})
				.attr("x", function(d) { return x(d.Date); })
				.attr("y", function(d) { return y(Math.max(0,d.Temp)); })
				.attr("height", function(d) { return Math.abs(y(d.Temp)- y(0)); })
				.attr("width", x.rangeBand())
				.on("mouseover", function(d) {
						tip.show(d);
						d3.select(this).style("fill", "#B0BEC5");
					})
				.on("mouseout", function(d) {
						tip.hide(d); 
						d3.select(this).style("fill", function(d) {
							return d.Temp < 0 ? "#4DD0E1" : "#BA68C8"
						});
					});

		// show the x axis
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + y(0) + ")")
			.call(xAxis);
	});
}