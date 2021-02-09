import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ScatterPlotMatrix from "./SPM";

export default function ScatterPlotMatrixDiv (props) {
    const data = props.data;
    const keys = Object.keys(props.data[0]);
    const [Dim1, setDim1] = useState(keys[0] ? keys[0] : "-");
    const [Dim2, setDim2] = useState(keys[1] ? keys[1] : "-");
    const [Dim3, setDim3] = useState(keys[2] ? keys[2] : "-");
    const [Dim4, setDim4] = useState(keys[3] ? keys[3] : "-");
    const [Dims, setDims] = useState(keys.slice(0, 4));
    const [DimColore, setDimColore] = useState(keys[4] ? keys[4] : "-")
    
    //Per l'aggiornamento delle dimensioni nelle label delle select quando cambia file
    useEffect(() => {
        setDim1(keys[0] ? keys[0] : "-")
        setDim2(keys[1] ? keys[1] : "-")
        setDim3(keys[2] ? keys[2] : "-")
        setDim4(keys[3] ? keys[3] : "-")
        setDimColore(keys[4] ? keys[4] : "-")
    }, [data])
    //Per l'aggiornamento dei dati da mandare allo SPM quando cambiano le dimensioni
    useEffect(() => {
        let temp=[];
        if(Dim1!="-"){ temp.push(Dim1);}
        if(Dim2!="-"){ temp.push(Dim2);}
        if(Dim3!="-"){ temp.push(Dim3);}
        if(Dim4!="-"){ temp.push(Dim4);}
        setDims(temp);
    }, [Dim1, Dim2, Dim3, Dim4])

    //Funzione che non permette di selezionare più volte la stessa dimensione
    function handeSelectChange(e){
        let v = e.target.value;
        if((v!=Dim1 && v!=Dim2 && v!=Dim3 && v!=Dim4) || v=="-"){
            switch (e.target.id) {
                case "d1":
                    setDim1(v);
                    break;
                case "d2":
                    setDim2(v);
                    break;
                case "d3":
                    setDim3(v);
                    break;
                case "d4":
                    setDim4(v);
                    break;
                default:
                    break;
            }
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
                    <label htmlFor="d1">First Dimension:</label>
                    <select id="d1" value={Dim1} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="d2">Second Dimension:</label>
                    <select id="d2" value={Dim2} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="d3">Third Dimension:</label>
                    <select id="d3" value={Dim3} className="form-select" onChange={handeSelectChange}>
                        <option key={"null"}>-</option>
                        {keys.map((d) => {
                                return <option key={d}>{d}</option>
                        })}
                    </select>
                </div>
                {/* First Dimension Select Menu */}
                <div className="m-2">
                    <label htmlFor="d4">Fourth Dimension:</label>
                    <select id="d4" value={Dim4} className="form-select" onChange={handeSelectChange}>
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
                dimColor={DimColore}
                data={data}
                dims={Dims}
                    />
        </div>
    )
}

ScatterPlotMatrixDiv.propTypes = {
    data : PropTypes.array,
}