import React from 'react'
import PropTypes from 'prop-types';

export default function CheckBoxRedux (props){
    return (
      <li className="list-group-item text-secondary" key={props.value+"_r"}>
       <input className="form-check-input" 
       key={props.value+"_r"}
       id={props.value+"_r"}
       onChange={props.handleCheckChieldElement} 
       type="checkbox" 
       checked={props.toRedux} 
       value={props.value} /> 
       <label htmlFor={props.value+"_r"} className="h-6">{props.value}</label>
      </li>
    )
}

CheckBoxRedux.propTypes = {
  dim : PropTypes.object,
  value: PropTypes.string,
  toRedux: PropTypes.bool,
  handleCheckChieldElement : PropTypes.func
}