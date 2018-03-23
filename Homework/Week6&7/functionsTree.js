/*
** Puja Chandrikasingh
** Data Processing - Week 6 & 7
**
** This script contains all the functions for the tree.
*/

/* 
** This function is for instantiating the tree.
*/
function initTree() {
	var treeData = {
		"name": "Totaal (mannen en vrouwen)",
		"children": [
		{
			"name": "Vrouwen",
			"children": [
			{"name": "% +1 jaar"},
			{"name": "% +4 jaar"}
			]
		},
		{
			"name": "Mannen",
			"children": [
			{"name": "% +1 jaar"},
			{"name": "% +4 jaar"}
			]
		}
		]
	};
		
	var root = d3.hierarchy(treeData);
	treeLayout(root);
		
	// draw links
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

	// draw nodes
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
		.attr('dx', function(d, i) {
			
			// text of the leaves have a different position
			if (root.leaves().includes(d)) {
				return d.x - (10+i/2)*2;
			}
			return d.x - 5;
		})
		.attr('dy', function(d) {
			
			// text of the leaves have a different position
			if (root.leaves().includes(d)) {
				return d.y + 25;
			}
			return d.y - 5;
		})
		.text(function(d) {
				return d.data.name;
		});
}

/* 
** This function is for loading the new data into the tree.
*/
function loadTreeData(kind, totalValue, yearKey, dataMale, dataFemale) {
	
	// load new data
	var treeData = {
		"name": kind,
		"children": [
		{
			"name": "Vrouwen",
			"children": [
			{"name": dataFemale["Min1yr"]},
			{"name": dataFemale["Min4yr"]}
			]
		},
		{
			"name": "Mannen",
			"children": [
			{"name": dataMale["Min1yr"]},
			{"name": dataMale["Min4yr"]}
			]
		}
		]
	};
	
	var root = d3.hierarchy(treeData);
	treeLayout(root);
	
	var nodes = treeG.selectAll('.nodes')
	
	nodes.selectAll('text.info')
		.data(root.descendants());
	
	nodes.selectAll(".node")
		.data(root.descendants());
	
	treeG.select(".nodes").selectAll(".node")
		.on("mouseover", function(d) {
			
			// mouseover only has to work for the leaves
			if (root.leaves().includes(d)) {
				tipTree.show(d);
			}
		})
		.on("mouseout", tipTree.hide);
		
	// update the dot sizes of the leaves
	updateTree(treeData, root);
	
	
	// for text under the tree
	var years;	
	if (yearKey == "Min1yr") {
		years = 1;
	} else {
		years = 4;
	}
	
	// show the right values in the text under the tree
	showText(kind, totalValue, years, dataMale[yearKey], dataFemale[yearKey]);
}

/* 
** This function is for updating the dot size of the leaves to the right
** percentage value. The domain of the sizes is set in functionsBarChart.js, 
** because it has to be set with all the data and not just the data of this SEC
** category (kind).
*/
function updateTree(data, root) {
	var nodes = treeG.select(".nodes")
		.selectAll("circle.node")
		.attr("r", function(d) {
			
			// only the size of the leaves change
			if (root.leaves().includes(d)) {
				return dotSize(d.data.name);
			}
			return 4;
		});
}

/*
** This function updates the text under the tree.
*/
function showText(kind, totalValue, years, maleValue, femaleValue) {
	d3.select(".cat").html(kind);
	d3.select(".total").html(d3.format(".0f")(totalValue));
	d3.select(".years").html(years);
	d3.select(".male").html(d3.format(".0f")(maleValue));
	d3.select(".female").html(d3.format(".0f")(femaleValue));
}