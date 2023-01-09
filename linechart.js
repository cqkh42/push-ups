// set the dimensions and margins of the graph
const width = 1000;
const height = 1000;
const margin = 40;

const radius = 450;
const innerRadius = 300;

const svg = d3.select("g")
//  .append("g")
//  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const dayOfYear =
  Math.floor(
    (new Date() - new Date((new Date()).getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
const innerData = {
  "completed": dayOfYear - 1,
  "togo": 365 - dayOfYear + 1
};

function arc(inner, outer) {
return d3.arc()
      .innerRadius(inner) // This is the size of the donut hole
      .outerRadius(outer)
}

function draw(data, inner, outer, selector){
  const pie = d3.pie().sort(null)
    .value(d => d.value);
  return svg
    .selectAll(selector)
    .data(pie(d3.entries(data)))
    .enter()
    .append("path")
    .attr("class", (d) => d.data.key)
    .attr("d", arc(inner, outer)
    )
}

function drawText(number) {
  const text = svg.append("text")
    .attr("text-anchor", "middle")
    .text(0);
  text
    .transition()
    .tween("text", function() {
      var selection = d3.select(this); // selection of node being transitioned
      var start = d3.select(this).text(); // start value prior to transition
      var end = number; // specified end value
      var interpolator = d3.interpolateNumber(start, end); // d3 interpolator
      return function(t) {
        selection.text(Math.round(interpolator(t)).toLocaleString());
      };
    })
    .duration(1000);
}

function parseData(data) {
d3.select(".loading")
  .transition()
  .duration(2000)
  .attr("opacity", 0);
  var d = d3.sum(data, (d) => d.pushups);
  var pushupData = {
    "completed": d,
    "togo": 10000 - d
  };
  draw(pushupData, innerRadius, radius, "outer").classed("outer", true);
  draw(innerData, innerRadius-5, innerRadius, "inner");
  drawText(pushupData.completed);
}

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vTcCYisJ3ihPZ5ObmJbvNitDOp8eEB93Gf3CU9odNlv2ia-qALPv0dmAEQLklNnLfpS-TQJyYyDT8Xl/pub?gid=0&single=true&output=csv", 0, parseData);