$( document ).ready(function() {

	var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/126AA3xhrNrZ7wPhTGp15gfyBb3LP7AfHEZ-gQfXGbrg/edit#gid=0';

	var data = [];



	var done = function (error, options, response) {
		$('#loading').fadeOut();

		// console.log(response.rows[1].cells);

		jQuery.each(response.rows, function(index, value) {
			var row = []
				row.date = value.cells.date;
				row.close =	value.cells.close;
			data.push(row);
		});



		data.shift();
		
		lineChart(data);

		//console.log(data);
		
		
	};

	function lineChart(data) {
		var margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		// 4/10/2012

		var formatDate = d3.time.format("%Y-%m-%d");

		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.close); });

		var svg = d3.select(".container-fluid").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		  .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// console.log(data);

		// for (var i = data.length - 1; i >= 0; i--) {
		// 	console.log(data[i]);
		// }

		data.forEach(function(d) {
		  d.date = formatDate.parse(d.date);
		  d.close = +d.close;
		  return d;
		  console.log(d.date);
		});

		  x.domain(d3.extent(data, function(d) { return d.date; }));
		  y.domain(d3.extent(data, function(d) { return d.close; }));

		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Close ($)");

		svg.append("path")
		      .datum(data)
		      .attr("class", "line")
		      .attr("d", line);

	
	}

	$('#properati').sheetrock({
		url: mySpreadsheet,
		query: "select *",
		callback: done
	});

	

});