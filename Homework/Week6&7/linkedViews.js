/*
** Puja Chandrikasingh
** Data Processing - Week 6 & 7
**
** Main script for the linked views, from here all the other functions are called.
*/

// global variables
var x0, x1, y, z, dotSize, barChartWidth, barChartHeight, barChartG, 
	barChartMargin, tipBarChart, tipTree, treeLayout, treeG, yearKey;

window.onload = function() {
	
	// set right values for the bar chart and the tree
	var barChartSvg = d3.select(".chart");
	barChartMargin = {top: 30, right: 10, bottom: 100, left: 35};
	barChartWidth = barChartSvg.attr("width") - barChartMargin.left 
		- barChartMargin.right;
	barChartHeight = barChartSvg.attr("height") - barChartMargin.top 
		- barChartMargin.bottom;
	barChartG = barChartSvg.append("g")
		.attr("transform", 
			"translate(" + barChartMargin.left + "," + barChartMargin.top + ")");

	var treeSvg = d3.select(".tree"),
		treeMargin = {top: 50, right: 20, bottom: 50, left: 40},
		treeWidth = treeSvg.attr("width") - treeMargin.left - treeMargin.right,
		treeHeight = treeSvg.attr("height") - treeMargin.top - treeMargin.bottom;
	treeG = treeSvg.append("g")
		.attr("transform", 
			"translate(" + treeMargin.left + "," + treeMargin.top + ")");	
	treeG.append("g").attr("class", "nodes");
	treeG.append("g").attr("class", "links");
	treeLayout = d3.tree()
		.size([treeWidth, treeHeight]);
	
	// make tips for both graphics
	tipBarChart = d3.tip()
		.attr("class", "tip")
		.html(function(d) { return d.value + "%"});
	barChartSvg.call(tipBarChart);
	
	tipTree = d3.tip()
		.attr("class", "tip")
		.html(function(d) { return d.data.name + "%" });
	treeSvg.call(tipTree);
	
	// add titles
	barChartG.append("text")
		.attr("x", (barChartWidth / 2))             
		.attr("y", - (barChartMargin.top / 1.5))
		.attr("class", "title")
		.text("Langdurige armoede in Nederland");
		
	treeG.append("text")
		.attr("x", (treeWidth / 2))             
		.attr("y", - (treeMargin.top / 1.5))
		.attr("class", "title")
		.text("Langdurige armoede mannen vs vrouwen*");
	
	// scale functions
	x0 = d3.scaleBand()
		.rangeRound([0, barChartWidth])
		.paddingInner(0.1);

	x1 = d3.scaleBand()
		.padding(0.05);

	y = d3.scaleLinear()
		.rangeRound([barChartHeight, 0]);

	z = d3.scaleOrdinal()
		.range(["#98abc5", "#8a89a6"]);
	
	dotSize = d3.scaleLinear()
		.rangeRound([5, 15]);


	// load data
	d3.queue()
		.defer(d3.json, "2014.json")
		.defer(d3.json, "2015.json")
		.defer(d3.json, "2016.json")
		.await(analyze);
	
	/* 
	** This function converts the data and draws the graphics the first time.
	*/
	function analyze(error, data2014, data2015, data2016) {
		
		// make sure the data is loaded
		if (error) {
			window.alert("The data could not be loaded.");
			throw error;
		}
		
		var dataArray = [data2014, data2015, data2016];
		
		// correct data type
		dataArray.forEach(function(data) {
			data.forEach(function(d) {
				d.Value.forEach(function(s) {
					s.Values.Min1yr = + s.Values.Min1yr;
					s.Values.Min4yr = + s.Values.Min4yr;
				});
			});
		});
		
		// start listening to selected year
		var selectionYear = document.getElementById("selectedYear");
		selectionYear.onchange = function(){ 
			changeYear(selectionYear.value, data2014, data2015, data2016); 
		};
		
		yearKey = ["Min1yr", "Min4yr"];
		
		// make the graphics for the first time
		initTree();
		initBarChart(data2014["0"]["Value"], data2014["1"]["Value"], 
			data2014["2"]["Value"]);
	}
}

/*
** Function to listen for changes in the selected year and update the bar chart.
*/
function changeYear(selectedYear, data2014in, data2015in, data2016in) {
	if (selectedYear == 2014) {
		update(data2014in["0"]["Value"], data2014in["1"]["Value"], data2014in["2"]["Value"]);
	}
	else if (selectedYear == 2015) {
		update(data2015in["0"]["Value"], data2015in["1"]["Value"], data2015in["2"]["Value"]);
	}
	else if (selectedYear == 2016) {
		update(data2016in["0"]["Value"], data2016in["1"]["Value"], data2016in["2"]["Value"]);
	}
}