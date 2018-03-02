// Puja Chandrikasingh
// Data Processing - Week 4

window.onload = function() {	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
	
	// create chart and append a g so there is space for the title (and axis)
	var svg = d3.select(".legend")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// add a title
	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top/2.5))
		.attr("class", "title")
		.attr("text-anchor", "middle")
        .text("Reproduction of the legend in the assignment");
		
	var color = ["white", "#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026", "black"],
	legend_text = ["std. dev.", "0<1", "1<2", "2<3", "3<4", "4<5", "missing value"];
	
	
	// create legend holder at the right position for the colors
	var legendHolder = svg.append('g')
		.attr('transform', "translate("+ width/5 +","+ (height/2.5)+ ")")
			
	// create legend	
	var legend = legendHolder.selectAll(".legend")
		.data(["white", "#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026", "black"])
		.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
			
	// add legend colors
	legend.append("rect")
		.attr("x", width/2 - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function(d, i){ return color[i]});

	// add legend text
	legend.append("text")
		.attr("x", width/2 + 18)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "begin")
		.text(function(d, i) { return legend_text[i]; });
}