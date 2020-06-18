//{date:"2015-1-1",max_temp:1,mean_temp:-2,min_temp:-6}
//{"date":"1/1/2016","maximum temperature":"42","minimum temperature":"34","average temperature":"38"

function F2C(temp) {
    return (temp - 32) * 5 / 9;
}

const weather = weatherNY.map(day => {

    let date;
    if (day.date.includes('/')) {
        date = day.date.split('/').reverse().join('-'); 
    } else {
        date = day.date.split('-').reverse().join('-'); 
    }
    return {
        date : new Date(date),
        max_temp : F2C(parseInt(day["maximum temperature"])),
        mean_temp: F2C(parseInt(day["average temperature"])),
        min_temp: F2C(parseInt(day["minimum temperature"]))
    }
});
//console.log(weather);

var margin = {
	top: 200,
	right: 40,
	bottom: 120,
	left: 100
};
var width = window.innerWidth - margin.left - margin.right - 20;
var height = window.innerHeight - margin.top - margin.bottom - 20;

//SVG container
var svg = d3.select("#weatherRadial")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Create scales ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Parses a string into a date	
var parseDate = d3.timeParse("%Y-%m-%d");

//Turn strings into actual numbers/dates
weatherBoston.forEach(function(d) {
	d.date = parseDate(d.date);
});

//Set the minimum inner radius and max outer radius of the chart
var	outerRadius = Math.min(width, height, 500)/2,
	innerRadius = outerRadius * 0.4;

//Base the color scale on average temperature extremes
var colorScale = d3.scaleLinear()
	.domain([-15, 7.5, 30])
	.range(["#2c7bb6", "#ffff8c", "#d7191c"])
	.interpolate(d3.interpolateHcl);

//Scale for the heights of the bar, not starting at zero to give the bars an initial offset outward
var barScale = d3.scaleLinear()
	.range([innerRadius, outerRadius])
	.domain([-15,30]); 

//Scale to turn the date into an angle of 360 degrees in total
//With the first datapoint (Jan 1st) on top
var angle = d3.scaleLinear()
	.range([-180, 180])
	.domain(d3.extent(weatherBoston, function(d) { return d.date; }));	 

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Create Titles ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var textWrapper = svg.append("g").attr("class", "textWrapper")
	.attr("transform", "translate(" + Math.max(-width/2, -outerRadius - 170) + "," + 0 + ")");

//Append title to the top
textWrapper.append("text")
	.attr("class", "title")
    .attr("x", 0)
    .attr("y", -outerRadius - 40)
    .text("Daily Temperatures in New York");
textWrapper.append("text")
	.attr("class", "subtitle")
    .attr("x", 0)
    .attr("y", -outerRadius - 20)
    .text("2016");

//Append credit at bottom
textWrapper.append("text")
	.attr("class", "credit")
    .attr("x", 0)
    .attr("y", outerRadius + 120)
    .text("Based on weather-radials.com");

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create Axes /////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Wrapper for the bars and to position it downward
var barWrapper = svg.append("g")
	.attr("transform", "translate(" + 0 + "," + 0 + ")");
	
//Draw gridlines below the bars
var axes = barWrapper.selectAll(".gridCircles")
 	.data([-20,-10,0,10,20,30])
 	.enter().append("g");
//Draw the circles
axes.append("circle")
 	.attr("class", "axisCircles")
 	.attr("r", function(d) { return barScale(d); });
//Draw the axis labels
axes.append("text")
	.attr("class", "axisText")
	.attr("y", function(d) { return barScale(d); })
	.attr("dy", "0.3em")
	.text(function(d) { return d + "°C"});

//Add January for reference
barWrapper.append("text")
	.attr("class", "january")
	.attr("x", 7)
	.attr("y", -outerRadius * 1.1)
	.attr("dy", "0.9em")
	.text("January");
//Add a line to split the year
barWrapper.append("line")
	.attr("class", "yearLine")
	.attr("x1", 0)
	.attr("y1", -innerRadius * 0.65)
	.attr("x2", 0)
	.attr("y2", -outerRadius * 1.1);

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Draw bars //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Draw a bar per day were the height is the difference between the minimum and maximum temperature
//And the color is based on the mean temperature
barWrapper.selectAll(".tempBar")
 	.data(weather)
 	.enter().append("rect")
 	.attr("class", "tempBar")
 	.attr("transform", function(d,i) { return "rotate(" + (angle(d.date)) + ")"; })
 	.attr("width", 1.5)
	.attr("height", function(d,i) { return barScale(d.max_temp) - barScale(d.min_temp); })
 	.attr("x", -0.75)
 	.attr("y", function(d,i) {return barScale(d.min_temp); })
 	.style("fill", function(d) { return colorScale(d.mean_temp); });
	
///////////////////////////////////////////////////////////////////////////
//////////////// Create the gradient for the legend ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Extra scale since the color scale is interpolated
var tempScale = d3.scaleLinear()
	.domain([-15, 30])
	.range([0, width]);

//Calculate the variables for the temp gradient
var numStops = 10;
tempRange = tempScale.domain();
tempRange[2] = tempRange[1] - tempRange[0];
tempPoint = [];
for(var i = 0; i < numStops; i++) {
	tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
}//for i

//Create the gradient
svg.append("defs")
	.append("linearGradient")
	.attr("id", "legend-weather")
	.attr("x1", "0%").attr("y1", "0%")
	.attr("x2", "100%").attr("y2", "0%")
	.selectAll("stop") 
	.data(d3.range(numStops))                
	.enter().append("stop") 
	.attr("offset", function(d,i) { return tempScale( tempPoint[i] )/width; })   
	.attr("stop-color", function(d,i) { return colorScale( tempPoint[i] ); });

///////////////////////////////////////////////////////////////////////////
////////////////////////// Draw the legend ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var legendWidth = Math.min(outerRadius*2, 400);

//Color Legend container
var legendsvg = svg.append("g")
	.attr("class", "legendWrapper")
	.attr("transform", "translate(" + 0 + "," + (outerRadius + 70) + ")");

//Draw the Rectangle
legendsvg.append("rect")
	.attr("class", "legendRect")
	.attr("x", -legendWidth/2)
	.attr("y", 0)
	.attr("rx", 8/2)
	.attr("width", legendWidth)
	.attr("height", 8)
	.style("fill", "url(#legend-weather)");
	
//Append title
legendsvg.append("text")
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", -10)
	.style("text-anchor", "middle")
	.text("Average Daily Temperature");

//Set scale for x-axis
var xScale = d3.scaleLinear()
	 .range([-legendWidth/2, legendWidth/2])
	 .domain([-15,30] );

//Define x-axis
var xAxis = d3.axisBottom()
	  .ticks(5)
	  .tickFormat(function(d) { return d + "°C"; })
	  .scale(xScale);

//Set up X axis
legendsvg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (10) + ")")
	.call(xAxis);

//set up bar chart

var gas= nitrousGas.filter((record, index) => index % 25 === 0).slice(1)
			.map(entry => ({ country: entry["World Development Indicators"], emission: entry["column45"]}));
var svg = d3.select("#bar-graph > svg"),
	margin = 300,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range ([height, 0]);
	console.log(svg);
var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");


xScale.domain(gas.map(function(d) { return d.country; }));
yScale.domain([0, d3.max(gas, function(d) { return d.emission; })]);

g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale));


g.append("g")
	.call(d3.axisLeft(yScale).tickFormat(function(d){
		return d;
		}).ticks(10))
		.append("text")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("value");
		g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -60)
		.attr("x", -300)
		.attr("dy", "1em")
		.attr("class", "axisText")
		.text("Nitrous Oxide Emission");
	    g.append("text")
		.attr("x", 300)
		.attr("y", 670)
		.attr("class", "axisText")
		.text("Country");
		g.append("text")
		.attr("x", width/2 +margin-250)
		.attr("y",0)
		.attr("text-anchor", "middle")
		.text("Nitrous Oxide Emission for the Selected Ten Countries")
	
	g.selectAll(".bar")
		.data(gas)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return xScale(d.country); })
		.attr("y", function(d) { return yScale(d.emission); })
		.attr("width", xScale.bandwidth())
		.attr("height", function(d) { return height - yScale(d.emission); })
		.on("mouseover", function() {
            d3.select(this)
				.attr("fill", "blue");
		})
		.on("mouseout", function() {
            d3.select(this)
				.attr("fill", "grey");
		})
		.on("click", function(gas) {     
			toolTip.show(gas,this);
		  })
		
		

	var toolTip = d3.tip()
		  .attr("class", "d3-tip")
		  .offset([0, 0])
		  .html(function(d) {
			return (`emission: ${d.emission}<br>country: ${d.country}`);
		  });
	g.call(toolTip);
	
	