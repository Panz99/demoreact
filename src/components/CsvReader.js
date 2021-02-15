import React from 'react'
import PropTypes from 'prop-types';
import { CSVReader } from 'react-papaparse'

export default function MyCSVReader( props ){
  function handleOnDrop(data){
    //prendo il file ricevuto dal reader e preparo i data e le columns
    let columns = data.shift().data, parsedData = [];
    data.forEach(val =>{
      var line = new Object();
      if(val.data!=""){ //controllo se il dato ha valori
        for (let i = 0; i < val.data.length; i++) {
          if(val.data[i]=="")
            line[columns[i]] = "undefined";     //se un campo é vuoto lo metto ad undefined
          else
            line[columns[i]] = (+val.data[i]) ? +val.data[i] : val.data[i];
        }
        parsedData.push(line);
      }
    });
    let dims = columns.map((tempDim) => ({"value": tempDim, "isChecked": true, "toRedux": true, "isRedux": false ,"isNumeric": (+parsedData[0][tempDim]) ? true : false}))
    props.onChange(parsedData, dims);
  }

  function handleOnError(err, /*file, inputElem, reason*/){
    console.log(err)
  }

  function handleOnRemoveFile(data){
    props.onChange(data)
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