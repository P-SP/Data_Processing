// Puja Chandrikasingh
// Data Processing - Week 4 for week 5

window.onload = function() {	
	
	// load data
	d3.json("data.json", function(error, data) {
		
		// make sure the data is loaded
		if (error) {
			window.alert("The data could not be loaded.");
			throw error;
		}

		// change data if needed to integers and to Celsius (not 0.1 Celsius)
		data.forEach(function(d) {
			d["Average temperature"] = d["Average temperature"]/10;
			d["Minimum temperature"] = d["Minimum temperature"]/10;
			d["Maximum temperature"] = d["Maximum temperature"]/10;
		});
		
		console.log(data);
			
	});
}

