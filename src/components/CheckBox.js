import React, { useState, useEffect } from 'react'

export default function CheckBox (props){
    useEffect(() => {
        console.log("Ho renderizzato la checkbox", props.dim.value);
    })
    return (
      <li className="list-group-item text-secondary" key={props.dim.value}>
       <input className="form-check-input" 
       key={props.dim.value}
       onChange={props.handleCheckChieldElement} 
       type="checkbox" 
       checked={props.dim.isChecked} 
       value={props.dim.value} /> {props.dim.value}
      </li>
    )
}