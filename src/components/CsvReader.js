import React from 'react'
import PropTypes from 'prop-types';
import { CSVReader } from 'react-papaparse'

export default function MyCSVReader( props ){
  function handleOnDrop(data){
    //remove empty lines
    let notNullData=[];
    data.forEach(line => {
      if(line.data.length > 1 || line.data[0]!="")
        notNullData.push(line)
    });
    props.onChange(notNullData);
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