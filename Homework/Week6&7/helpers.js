/*
** Puja Chandrikasingh
** Data Processing - Week 6 & 7
**
** This script contains a helper function.
*/

/*
** This function wraps text in multiple lines instead of one line text.
** Source: https://github.com/d3/d3/issues/1642
*/
function wrap(text, width) {
	
	// for the text
	text.each(function() {
		
		// select the DOM element
		var text = d3.select(this),
		
			// reverse the words and save it in an array
			words = text.text().split(/\s+/).reverse(),
			
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1,
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan")
				.attr("x", 0)
				.attr("y", y)
				.attr("dy", dy + "em");
		
		// for every word as long as there are words
		while (word = words.pop()) {
			
			// add the word and a space to the line
			line.push(word);
			tspan.text(line.join(" "));
			
			// check if it is bigger than the maximum width (given)
			if (tspan.node().getComputedTextLength() > width) {
				
				// delete last added word
				line.pop();
				tspan.text(line.join(" "));
				
				// save that word
				line = [word];
				
				// shift line position and set text
				tspan = text.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word);
			}
		}
	});
}