import React, { useEffect } from "react";
//import d3Tip from "d3-tip";
import { scaleLinear, max, min, axisLeft, axisBottom, select, scalePoint} from "d3";
import PropTypes from 'prop-types';


export default function ScatterPlot (props) {
    let xAxis, yAxis, chartArea, xScale, yScale;
    const drawWidth = props.width - props.margin.left - props.margin.right;
    const drawHeight = props.height - props.margin.top - props.margin.bottom;
    useEffect(() => {
        update();
    });
    function updateScales() {
        // Calculate limits
        let xMin = min(props.data, (d) => +d.x - (0.1*d.x));
        let xMax = max(props.data, (d) => +d.x + (0.1*d.x));
        let yMin = min(props.data, (d) => +d.y - (0.1*d.y));
        let yMax = max(props.data, (d) => +d.y + (0.1*d.y));

        if(!xMin && !xMax){
            let xDomain = props.data.map(d => d.x);
            xScale = scalePoint().domain([... new Set(xDomain)]).range([0, drawWidth]);
        }else{
            xScale = scaleLinear().domain([xMin, xMax]).range([0, drawWidth]);
        }

        if(!yMin && !yMax){
            let yDomain = props.data.map(d => d.y);
            yScale = scalePoint().domain([... new Set(yDomain)]).range([0, drawHeight]);

        }else{
            yScale = scaleLinear().domain([yMax, yMin]).range([0, drawHeight]);
        }
            
    }
    function updatePoints() {
        // Define hovers 
        // Add tip
        /*var tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
            return d.label;
        });
        console.log("tip: ", tip)
        */
        // Select all circles and bind data
        let circles = select(chartArea).selectAll('circle').data(props.data);

        // Use the .enter() method to get your entering elements, and assign their positions
        circles.enter().append('circle')
            .merge(circles)
            .attr('r', props.radius)
            .attr('fill', props.color)
            .attr('label', (d) => d.label)
            //.on('mouseover', () => {alert("spostati")})
            //.on('mouseout', tip.hide)
            .style('fill-opacity', 0.3)
            .transition().duration(500)
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .style('stroke', "black")
            .style('stroke-width', (d) => d.selected == true ? "3px" : "0px")


        // Use the .exit() and .remove() methods to remove elements that are no longer in the data
        circles.exit().remove();

        // Add hovers using the d3-tip library        
        //select(chartArea).call(tip);
    }
    function updateAxes() {
        let xAxisFunction = axisBottom(xScale)
            //.scale(xScale)
            .ticks(5, 's');

        let yAxisFunction = axisLeft(yScale)
            //.scale(yScale)
            .ticks(5, 's');

        select(xAxis)
            .call(xAxisFunction);

        select(yAxis)
            .call(yAxisFunction);
    }
    function update() {
        updateScales();
        updateAxes();
        updatePoints();
    }
    
    return (
        <div className="bg-secondary p-4">
            <svg className="chart" width={props.width} height={props.height}>
                <text transform={`translate(${props.margin.left},15)`}>{props.title}</text>
                <g ref={(node) => {chartArea = node; }}
                    transform={`translate(${props.margin.left}, ${props.margin.top})`} />

                {/* Axes */}
                <g ref={(node) => { xAxis = node; }}
                    transform={`translate(${props.margin.left}, ${props.height - props.margin.bottom})`}></g>
                <g ref={(node) => { yAxis = node; }}
                    transform={`translate(${props.margin.left}, ${props.margin.top})`}></g>

                {/* Axis labels */}
                <text className="axis-label" transform={`translate(${props.margin.left + drawWidth / 2}, 
                    ${props.height - props.margin.bottom + 30})`}>{props.xTitle}</text>

                <text className="axis-label" transform={`translate(${props.margin.left - 30}, 
                    ${drawHeight / 2 + props.margin.top}) rotate(-90)`}>{props.yTitle}</text>
            </svg>
        </div>
    )
}
ScatterPlot.propTypes = {
    data : PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    color: PropTypes.string,
    margin: PropTypes.object,
    xTitle: PropTypes.string,
    yTitle: PropTypes.string,
    title: PropTypes.string
}
ScatterPlot.defaultProps = {
    data: [{ x: 10, y: 20 }, { x: 15, y: 35 }],
    width: 600,
    height: 600,
    radius: 5,
    color: "blue",
    margin: {
        left: 50,
        right: 10,
        top: 20,
        bottom: 50
    },
    xTitle: "X Title",
    yTitle: "Y Title",
    title: "Prova"
};