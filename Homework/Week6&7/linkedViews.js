/*
** Puja Chandrikasingh
** Data Processing - Week 6 & 7
*/

// Wat ik wil: percentage mensen met een laaginkomen weergeven naar verschillende kenmerken (werkend/uitkering/etc) (grouped bar chart)
// Tweede visualisatie: verschil tussen mannen en vrouwen laten zien voor specifieke kenmerk (tree, 
// 						klapt niet in en uit; interactief door tekst auto update of tooltip en tekst laten staan?)


// global var
var x0, x1, y, z, svg, margin, width, height, g, keys, tip, treeLayout, treeG;					// keys global? HOE GEBRUIK JE MEERDERE JS FILES?
window.onload = function() {
	svg = d3.select(".chart"),
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = svg.attr("width") - margin.left - margin.right,
	height = svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	tip = d3.tip().html(function(d) { return d.value + "%"});
	svg.call(tip);
	
	// add a title
	
	// add a subtitle
	
	// scale functions
	x0 = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.1);

	x1 = d3.scaleBand()
		.padding(0.05);

	y = d3.scaleLinear()
		.rangeRound([height, 0]);

	z = d3.scaleOrdinal()
		.range(["#98abc5", "#8a89a6"]);

	///////////////////
	// FOR TREE
		// get data				AFHANKELIJK VAN WAAROP GEKLIKT IS
	
	var treeSvg = d3.select(".tree"),
		treeMargin = {top: 50, right: 20, bottom: 30, left: 40},
		treeWidth = treeSvg.attr("width") - treeMargin.left - treeMargin.right,
		treeHeight = treeSvg.attr("height") - treeMargin.top - treeMargin.bottom;
	treeG = treeSvg.append("g").attr("transform", "translate(" + treeMargin.left + "," + treeMargin.top + ")");
	
	treeG.append("g").attr("class", "nodes");
	treeG.append("g").attr("class", "links");

	treeLayout = d3.tree()
		.size([treeWidth, treeHeight]);

	/////////////

	// load data
	d3.queue()
		.defer(d3.json, "2014.json")
		.defer(d3.json, "2015.json")
		.defer(d3.json, "2016.json")
		.await(analyze);
	
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
					s.Values.Min1yr = +s.Values.Min1yr;
					s.Values.Min4yr = + s.Values.Min4yr;
				});
			});
		});
		
		console.log("DATA: " + data2014);
		
		// start listening to selected year
		var selectionYear = document.getElementById("selectedYear");
		selectionYear.onchange = function(){ 
			changeYear(selectionYear.value, data2014, data2015, data2016); 
		};
	
		//var keys = d3.keys(data2014);
		keys = ["Min1yr", "Min4yr"];
		console.log("Test keys " + keys);
		
		// make the graph for the first time
		initTree();
		init(data2014["0"]["Value"], data2014["1"]["Value"], data2014["2"]["Value"]);
		
		// data for bar chart
		// axis(data2014["0"]["Value"]);
		//createLegend(data2014["0"]["Value"]);
		//drawBars(data2015["0"]["Value"], data2015["1"]["Value"], data2015["2"]["Value"]);		
	}
}

//////////FOR TREE////////////
function initTree() {
		var treeData = {
			"name": "Totaal (mannen en vrouwen)",
			"children": [
			{
				"name": "Vrouwen",
				"children": [
				{"name": "% langer dan 1 jaar"},
				{"name": "% langer dan 4 jaar"}
				]
			},
			{
				"name": "Mannen",
				"children": [
				{"name": "% langer dan 1 jaar"},
				{"name": "% langer dan 4 jaar"}
				]
			}
			]
		};
		
		// draw first time 
		var root = d3.hierarchy(treeData);

		treeLayout(root);

		// Nodes
		var nodes = treeG.select('.nodes')
			.selectAll('circle.node')
			.data(root.descendants())
			.enter();

		nodes.append('circle')
			.attr("class", "node")
			.attr('cx', function(d) {return d.x;})
			.attr('cy', function(d) {return d.y;})
			.attr('r', 4);

		nodes.append("text")
			.attr("class", "info")
			.attr('dx', function(d) {return d.x - 5;})
			.attr('dy', function(d) {return d.y - 5;})
			.text(function(d) {
					return d.data.name;
			});

		// Links
		treeG.select('.links')
			.selectAll('line.link')
			.data(root.links())
			.enter()
			.append('line')
				.attr("class", "link")
				.attr('x1', function(d) {return d.source.x;})
				.attr('y1', function(d) {return d.source.y;})
				.attr('x2', function(d) {return d.target.x;})
				.attr('y2', function(d) {return d.target.y;});
}

function loadTreeData(kind, dataMale, dataFemale) {
	console.log("data male: " + dataMale);
	console.log("data female: " + dataFemale);

	var treeData = {
		"name": "Totaal: " + kind,
		"children": [
		{
			"name": "Vrouwen",
			"children": [
			{"name": "+1 jaar " + dataFemale["Min1yr"] + "%"},
			{"name": "+4 jaar " + dataFemale["Min4yr"] + "%"}
			]
		},
		{
			"name": "Mannen",
			"children": [
			{"name": "+1 jaar " + dataMale["Min1yr"] + "%"},
			{"name": "+4 jaar " + dataFemale["Min4yr"] + "%"}
			]
		}
		]
	};
	
	drawTree(treeData);
}

function drawTree(data) {							// OOK HIER WERKT UPDATEN NIET
	var root = d3.hierarchy(data);

	treeLayout(root);

	// Nodes
	var nodes = treeG.select('.nodes')
		.selectAll('circle.node')
		.data(root.descendants());

	nodes.selectAll("text.info")
		.attr('dx', function(d) {return d.x - 5;})
		.attr('dy', function(d) {return d.y - 5;})
		.text(function(d) {
				return d.data.name;
		});
}

//////////////////////////////

/////FOR BAR/////////////

function init(data, dataMale, dataFemale) {
	
	// append axis holder				HOE MAX RUIMTE, NU LOOPT T IN ELKAAR OVER...
	g.append("g")
		.attr("class", "axisX")
		.attr("transform", "translate(0," + height + ")");
	
	g.append("g")
		.attr("class", "axisY")
		.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop()) + 0.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.text("Percentage");
	
	// scale and draw the axis
	axis(data);
	
	createLegend(data);
	
	// append data the first time
	// draw grouped bars
	var bars = g.append("g")
		.selectAll("g")
		.data(data)
		.enter().append("g")
			.attr("class", "bars")
			.attr("transform", function(d) { return "translate(" + x0(d["Kind"]) + ",0)"; })
			.selectAll("rect")
			.data(function(d) { return keys.map(function(key) { return {key: key, value: d["Values"][key], kind: d["Kind"]}; }); }) // DUS MAAK HIER NWE JSON, WAAR COMMENT?
			.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x1(d.key); })
				.attr("y", function(d) { return y(d.value); })
				.attr("width", x1.bandwidth())
				.attr("height", function(d) { return height - y(d.value); })
				.attr("fill", function(d) { return z(d.key); })
				.on("mouseover", function(d) {
					tip.show(d);
					
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
					loadTreeData(d.kind, kindMale, kindFemale);
				})
				.on("mouseout", tip.hide);	
}

function axis(data) {
	
	// set right domain
	x0.domain(data.map(function(d) { return d["Kind"]; }));
	x1.domain(keys).rangeRound([0, x0.bandwidth()]);
	y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d["Values"][key]; }); })]).nice();
	
	// add axis 					
	g.select(".axisX")
		.call(d3.axisBottom(x0));

	// y axis
	g.select(".axisY")
		.call(d3.axisLeft(y).ticks(null, "s"));
}

function createLegend(data) {
	var legend = g.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.selectAll("g")
		.data(keys)
		.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { 									// BETERE MANIER OM DIT TE DOEN?
			if (d == "Min1yr") {
				return "1 jaar of langer"
			} else if (d == "Min4yr") {
				return "4 jaar of langer"
			}
		});
}

function drawBars(data, dataMale, dataFemale) {
	
	var bars = g.selectAll("g")
		.data(data)
		.selectAll(".bars")
			.attr("transform", function(d) { return "translate(" + x0(d["Kind"]) + ",0)"; })
			.selectAll("rect")
			.data(function(d) { return keys.map(function(key) { return {key: key, value: d["Values"][key]}; }); }) // DUS MAAK HIER NWE JSON, WAAR COMMENT?
			.selectAll(".bar")
				.attr("x", function(d) { return x1(d.key); })
				.attr("y", function(d) { return y(d.value); })
				.attr("width", x1.bandwidth())
				.attr("height", function(d) { return height - y(d.value); })
				.attr("fill", function(d) { return z(d.key); })
				.on("mouseover", function(d) {
					tip.show(d);
					console.log("zit in mouse over function");
					loadTreeData(d.key, dataMale, dataFemale);
				})
				.on("mouseout", tip.hide);
}

/*
** Function to listen for changes in the selected year.
*/
function changeYear(selectedYear, data2014in, data2015in, data2016in) {
	
	if (selectedYear == 2014) {
		update(data2014in["0"]["Value"], 2014);
	}
	else if (selectedYear == 2015) {
		update(data2015in["0"]["Value"], 2015);
	}
	else if (selectedYear == 2016) {
		update(data2016in["0"]["Value"], 2016);
	}
}

/*
** Function to update the graph when the selected year has changed.
*/
function update(data, year) {
	var t = d3.transition()
		.duration(750);
		
	// resize axis
	axis(data);
	drawBars(data);						// ZO WERKT HET OOK NIET....
	
	// UPDATE old elements present in new data.								WERKT NIET... WAT DOE IK FOUT?
	// var bars = g.selectAll("g")
		// .data(data)
		// .selectAll(".bars")
			// .data(function(d) { return keys.map(function(key) { return {key: key, value: d["Values"][key]}; }); })
			// .selectAll(".bar")
				// .transition(t)
					// .attr("y", function(d) { return y(d.value); })
					// .attr("height", function(d) { return height - y(d.value); });

}