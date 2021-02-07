import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ScatterPlot from "./SP";

export default function ScatterPlotDiv (props) {
    const data = props.data;
    const keys = Object.keys(data[0]);
    const [xVar, setXVar] = useState(keys[0]);
    const [yVar, setYVar] = useState(keys[1]);
    
    //const dims = props.dims;

    useEffect(() => {
        setXVar(keys[0])
        setYVar(keys[1])
    }, [data])
    // Get list of possible x and y variables
    // Store all of the data to be plotted 
    let allData = [];
    data.map((line) => {
        allData.push({
            "x" : line[xVar],
            "y" : line[yVar],
            "label": "X: " + line[xVar] + " Y: "+line[yVar]
        });
    });
    return (
        <div>
            <div className="d-inline-flex p-3">
                {/* X Variable Select Menu */}
                <div className="m-2">
                    <label htmlFor="xVar">X Variable:</label>
                    <select id="xVar" value={xVar} className="form-select" onChange={(d) => setXVar(d.target.value)}>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>

                {/* Y Variable Select Menu */}
                <div className="m-2">
                    <label htmlFor="yVar">Y Variable:</label>
                    <select id="yVar" value={yVar} className="form-select" onChange={(d) => setYVar(d.target.value)}>
                        {keys.map((d) => {
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