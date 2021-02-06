import React from 'react'
import PropTypes from 'prop-types';
import { CSVReader } from 'react-papaparse'

export default function MyCSVReader( props ){
  function handleOnDrop(data){
    props.onChange(data);
  }

  function handleOnError(err, /*file, inputElem, reason*/){
    console.log(err)
  }

  function handleOnRemoveFile(data){
    console.log('---------------------------')
    console.log(data)
    props.onChange(data)
    console.log('---------------------------')
  }

    return (
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        removeButtonColor='#ff0000'
        onRemoveFile={handleOnRemoveFile}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    )
}

MyCSVReader.propTypes = {
  onChange : PropTypes.func
}