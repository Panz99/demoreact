import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ScatterPlot from "./SP";

export default function ScatterPlotDiv (props) {
    const [xVar, setXVar] = useState(props.data[0][0].column);
    const [yVar, setYVar] = useState(props.data[0][1].column);
    const data = props.data;
    //const dims = props.dims;

    useEffect(() => {
        setXVar(props.data[0][0].column)
        setYVar(props.data[0][1].column)
    }, [data])
    // Get list of possible x and y variables
    let options = data[0].length === 0 ? [] : (data[0].map((d) => d.column) );
    //options = options.filter((d) => d != "county" && d != "state");
    // Store all of the data to be plotted 
    let allData = [];
    data.map((line) => {
        var xval=0; var yval=0;
        line.map((d) => {
            if(d.column === xVar){
                xval=d.value;
            }
            if(d.column === yVar){
                yval=d.value;
            }
        });
        allData.push({
            "x" : xval,
            "y" : yval,
            "label": "prova"
        });
    });
    return (
        <div className="container">
            <div className="control-container">

                {/* X Variable Select Menu */}
                <div className="control-wrapper">
                    <label htmlFor="xVar">X Variable:</label>
                    <select id="xVar" value={xVar} className="custom-select" onChange={(d) => setXVar(d.target.value)}>
                        {options.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>

                {/* Y Variable Select Menu */}
                <div className="control-wrapper">
                    <label htmlFor="yVar">Y Variable:</label>
                    <select id="yVar" value={yVar} className="custom-select" onChange={(d) => setYVar(d.target.value)}>
                        {options.map((d) => {
                            return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>                        
            </div>

            {/* Render scatter plot*/}
            <ScatterPlot
                xTitle={xVar}
                yTitle={yVar}
                data={allData}
            />
        </div>
    )
}

ScatterPlotDiv.propTypes = {
    data : PropTypes.array,
}