import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ScatterPlotMatrix from "./SPM";

export default function ScatterPlotMatrixDiv (props) {
    const data = props.data;
    const dims = props.dims;
    const keys = dims.filter(dim => dim.isChecked).map((d) => d.value);
    const catKeys = dims.filter(dim => !dim.isNumeric && dim.isChecked).map((d) => d.value);
    
    const [Dims, setDims] = useState(keys.slice(0, 4));
    const [DimColore, setDimColore] = useState(catKeys[0] ? catKeys[0] : "-")
    //Per l'aggiornamento delle dimensioni nelle label delle select quando cambia file
    useEffect(() => {
        setDims(keys.slice(0, 4));
        setDimColore(catKeys[0] ? catKeys[0] : "-");
    }, [data])

    //Funzione che non permette di selezionare più volte la stessa dimensione
    function handeSelectChange(e){
        let v = e.target.value;
        if(!Dims.includes(v)|| v=="-"){
            let newDims = [...Dims];
            newDims[e.target.id.slice(-1)] = v;
            setDims(newDims);
        }else{
            alert("non puoi selezionare la stessa dimensione più volte");
        }
    }
    // Get list of possible x and y variables
    // Store all of the data to be plotted
    return (
        <div>
            <div className="d-inline-flex flex-wrap p-3">
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="selectDim0">First Dimension:</label>
                    <select id="selectDim0" value={Dims[0]} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="selectDim1">Second Dimension:</label>
                    <select id="selectDim1" value={Dims[1]} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="selectDim2">Third Dimension:</label>
                    <select id="selectDim2" value={Dims[2]} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="selectDim3">Fourth Dimension:</label>
                    <select id="selectDim3" value={Dims[3]} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* Dim Colore*/}
                <div className="m-2">
                    <label htmlFor="dCol">Color Dimension:</label>
                    <select id="dCol" value={DimColore} className="form-select" onChange={(d) => setDimColore(d.target.value)}>
                        <option key={"null"}>-</option>
                        {catKeys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
            </div>
            {/* Render scatter plot*/}
            <ScatterPlotMatrix
                dimColor={DimColore}
                data={data}
                dims={Dims.filter((d) => d!="-")}
                    />
        </div>
    )
}

ScatterPlotMatrixDiv.propTypes = {
    data : PropTypes.array,
    dims: PropTypes.array
}