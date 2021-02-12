import React, { useState, useEffect } from 'react'
import CheckBox from "./CheckBox";
import PropTypes from 'prop-types';

export default function DimensionsList( props ){
    const [dataLoaded, setDataLoaded] = useState(false);
    const [allChecked, setAllChecked] = useState(true);
    
    useEffect( () => {
        if(props.dims.length>0)
            setDataLoaded(true);
        else
            setDataLoaded(false);
    }, [props.dims]);

    function handleAllChecked (event) {
        let dims = [...props.dims];
        dims.forEach(dim => dim.isChecked = event.target.checked);
        props.updateDims(dims);
        if(allChecked)
            setAllChecked(false)
        else
            setAllChecked(true)
    }    
    function handleCheckChieldElement (event) {
        let temp=true;
        let dims = [...props.dims]
        dims.forEach(dim => {
            if (dim.value === event.target.value){
                dim.isChecked =  event.target.checked;
            }   
            if (!dim.isChecked){
                temp=false;
            }
        });
        setAllChecked(temp);
        props.updateDims(dims);
    }
    return(
        <div className="w-75">
            <h4>Lista dimensioni</h4>
            {dataLoaded ? 
                (<li className="list-group-item text-secondary" key="checkall">
                    <input className="form-check-input" key="checkall" checked={allChecked} type="checkbox" value="checkedall" id="checkAll" onChange={handleAllChecked} /><label htmlFor="checkAll" className="h-6">Seleziona tutto</label> 
                </li> ) : (null)
            }
            <ul className="list-group list-group-horizontal d-inline-flex flex-wrap flex-fill">
                {
                    props.dims.filter(dim => !dim.isRedux).map((dim)=>{
                        return (<CheckBox key={dim.value} handleCheckChieldElement={handleCheckChieldElement} {...dim} />)
                    })
                }
            </ul>
        </div>
    );
}

DimensionsList.propTypes = {
    dims : PropTypes.array,
    updateDims : PropTypes.func
}