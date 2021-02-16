import React, { useState, useEffect } from 'react'
import CheckBoxRedux from "./CheckBox2";
import PropTypes from 'prop-types';

export default function DimensionsListRedux( props ){
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
        dims.forEach(dim => dim.toRedux = event.target.checked);
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
                dim.toRedux =  event.target.checked;
            }   
            if (!dim.toRedux){
                temp=false;
            }
        });
        setAllChecked(temp);
        props.updateDims(dims);
    }
    return(
        <div>
            {dataLoaded ? 
                (<li className="list-group-item text-secondary" key="checkall_r">
                    <input className="form-check-input" key="checkall_r" checked={allChecked} type="checkbox" value="checkedall" id="checkAll_r" onChange={handleAllChecked} /><label htmlFor="checkAll_r" className="h-6">Seleziona tutto</label> 
                </li> ) : (null)
            }
            <ul className="list-group list-group-horizontal d-inline-flex flex-wrap flex-fill">
                {
                    props.dims.filter(dim => dim.isChecked && dim.isNumeric).map((dim)=>{
                        return (<CheckBoxRedux key={dim.value+"_r"} handleCheckChieldElement={handleCheckChieldElement} {...dim} />)
                    })
                }
            </ul>
        </div>
    );
}

DimensionsListRedux.propTypes = {
    dims : PropTypes.array,
    updateDims : PropTypes.func,
    sender: PropTypes.string
}