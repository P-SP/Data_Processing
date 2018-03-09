/*
** Puja Chandrikasingh
** Data Processing - Week 5
*/

// global variables
var svg, margin, width, height, g, x, y, z, mouseG;

window.onload = function() {											

	svg = d3.select(".chart"),
		margin = {top: 60, right: 80, bottom: 30, left: 50},
		width = svg.attr("width")-margin.left-margin.right,
		height = svg.attr("height")-margin.top-margin.bottom,
		g = svg.append("g").attr("transform", "translate("+margin.left+","
			+margin.top+")");
	
	// add a title
	g.append("text")
		.attr("x", (width/2))             
		.attr("y", 0-(margin.top/1.5))
		.attr("class", "title")
		.attr("text-anchor", "middle")
		.text("Temperature in the Netherlands");
	
	// add a subtitle
	g.append("text")
		.attr("x", (width/2))             
		.attr("y", 0-(margin.top/2.8))
		.attr("class", "subtitle")
		.attr("text-anchor", "middle")
		.text("in 1997");
	
	// scale functions
	x = d3.scaleTime().range([0, width]),
	y = d3.scaleLinear().range([height, 0]),
	z = d3.scaleOrdinal(d3.schemeCategory10);

	// define the line
	line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.temperature); });
	
	// load all data
	d3.queue()
		.defer(d3.json, "1997.json")
		.defer(d3.json, "2007.json")
		.defer(d3.json, "2017.json")
		.await(analyze);
	
	function analyze(error, data1997, data2007, data2017) {
		
		// make sure the data is loaded
		if (error) {
			window.alert("The data could not be loaded.");
			throw error;
		}
		
		var dataArray = [data1997, data2007, data2017],
			parseDate = d3.timeParse("%Y%m%d");
		
		// correct data type (Celsius not 0.1 Celsius)
		dataArray.forEach(function(data) {
			data.forEach(function(d) {
				d.values.forEach(function(s) {
					s.temperature = s.temperature/10;
					s.date = parseDate(s.date);
				});
			});
		});
		
		// start listening to selected year
		var selectionYear = document.getElementById("selectedYear");
		selectionYear.onchange = function(){changeYear(selectionYear.value, 
			data1997, data2007, data2017); };
		
		// make the graph for the first time
		init(data1997);
	}
}

/*
** Function for drawing the graph for the first time.
*/
function init(data) {
	
	// append axis holder
	g.append("g")
		.attr("class", "axisX")
		.attr("transform", "translate(0,"+height+")")
	g.append("g")
		.attr("class", "axisY")
		.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -margin.left/1.2)
				.attr("dy", "0.71em")
				.attr("fill", "#000")
				.text("Temperature (\u2103)");
	
	// scale and draw the axis
	axis(data);
	
	createLegend(data);
	
	// append data the first time
	var tempKind = g.selectAll(".tempKind")
		.data(data)
		.enter().append("g")
			.attr("class", "tempKind");
	
	// draw the lines
	tempKind.append("path")
		.attr("class", "line")
		.attr("d", function(d) {return line(d.values); })
		.style("stroke", function(d) { return z(d.z); });
	
	// cross-hair
	crosshairInit(data);
}

/*
** Function for drawing the axis.
*/
function axis(data) {		
		
		// scale
		x.domain([
			d3.min(data, function(d) { 
				return d3.min(d.values, function(s) { return s.date; }); 
			}),
			d3.max(data, function(d) { 
				return d3.max(d.values, function(s) { return s.date; }); 
			})
		]).nice();	
		
		y.domain([
			d3.min(data, function(d) { 
				return d3.min(d.values, function(s) { return s.temperature; }); 
			}),
			d3.max(data, function(d) { 
				return d3.max(d.values, function(s) { return s.temperature; }); 
			})
		]).nice();
		
		z.domain(data.map(function(d) { return d.z; }));
		
		// add axis
		g.select(".axisX")
			.call(d3.axisBottom(x));

		g.select(".axisY")
			.call(d3.axisLeft(y))
}

/*
** Function for drawing the legend.
*/
function createLegend(data) {
	var legendHolder = svg.append('g')
		.attr('transform', "translate("+ margin.right +",0)")
	
	// create legend	
	var legend = legendHolder.selectAll(".legend")
		.data(z.domain())
		.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0,"+i*20+")"; });

	// add legend colors
	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", z);
	
	// add legend text
	legend.append("text")
		.attr("class", "legendText")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d, i) { return data.map(function(d) { return d.z; })[i]; });
}

/*
** Function for drawing the cross-hair for the first time.
*/
function crosshairInit(data) {
	mouseG = g.append("g")
		.attr("class", "mouse-over-effects");
	
	// vertical line to follow mouse 
	mouseG.append("path")
		.attr("class", "mouse-line")
		.style("stroke", "black")
		.style("stroke-width", "1px")
		.style("opacity", "0");
	
	// white background for the date
	mouseDateRect = mouseG.append("rect")
		.attr("class", "line-date-holder")
		.attr("width", 150)
		.attr("height", 20)
		.attr("opacity", "0")
		.style("fill", "white")
	
	// date text
	mouseDateText = mouseG.append("text")
			.attr("fill", "black")
			.attr("opacity", "0")
			.attr("class", "line-date");
	
	// for all the lines we need a g
	var mousePerLine = mouseG.selectAll('.mouse-per-line')
		.data(data)
		.enter().append("g")
		.attr("class", "mouse-per-line");
	
	// append circles
	mousePerLine.append("circle")
		.attr("r", 4)
		.style("stroke", function(d) {
			return z(d.z);
		})
		.style("fill", function(d) {
			return z(d.z);
		})
		.style("stroke-width", "1px")
		.style("opacity", "0");

	// append rect as background for the text
	mousePerLine.append("rect")
		.attr("width", 48)
		.attr("height", 18)
		.style("fill", function(d) {
			return z(d.z);
		})
		.style("opacity", "0")
		.attr("transform", function(d, i) {
			var xtrans = i == 0 ? -55 : 7
			return "translate(" + xtrans + ", -11)"
		});
		
    // append text
	mousePerLine.append("text")
		.attr("fill", "white")
		.attr("transform", function(d, i) {
			var xtrans = i == 0 ? -50 : 13
			return "translate(" + xtrans + ", 1)"
		});

	// catch mouse movements and react
	mouseG.append('svg:rect') 
		.attr("class", "crosshair")
		.attr('width', width)
		.attr('height', height)
		.attr('fill', 'none')
		.attr('pointer-events', 'all')
		.on('mouseout', function() {
			d3.select(".mouse-line")
				.style("opacity", "0");
			d3.selectAll(".mouse-per-line circle")
				.style("opacity", "0");
			d3.selectAll(".mouse-per-line rect")
				.style("opacity", "0");
			d3.selectAll(".mouse-per-line text")
				.style("opacity", "0");
			d3.selectAll(".line-date")
				.style("opacity", "0");
			d3.selectAll(".line-date-holder")
				.style("opacity", "0");
		})
		.on('mouseover', function() {
			d3.select(".mouse-line")
				.style("opacity", "1");
			d3.selectAll(".mouse-per-line circle")
				.style("opacity", "1");
			d3.selectAll(".mouse-per-line rect")
				.style("opacity", "1");
			d3.selectAll(".mouse-per-line text")
				.style("opacity", "1");
			d3.selectAll(".line-date")
				.style("opacity", "1");
			d3.selectAll(".line-date-holder")
				.style("opacity", "1");
		});
		
	// finish drawing the cross-hair
	crosshair(data);
}

/*
** Function for drawing the cross-hair.
*/
function crosshair(data) {
	
	// all the lines
	var lines = document.getElementsByClassName('line');
	
	// load right data 
	var mousePerLine = mouseG.selectAll('.mouse-per-line')
		.data(data)
	
	// add function for when the mouse moves
	mouseG.select('.crosshair')
		.on('mousemove', function() { 
			var mouse = d3.mouse(this);
			d3.select(".mouse-line")
				.attr("d", function() {
				var d = "M" + mouse[0] + "," + height;
				d += " " + mouse[0] + "," + 0;
				return d;
			});
	
			d3.selectAll(".mouse-per-line")
			.attr("transform", function(d, i) {
				var xDate = x.invert(mouse[0]);
					bisect = d3.bisector(function(d) { return d.date; }).right;
					index = Math.max(bisect(d.values, xDate)-1, 0)
					posY = y(d.values[index].temperature)
					posX = x(d.values[index].date);
				
				// change the temperature
				d3.select(this).select('text')
					.text(d.values[index].temperature + " \u2103");
					
				// change date
				var dateFormat = d3.timeFormat("%d %B %Y");
				d3.select(".line-date-holder")
					.attr("transform", "translate("+(posX-50)+","+(height-30)+")");
				d3.select(".line-date")
					.attr("transform", "translate("+(posX-40)+","+(height-15)+")")
					.text(dateFormat(xDate));
				
				return "translate("+posX+","+posY+")";
			});
		});
}

/*
** Function to listen for changes in the selected year.
*/
function changeYear(selectedYear, data1997in, data2007in, data2017in) {
	
	if (selectedYear == 1997) {
		update(data1997in, 1997);
	}
	else if (selectedYear == 2007) {
		update(data2007in, 2007);
	}
	else if (selectedYear == 2017) {
		update(data2017in, 2017);
	}
}

/*
** Function to update the graph when the selected year has changed.
*/
function update(data, year){
	d3.select(".subtitle").text("in " + year);
	axis(data);
	draw(data);
	crosshair(data);
}

/*
** Function to draw the lines with the new data.
*/
function draw(data) {
	
	// add all the data
	var tempKind = g.selectAll(".tempKind")
		.data(data)
		
	// draw the lines
	tempKind.select("path")
		.attr("d", function(d) {return line(d.values); })
		.style("stroke", function(d) { return z(d.z); });
}
