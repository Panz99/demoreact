import React, {useEffect} from "react";
import * as d3 from "d3"
import PropTypes from 'prop-types';
import { select} from "d3";


export default function ScatterPlot (props) {
    
    //Sono i riferimenti ai g che ho costruito nel return.
    let refSvg, svg;
    let xAxis, yAxis, xScale, yScale, domainByTrait={};
    const size = props.size, padding = props.padding, legendRectSize = 18, legendSpacing = 4;
    const data = props.data;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const traits = props.dims;
    const numberOfTraits = traits.length;

    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) 
            for (j = -1; ++j < m;) 
                c.push({x: a[i], 
                        i: i, 
                        y: b[j], 
                        j: j});
        return c;
    }
    
    function plot(p) {
        var cell = d3.select(this);

        xScale.domain(domainByTrait[p.x]);
        yScale.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
                .attr("cx", function(d) { return xScale(d[p.x]); })
                .attr("cy", function(d) { return yScale(d[p.y]); })
                .attr("r", 4)
                .style("fill", function(d) { return color(d[props.dimColor]); });
    }
    useEffect(() => {
        svg = select(refSvg);
        update();
    })
    function updateScales(){
        traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, function(d) {return +d[trait]; });
        }); //calcola i massimi e i minimi
        console.log(domainByTrait)
        xScale = d3.scaleLinear()
                .range([padding / 2, size - padding / 2]);

        yScale = d3.scaleLinear()
                .range([size - padding / 2, padding / 2]);
    }
    function updateAxis(){

        xAxis = d3.axisBottom(xScale)
                .ticks(6) //quante tacchette sull'asse
                .tickSize(size * numberOfTraits);
        
        yAxis = d3.axisLeft(yScale)
                .ticks(6)
                .tickSize(-size * numberOfTraits);

        svg.selectAll(".x.axis").remove();
        svg.selectAll(".x.axis")
        .data(traits) 
        .enter() 
        .append("g") 
            .attr("class", "x axis")
            .attr("transform", function(d, i) { 
                return "translate(" + ((numberOfTraits - i - 1) * size + 20)+",0)"; 
            })
            .each(function(d) {
                xScale.domain(domainByTrait[d]);
                d3.select(this).call(xAxis);
            });

        svg.selectAll(".y.axis").remove();
        svg.selectAll(".y.axis")
        .data(traits)
        .enter()
        .append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) {
                return "translate(20," + i * size+")"; 
            })
            .each(function(d) { yScale.domain(domainByTrait[d]); d3.select(this).call(yAxis); });
    }
    
    function updatePoints(){
        svg.selectAll(".cell").remove();
        let cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
             //quindi abbiamo tutte le possibili coppie tra le varie dimensioni, ora creo il "g" che ospita il grafichino
            .enter().append("g")
                .attr("class", "cell")
                .attr("transform", function(d) { 
                    return "translate(" + ((numberOfTraits - d.i - 1) * size +20) + "," + d.j * size + ")"; })
             //creo il grafichino
            .each(plot);

            cell.filter(function(d) { return d.i === d.j; }) //toglie quelle uguali
            .append("text")
                .attr("x", padding)
                .attr("y", padding)
                .attr("dy", ".71em")
            .text(function(d) { return d.x; });
            cell.filter(function (d) {
                return d.i === d.j;
            })
            

    }
    function updateLegend(){
        svg.selectAll('.legend').remove();
        var legend = svg.selectAll('.legend')
              .data(color.domain())
              .enter()
              .append('g')
              .attr('class', 'legend')
              .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = size * 4 + padding;
                var vert = i * height + offset;
                return 'translate(' + horz + ',' + vert + ')';
              });
            legend.append('rect')
              .attr('width', legendRectSize)
              .attr('height', legendRectSize)
              .style('fill', color)
              .style('stroke', color);
     
            legend.append('text')
              .attr('x', legendRectSize + legendSpacing)
              .attr('y', legendRectSize - legendSpacing)
              .text(function (d) {
                return d;
              });

    }
    function update(){
        updateScales();
        updateAxis();
        updatePoints();
        updateLegend();
    }
    return (
        <div className="p-4">
            <svg ref={(node) => { refSvg = node; }} width={size * numberOfTraits + padding + legendRectSize + legendSpacing + 125} height={size * numberOfTraits + padding}>
                {/*<text transform={`translate(${props.margin.left},15)`}>{props.title}</text>*/}
                
            </svg>
        </div>
    )
}
ScatterPlot.propTypes = {
    data : PropTypes.array,
    dims: PropTypes.array,
    padding: PropTypes.number,
    size: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    color: PropTypes.string,
    margin: PropTypes.object,
    dim1Title: PropTypes.string,
    dim2Title: PropTypes.string,
    dim3Title: PropTypes.string,
    dim4Title: PropTypes.string,
    dimColor: PropTypes.string,
    title: PropTypes.string
}
ScatterPlot.defaultProps = {
    data: [{ x: 10, y: 20, z: 10, h: 20 }, { x: 15, y: 35, z: 15, h: 26  }],
    padding: 20,
    size: 300,
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
};