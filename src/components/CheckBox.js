import React from 'react'
import PropTypes from 'prop-types';

export default function CheckBox (props){
    return (
      <li className="list-group-item text-secondary" key={props.value}>
       <input className="form-check-input" 
       key={props.value}
       id={props.value}
       onChange={props.handleCheckChieldElement} 
       type="checkbox" 
       checked={props.isChecked} 
       value={props.value} /> 
       <label htmlFor={props.value} className="h-6">{props.value}</label>
      </li>
    )
}

CheckBox.propTypes = {
  dim : PropTypes.object,
  value: PropTypes.string,
  isChecked: PropTypes.bool,
  handleCheckChieldElement : PropTypes.func
}