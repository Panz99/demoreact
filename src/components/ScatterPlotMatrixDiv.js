import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ScatterPlotMatrix from "./SPM";

export default function ScatterPlotMatrixDiv (props) {
    const data = props.data;
    const keys = Object.keys(data[0]);
    const [Dim1, setDim1] = useState(keys[0]);
    const [Dim2, setDim2] = useState(keys[1]);
    const [Dim3, setDim3] = useState(keys[2]);
    const [Dim4, setDim4] = useState(keys[3]);
    
    //const dims = props.dims;

    useEffect(() => {
        setDim1(keys[0])
        setDim2(keys[1])
        setDim3(keys[2])
        setDim4(keys[3])
    }, [data])
    // Get list of possible x and y variables
    // Store all of the data to be plotted 
    let allData = [];
    data.map((line) => {
        allData.push({
            "d1" : line[Dim1],
            "d2" : line[Dim2],
            "d3" : line[Dim1],
            "d4" : line[Dim2],
            "label": ""
        });
    });
    return (
        <div>
            <div className="d-inline-flex p-3">
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="xVar">First Dimension:</label>
                    <select id="xVar" value={Dim1} className="form-select" onChange={(d) => setDim1(d.target.value)}>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="xVar">First Dimension:</label>
                    <select id="xVar" value={Dim2} className="form-select" onChange={(d) => setDim2(d.target.value)}>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="xVar">First Dimension:</label>
                    <select id="xVar" value={Dim3} className="form-select" onChange={(d) => setDim3(d.target.value)}>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="xVar">First Dimension:</label>
                    <select id="xVar" value={Dim4} className="form-select" onChange={(d) => setDim4(d.target.value)}>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
            </div>
            {/* Render scatter plot*/}
            <ScatterPlotMatrix
                dim1Title={Dim1}
                dim2Title={Dim2}
                dim3Title={Dim3}
                dim4Title={Dim3}
                data={allData}
            />
        </div>
    )
}

ScatterPlotMatrixDiv.propTypes = {
    data : PropTypes.array,
}