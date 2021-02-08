import React, {useEffect} from "react";
import * as d3 from "d3"
import PropTypes from 'prop-types';
import { select } from "d3";


export default function ScatterPlot (props) {
    
    //Sono i riferimenti ai g che ho costruito nel return.
    let refSvg;
    var 
    size = 230,
    padding = 20;
    const data = props.data;
    //var traits = Object.keys(data[0]);
    var traits = props.dims;
    var numberOfTraits = traits.length;
    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6); //quante tacchette sull'asse

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var domainByTrait = {};
    //per ogni dimensione ritorno il min e il max usando extent() in modo da trovare il dominio
    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) {return d[trait]; }); //CREDO che la funzione preleva da data tutta la colonna interessata
    }); 
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

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
        .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 4)
            .style("fill", function(d) { console.log(props.dimColor); return color(d[props.dimColor]); });
    }
    useEffect(() => {
        let svg = select(refSvg);
        svg.append("g") //cosa fa??
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
        svg.selectAll(".x.axis") 
        .data(traits) 
        .enter() 
        .append("g") 
            .attr("class", "x axis")
            .attr("transform", function(d, i) { return "translate(" + (numberOfTraits - i - 1) * size + ",0)"; }) //controllare cosa fa di specifico
            .each(function(d) { //Invokes the specified function for each element in the current selection, passing in the current datum d and index i, with the this context of the current DOM element
                x.domain(domainByTrait[d]); //x è la scala, gli imposta il dominio
                d3.select(this).call(xAxis); //e dopo gli assegna l'asse con la scala di "x" settata alla riga precedente
            });

         svg.selectAll(".y.axis")
         .data(traits)
         .enter().append("g")
             .attr("class", "y axis")
             .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
         .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

         var cell;
         cell = svg.selectAll(".cell")
             .data(cross(traits, traits)) //d3.cross returns an array of arrays representing the Cartesian product of the given iterables. For example, given two arrays A and B, it returns an array of pairs [a, b] for each a in A and b in B.
             //quindi abbiamo tutte le possibili coppie tra le varie dimensioni, ora creo il "g" che ospita il grafichino
             .enter().append("g")
                 .attr("class", "cell")
                 .attr("transform", function(d) { return "translate(" + (numberOfTraits - d.i - 1) * size + "," + d.j * size + ")"; })
             //creo il grafichino
             .each(plot);

             cell.filter(function(d) { return d.i === d.j; }) //toglie quelle uguali
             .append("text")
                 .attr("x", padding)
                 .attr("y", padding)
                 .attr("dy", ".71em")
             .text(function(d) { return d.x; });
    })
     
    return (
        <div className="bg-secondary p-4">
            <svg ref={(node) => { console.log("render"); refSvg = node; }} width={size * numberOfTraits + padding} height={size * numberOfTraits + padding}>
                <text transform={`translate(${props.margin.left},15)`}>{props.title}</text>
                
            </svg>
        </div>
    )
}
ScatterPlot.propTypes = {
    data : PropTypes.array,
    dims: PropTypes.array,
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
    dimColor: PropTypes.string,
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
};