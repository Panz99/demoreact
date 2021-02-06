import React, { useState, useEffect } from 'react'
import CheckBox from "./CheckBox";

export default function DimensionsList( props ){
    const [dataLoaded, setDataLoaded] = useState(false);
    const [allChecked, setAllChecked] = useState(true);
    const [dimsLoaded, setDimsLoaded] = useState(props.dims)
    
    useEffect( () => {
        console.log("effect")
        if(props.dims != dimsLoaded){
            setDimsLoaded(props.dims);
            setDataLoaded(true);
        }
        //setDataLoaded(false);
        
    });

    function handleAllChecked (event) {
        let dims = dimsLoaded
        dims.forEach(dim => dim.isChecked = event.target.checked);
        setDimsLoaded(dims);
        if(allChecked)
            setAllChecked(false)
        else
            setAllChecked(true)
    }    
    function handleCheckChieldElement (event) {
        let temp=false;
        let dims = dimsLoaded
        dims.forEach(dim => {
            if (dim.value === event.target.value){
                dim.isChecked =  event.target.checked;
            }   
            if (!dim.isChecked)
                temp=false;
        });
        setDimsLoaded(dims);
        setAllChecked(temp);
    }
    return(
        <div>
            <h4>Lista dimensioni</h4>
            {dataLoaded ? 
                (<li className="list-group-item text-secondary" key="checkall">
                    <input className="form-check-input" key="checkall" checked={allChecked} type="checkbox" value="checkedall" onChange={handleAllChecked} />Seleziona tutto
                </li> ) : (null)
            }
            <ul className="list-group list-group-horizontal d-inline-flex flex-wrap flex-fill">
                {
                    dimsLoaded.map((dim)=>{
                        console.log(dim.isChecked)
                        return (<CheckBox key={dim.value} handleCheckChieldElement={handleCheckChieldElement} dim={dim} />)
                    })
                }
            </ul>
        </div>
    );
}
