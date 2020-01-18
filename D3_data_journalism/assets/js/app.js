// Screen Dimensions
var svgWidth = 960;
var svgHeight = 660;

// Assign margins
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Define Chart Dimensions
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Capture html tag and append defined dimensions
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

// Define chart group as values assigned to html tag
var chart_group = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Input data from csv
d3.csv("data/data.csv").then(function(state_data) {
    
    // Log data to console
    console.log(state_data);

    // Filling array with state abbreviations
    state_data.forEach(function(data) {
        data.abbr = +data.abbr
        data.poverty = +data.poverty
        data.smokes = +data.smokes
    });

    // Create scale functions
    var x_linear_scale = d3.scaleLinear()
        .domain([0, d3.max(state_data, d => d.poverty)])
        .range([svgHeight, 0]);
    
    var y_linear_scale = d3.scaleLinear()
        .domain([0, d3.max(state_data, d => d.smokes)])
        .range([svgHeight, 0]);

    // Create axis functions
    var bottom_axis = d3.axisBottom(x_linear_scale);
    var left_axis = d3.axisLeft(y_linear_scale);

    // Create circle data points for each state
    var circle_data_points = chart_group.selectAll('circle')
        .data(state_data)
        .enter()
        .append('circle')
        .attr('cx', d => x_linear_scale(d.poverty))
        .attr('cy', d => y_linear_scale(d.smokes))
        .attr('r', 15)
        .attr('class', 'stateCircle')
    
    // Text offsets to center within circle
    var text_x_offset = 0;
    var text_y_offset = 5;

    // Create chart group
    chart_group.selectAll('text')
        .enter(state_data)
        .enter()
        .append('text')
        .attr('x', d => x_linear_scale(d.poverty) + text_x_offset)
        .attr('y', d => y_linear_scale(d.smokes) + text_y_offset)
        .text(d => d.abbr)
        .attr('class', 'stateText')

    // Append axes to chart
    chart_group.append('g')
        .attr('transform', `translate(0, ${svgHeight})`)
        .call(bottom_axis)
    chart_group.append('g')
        .call(left_axis)
    
    // Create axis labels
    chart_group.append('text')
        .attr('transform', `translate(${svgWidth/2}, ${svgHeight + margin.top + 30})`)
        .attr('class', 'axisText')
        .text('Percent living in poverty')
    
    chart_group.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', -(100 + margin.left + 20))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Percent that are smokers')
});
