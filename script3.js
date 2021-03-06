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

var svg = d3.select("#scatterplot")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

const emissionsus = [];
let US = nitrousGas[251];
for (key in US) {
	if (key.includes("column") && typeof US[key] == "number") {
		emissionsus.push(US[key]);
		}
	}  
console.log(emissionsus);
	
var xLinearScale = d3.scaleLinear()
.domain([8.5, d3.max(emissionsus)])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([1970, 2012])
.range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

var circlesGroup = chartGroup.selectAll("circle").data(emissionsus).enter()
circlesGroup.append("circle")
.on("mouseover", function() {d3.select(this).attr("fill", "red");})
.on("mouseout", function(){d3.select(this).attr("fill","blue")})
.on("click", function(gas){toolTip3.show(gas,this);})
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
.attr("class","stateText")
      
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
.text("United States's Nitrous Oxide Emission from 1970-2012")

var toolTip3 = d3.tip()
.attr("class", "d3-tip")
.offset([0, 0])
.html(function(d) {return (d);});
g.call(toolTip3);