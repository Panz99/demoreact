import React, {useEffect} from "react";
import * as d3 from "d3"
import PropTypes from 'prop-types';
import { select} from "d3";


export default function ScatterPlotMatrix (props) {
    
    //Sono i riferimenti ai g che ho costruito nel return.
    let refSvg, svg;
    let xAxis, yAxis, domainByTrait={}, yScales={}, xScales={};
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
        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
                .transition().duration(500)
                .attr("cx", function(d) { return xScales[p.x](d[p.x]); })
                .attr("cy", function(d) { return yScales[p.y](d[p.y]); })
                .attr("r", 4)
                .style("fill", function(d) { return color(d[props.dimColor]); });
    }
    useEffect(() => {
        svg = select(refSvg);
        svg.attr("viewBox", "0 0 " + (size * numberOfTraits + padding + legendRectSize + 125) + " " + (size * numberOfTraits + padding))
        update();
    })
    function updateScales(){
        traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, function(d) {return +d[trait]; });
            let xScale, yScale;
            if(domainByTrait[trait][0] || domainByTrait[trait][0]==0){//controllo se il minore è un numero
                xScale=d3.scaleLinear().domain(domainByTrait[trait])
                yScale=d3.scaleLinear().domain(domainByTrait[trait])
            }else{
                let domain = props.data.map(l => l[trait]);
                xScale=d3.scalePoint().domain([... new Set(domain)])
                yScale=d3.scalePoint().domain([... new Set(domain)])
            }
            xScale.range([padding / 2, size - padding / 2]);
            yScale.range([size - padding / 2, padding / 2]);
            xScales[trait]=xScale;
            yScales[trait]=yScale;
        }); //calcola i massimi e i minimi
        
    }
    function updateAxis(){
        svg.selectAll(".x.axis").remove();
        svg.selectAll(".x.axis")
        .data(traits) 
        .enter() 
        .append("g") 
            .attr("class", "x axis")
            .attr("transform", function(d, i) { 
                return "translate(" + (i * size + 20)+",0)"; 
            })
            .each(function(d) {
                xAxis = d3.axisBottom(xScales[d])
                    .ticks(6) //quante tacchette sull'asse
                    .tickSize(size * numberOfTraits);
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
            .each(function(d) { 
                yAxis = d3.axisLeft(yScales[d])
                    .ticks(6)
                    .tickSize(-size * numberOfTraits);
                d3.select(this).call(yAxis); 
            });
    }
    function updatePoints(){
        svg.selectAll(".cell").remove();
        let cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
             //quindi abbiamo tutte le possibili coppie tra le varie dimensioni, ora creo il "g" che ospita il grafichino
            .enter().append("g")
                .attr("class", "cell")
                .attr("transform", function(d) { 
                    return "translate(" + (d.i * size +20) + "," + d.j * size + ")"; })
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
                var offset = padding;
                var horz = size * numberOfTraits + padding;
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
            <svg ref={(node) => { refSvg = node; }} >
            </svg>
        </div>
    )
}
ScatterPlotMatrix.propTypes = {
    data : PropTypes.array,
    dims: PropTypes.array,
    padding: PropTypes.number,
    size: PropTypes.number,
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
ScatterPlotMatrix.defaultProps = {
    data: [{ x: 10, y: 20, z: 10, h: 20 }, { x: 15, y: 35, z: 15, h: 26  }],
    padding: 20,
    size: 300,
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