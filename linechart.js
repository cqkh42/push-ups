
// set the dimensions and margins of the graph
var width = 1000
    height = 1000
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
//const radius = Math.min(width, height) / 2 - margin
const radius = 450
const innerRadius = 150

// append the svg object to the div called 'my_dataviz'
const svg = d3.select(".container-fluid")
  .append("svg")
//    .attr("width", width)
//    .attr("height", height)
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 1000 1000")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const dayOfYear =
  Math.floor((new Date() - new Date((new Date()).getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
const innerData = {'completed': dayOfYear-1, 'togo': 365 - dayOfYear + 1}

function color(key){
  if (key == 'completed'){
  return "#008000"}
  return "#98abc5"
}

function opacity(key){
  if (key=='completed'){
  return 0.7}
  return 0.3
}

const pie = d3.pie().sort(null)
  .value(function(d) {return d.value; })

function drawPushUps(pushupData){

var data_ready = pie(d3.entries(pushupData))
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(innerRadius)         // This is the size of the donut hole
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("stroke-opacity", 0.3)
  .style("opacity", d => opacity(d.data.key))
}

function drawInner(){
var data_ready = pie(d3.entries(innerData))

svg
  .selectAll('inner')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(innerRadius-5)         // This is the size of the donut hole
    .outerRadius(innerRadius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .style("opacity", d => opacity(d.data.key))
}

function parseData(data){
var d = d3.sum(data, d=> d.pushups)
var pushupData = {'completed': d, 'togo': 10000-d}
drawPushUps(pushupData)
drawInner()
//console.log(pushupData)
}

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vTcCYisJ3ihPZ5ObmJbvNitDOp8eEB93Gf3CU9odNlv2ia-qALPv0dmAEQLklNnLfpS-TQJyYyDT8Xl/pub?gid=0&single=true&output=csv", 0,parseData)
