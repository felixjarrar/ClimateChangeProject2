// scatter plots is created	
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper created, append group that will hold chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Data imported
var emissionsaruba= [];
let Aruba = nitrousGas[109];
for (key in Aruba) {
	if (key.includes("column") && typeof Aruba[key] == "number") {
		emissionsaruba.push(Aruba[key]);
	}
}
	   
console.log(emissionsaruba);

	
var xLinearScale = d3.scaleLinear()
  .domain([8.5, d3.max(emissionsaruba)])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([1970, 2012])
  .range([height, 0]);

// Step 3: Create axis functions
// ==============================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
// ==============================
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

// Step 5: Create Circles
// ==============================
var circlesGroup = chartGroup.selectAll("circle").data(emissionsaruba).enter()

circlesGroup.append("circle")
  .on("mouseover", function() {d3.select(this).attr("fill", "red");})
	.on("mouseout", function(){d3.select(this).attr("fill","blue")})
	.on("click", function(gas){toolTip2.show(gas,this);})
  .attr("cx", d => xLinearScale(d))
  .attr("cy", (d,i) => yLinearScale(i+1970))
  .attr("r", "5")
  .attr("fill", "blue")
  .attr("opacity", ".5");

circlesGroup.append("text")
  .text(function(d){return d.abbr;})
	.attr("dx", d => xLinearScale(d.countryname))
  .attr("dy", d => yLinearScale(d.year)+10/2.5)
  .attr("font-size","9")
  .attr("class","stateText");

// Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em") 
  .attr("class", "axisText")
  .text("Year");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Nitrous Oxide Emission");

chartGroup.append("text")
  .attr("x", 0-margin.left+500)
  .attr("y",0)
  .attr("text-anchor", "middle")
  .text("Aruba's Nitrous Oxide Emission from 1970-2012");

var toolTip2 = d3.tip()
  .attr("class", "d3-tip")
  .offset([0, 0])
  .html(function(d) {return (d);});
g.call(toolTip2);

