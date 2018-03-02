// Puja Chandrikasingh
// Data Processing - Week 4

window.onload = function() {	
	
	var margin = {top: 60, right: 230, bottom: 40, left: 40},
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	// scale functions
	var x = d3.scale.linear()
		.range([0, width]);
	var y = d3.scale.linear()
		.range([height, 0]);
	var color = d3.scale.category10();
	var linearSize = d3.scale.linear()
		.range([5, 35]);

	// create axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	
	var tip = createTip();
	
	var svg = createScatter();

	// load data and plot it
	d3.json("data.json", function(error, data) {
		
		// make sure the data is loaded
		if (error) {
			window.alert("The data could not be loaded.");
			throw error;
		}

		// change data if needed to integers
		data.forEach(function(d) {
			d["HPI Rank"] = +d["HPI Rank"];
			d["Average Life Expectancy"] = +d["Average Life Expectancy"];
			d["GDP/capita($PPP)"] = +d["GDP/capita($PPP)"];
			d.Population = +d.Population;
		});

		// set the domains
		x.domain([0, d3.max(data, function(d) { return d["GDP/capita($PPP)"]; })]).nice();
		y.domain([0, d3.max(data, function(d) { return d["Average Life Expectancy"]; })]).nice();
		linearSize.domain(d3.extent(data, function(d) { return d["Population"]; })).nice();

		// plot the data and axis
		drawAxis();
		drawDots(data);
		
		// color legend
		createColorLegend(data);
		
		// size legend
		createSizeLegend(data);
			
	});
	
	// create a tip with the right content
	function createTip() {
		var tip = d3.tip()
		.attr("class", "d3-tip")
		.html(function(d){
			return "Country: " + d.Country + ", HPI Rank: " + d["HPI Rank"] +
			"<br/> Life Expectancy: " + d["Average Life Expectancy"] + 
			"<br/> GDP/capita: $" + d["GDP/capita($PPP)"] +
			"<br/> Population: " + d.Population;
		})
		return tip;
	}
		
	// create a scatter svg with title and subtitle
	function createScatter() {
			
		// get the scatter plot svg and append a g (reserving title and axis space)	
		var svg = d3.select(".scatterplot")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.call(tip)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// add a title
		svg.append("text")
			.attr("x", (width / 2))             
			.attr("y", 0 - (margin.top/1.5))
			.attr("class", "title")
			.attr("text-anchor", "middle")
			.text("Relation between life expectancy, GDP/capita and region");
			
		// add a subtitle
		svg.append("text")
			.attr("x", (width / 2))             
			.attr("y", 0 - (margin.top/2.8))
			.attr("class", "subtitle")
			.attr("text-anchor", "middle")
			.text("For countries with a GDP/capita below $16 000");
				
		return svg;
	}
		
	// draw axis with title 
	function drawAxis() {
			
		// x axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
				.attr("class", "label")
				.attr("x", width)
				.attr("y", -6)
				.attr("transform", "translate(0," + margin.bottom + ")")
				.style("text-anchor", "end")
				.text("GDP/capita($PPP)");
		
		// y axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("class", "label")
				.attr("transform", "rotate(-90)")
				.attr("y", -margin.left)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Average Life Expectancy");
	}
		
	// fill the plot with data
	function drawDots(data) {
		svg.selectAll(".dot")
			.data(data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", function(d) { 
					return linearSize(d.Population); })
				.attr("cx", function(d) { return x(d["GDP/capita($PPP)"]); })
				.attr("cy", function(d) { return y(d["Average Life Expectancy"]); })
				.style("fill", function(d) { return color(d.Region); })
				.on("mouseover", function(d) {
						tip.show(d);
						d3.select(this).style("fill", "#B0BEC5");
					})
				.on("mouseout", function(d) {
						tip.hide(d); 
						d3.select(this).style("fill", function(d) {
							return color(d.Region);
						});
					});
	}
		
	function createColorLegend(data) {
		var legendHolder = svg.append('g')
			.attr('transform', "translate("+ margin.right +",0)")
		
		// create legend	
		var legend = legendHolder.selectAll(".legend")
			.data(color.domain())
			.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// add legend colors
		legend.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		// add legend text
		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) { return d; });
	}
		
	function createSizeLegend(data) {
		var maxPop = d3.max(data, function(d) { return d["Population"]; });
		var minPop = d3.min(data, function(d) { return d["Population"]; });
		size = [minPop, maxPop/6, maxPop/4, maxPop/2, maxPop];
			
		// create legend holder at the right position for the size
		var legendHolderSize = svg.append('g')
			.attr('transform', "translate("+ margin.right/2 +","+ height/2.5 + ")")
		
		var legendSize = legendHolderSize.selectAll(".legend")
			.data(size)
			.enter().append("g")
				.attr("class", "size legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
					
		// add legend sizes
		legendSize.append("circle")
			.attr("r", function(d, i) { 
				return linearSize(size[i]); })
			.attr("cx", width-40)
			.attr("cy", ySizeLegend(data))
				.style("fill", "black");
				
		// add legend text
		legendSize.append("text")
			.attr("x", width)
			.attr("y", ySizeLegend(data))
			.attr("dy", ".35em")
			.style("text-anchor", "begin")
			.text(function(d, i) { return "Population: " + 
				Math.round(size[i]/1000000 * 100) / 100 + " million"; });
	}
	
	// function for the y values of the size legend
	function ySizeLegend(data) {
		return function(d, i){
			if (i<3) {
				return i*5;
			}
			if (i == 3) {
				return i*8;
			}
			return i*15;
		}
	}
}

