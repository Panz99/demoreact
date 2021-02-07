/*import React, { useEffect } from "react";
import d3Tip from "d3-tip";
import { scaleLinear, max, min, axisLeft, axisBottom, select} from "d3";
import PropTypes from 'prop-types';


export default function ScatterPlot (props) {
    let xAxis, yAxis, chartArea, xScale, yScale;
    const drawWidth = props.width - props.margin.left - props.margin.right;
    const drawHeight = props.height - props.margin.top - props.margin.bottom;
    const columns = Object.keys(props.data[0]);
    const size = (props.width - (columns.length + 1) * props.padding) / columns.length + props.padding
    
    useEffect(() => {
        update();
    });
    function updateScales() {
        // Calculate limits
        let xMin = min(props.data, (d) => +d.x * .9);
        let xMax = max(props.data, (d) => +d.x * 1.1);
        let yMin = min(props.data, (d) => +d.y * .9);
        let yMax = max(props.data, (d) => +d.y * 1.1);

        // Define scales
        xScale = scaleLinear().domain([xMin, xMax]).range([0, drawWidth]);
        yScale = scaleLinear().domain([yMax, yMin]).range([0, drawHeight]);
    }
    function updatePoints() {
        // Define hovers 
        // Add tip
        var tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
            return d.label;
        });

        // Select all circles and bind data
        let circles = select(chartArea).selectAll('circle').data(props.data);

        // Use the .enter() method to get your entering elements, and assign their positions
        circles.enter().append('circle')
            .merge(circles)
            .attr('r', props.radius)
            .attr('fill', props.color)
            .attr('label', (d) => d.label)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .style('fill-opacity', 0.3)
            .transition().duration(500)
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .style('stroke', "black")
            .style('stroke-width', (d) => d.selected == true ? "3px" : "0px")


        // Use the .exit() and .remove() methods to remove elements that are no longer in the data
        circles.exit().remove();

        // Add hovers using the d3-tip library        
        select(chartArea).call(tip);
    }
    function updateAxes() {
        let xAxisFunction = axisBottom()
            .scale(xScale)
            .ticks(5, 's');

        /*let yAxisFunction = axisLeft()
            .scale(yScale)
            .ticks(5, 's');
        const axisy = d3.axisLeft()
                .ticks(6)
                .tickSize(-size * columns.length);

        let yAxisFunction = g => g.selectAll("g").data(y).join("g")
                .attr("transform", (d, i) => `translate(0,${i * size})`)
                .each(function(d) { return select(this).call(axisy.scale(d)); })
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
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
                <g ref={(node) => { chartArea = node; }}
                    transform={`translate(${props.margin.left}, ${props.margin.top})`} />

                {/* Axes }
                <g ref={(node) => { xAxis = node; }}
                    transform={`translate(${props.margin.left}, ${props.height - props.margin.bottom})`}></g>
                <g ref={(node) => { yAxis = node; }}
                    transform={`translate(${props.margin.left}, ${props.margin.top})`}></g>

                {/* Axis labels 
                <text className="axis-label" transform={`translate(${props.margin.left + drawWidth / 2}, 
                    ${props.height - props.margin.bottom + 30})`}>{props.xTitle}</text>

                <text className="axis-label" transform={`translate(${props.margin.left - 30}, 
                    ${drawHeight / 2 + props.margin.top}) rotate(-90)`}>{props.yTitle}</text>
                    }
            </svg>
        </div>
    )
}
ScatterPlot.propTypes = {
    data : PropTypes.array,
    padding: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    color: PropTypes.string,
    margin: PropTypes.object,
    dim1Title: PropTypes.string,
    dim2Title: PropTypes.string,
    dim3Title: PropTypes.string,
    dim4Title: PropTypes.string,
    title: PropTypes.string
}
ScatterPlot.defaultProps = {
    data: [{ x: 10, y: 20, z: 10, h: 20 }, { x: 15, y: 35, z: 15, h: 26  }],
    padding: 20,
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
    dim1Title: "Dim 1 Title",
    dim2Title: "Dim 2 Title",
    dim3Title: "Dim 3 Title",
    dim4Title: "Dim 4 Title",
    title: "Prova"
};*/