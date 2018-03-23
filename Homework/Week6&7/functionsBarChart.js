/*
** Puja Chandrikasingh
** Data Processing - Week 6 & 7
**
** This script contains all the functions for the bar chart. It also deals with
** giving data to the tree and setting the right domain values for the tree.
*/

/* 
** This function is for instantiating the bar chart.
*/
function initBarChart(data, dataMale, dataFemale) {

	// append axis holders
	barChartG.append("g")
		.attr("class", "axisX")
		.attr("transform", "translate(0," + barChartHeight + ")");
	
	barChartG.append("g")
		.attr("class", "axisY")
		.append("text")
			.attr("class", "yTitle")
			.attr("transform", "rotate(-90)")
			.attr("y", - barChartMargin.left / 1.2)
			.attr("x", - barChartHeight / 2)
			.attr("dy", "0.32em")
			.text("Percentage %");
	
	axisDraw(data, dataMale, dataFemale);
	createLegend(data);
	
	// draw grouped bars (each group in a g, in each g two rectangles)
	var bars = barChartG.append("g")
		.attr("class" , "barChart")
		.selectAll("g")
		.data(data)
		.enter().append("g")
			.attr("class", "bars")
			.attr("transform", function(d) { 
				return "translate(" + x0(d["Kind"]) + ",0)"; 
			})
			.selectAll("rect")
			.data(function(d) { 
				return yearKey.map(function(key) { 
					
					// make json with minimum years, percentage and the SEC kind
					return {key: key, value: d["Values"][key], kind: d["Kind"]}; 
				}); 
			})
			.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x1(d.key); })
				.attr("y", function(d) { return y(d.value); })
				.attr("width", x1.bandwidth())
				.attr("height", function(d) { return barChartHeight - y(d.value); })
				.attr("fill", function(d) { return z(d.key); })
				.on("mouseover", function(d) {
					tipBarChart.show(d);
					
					// send right values to tree
					var kindMale, kindFemale;
					dataMale.forEach(function(dataM) {
						if (dataM["Kind"] == d.kind) { 
							kindMale = dataM["Values"];
						}
					});
					dataFemale.forEach(function(dataF) {
						if (dataF["Kind"] == d.kind) { 
							kindFemale = dataF["Values"];
						}
					});
					loadTreeData(d.kind, d.value, d.key, kindMale, kindFemale);
				})
				.on("mouseout", tipBarChart.hide);
}

/* 
** This function is for drawing the axis after setting the right domains.
*/
function axisDraw(data, dataMale, dataFemale) {

	// set right domain
	x0.domain(data.map(function(d) { return d["Kind"]; }));
	x1.domain(yearKey).rangeRound([0, x0.bandwidth()]);
	y.domain([0, d3.max(data, function(d) { 
		return d3.max(yearKey, function(key) { return d["Values"][key]; }); 
	})]).nice();
	
	// set right domain for dot size in tree
	var minMale = d3.min(dataMale, function(d) { 
			return Math.min(d.Values.Min1yr, d.Values.Min4yr); 
		}),
		minFemale = d3.min(dataFemale, function(d) { 
			return Math.min(d.Values.Min1yr, d.Values.Min4yr); 
		}),
		maxMale = d3.max(dataMale, function(d) { 
			return Math.max(d.Values.Min1yr, d.Values.Min4yr); 
		}),
		maxFemale = d3.max(dataFemale, function(d) { 
			return Math.max(d.Values.Min1yr, d.Values.Min4yr); 
		});
	dotSize.domain([Math.min(minMale, minFemale), Math.max(maxMale, maxFemale)]);
	
	// add axis
	barChartG.select(".axisX")
		.call(d3.axisBottom(x0).tickSizeOuter(0))
		.selectAll("text")
			.call(wrap, 80)
			.attr("transform", "translate(-30, 30)rotate(-45)");

	barChartG.select(".axisY")
		.call(d3.axisLeft(y).ticks(null, "s"));
}

/* 
** This function adds the legend to the bar chart.
*/
function createLegend(data) {
	var legend = barChartG.append("g")
		.attr("class", "legend")
		.selectAll("g")
		.data(yearKey)
		.enter().append("g")
			.attr("transform", function(d, i) { 
				return "translate(0," + i * 20 + ")"; 
			});

	legend.append("rect")
		.attr("x", barChartWidth - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z);

	legend.append("text")
		.attr("x", barChartWidth - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) {
			if (d == "Min1yr") {
				return "1 jaar of langer"
			} else if (d == "Min4yr") {
				return "4 jaar of langer"
			}
		});
}

/*
** Function to update the graph when the selected year has changed.
*/
function update(data, dataMale, dataFemale) {
	var t = d3.transition()
		.duration(750);
	
	// resize axis
	axisDraw(data, dataMale, dataFemale);
	
	// update the data
	var bars = barChartG.selectAll(".barChart")
		.selectAll(".bars")
			.data(data)
			.selectAll(".bar")
				.data(function(d) { 
					return yearKey.map(function(key) { 
						
						// make json with minimum years, percentage and the SEC kind
						return {key: key, value: d["Values"][key], kind: d["Kind"]}; 
					}); 
				});
				
	// draw bars with a transition
	bars.transition(t)
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return barChartHeight - y(d.value); });
		
	// give new data to the tree on mouseover
	bars.on("mouseover", function(d) {
		tipBarChart.show(d);
			
		// send right values to tree
		var kindMale, kindFemale;
		dataMale.forEach(function(dataM) {
			if (dataM["Kind"] == d.kind) { 
				kindMale = dataM["Values"];
			}
		});
		dataFemale.forEach(function(dataF) {
			if (dataF["Kind"] == d.kind) { 
				kindFemale = dataF["Values"];
			}
		});
		loadTreeData(d.kind, d.value, d.key, kindMale, kindFemale);
	});
}