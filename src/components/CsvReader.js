import React from 'react'
import PropTypes from 'prop-types';
import { CSVReader } from 'react-papaparse'

export default function MyCSVReader( props ){
  //prendo il file ricevuto dal CSV reader e preparo un array contentente i dati e uno contentene le dimensioni
  function handleOnDrop(data){
    let columns = data.shift().data; //Salvo la prima riga del file che contiene i nomi delle dimensioni
    let parsedData = []; 
    data.forEach(val =>{  //Scorro ogni riga del file
      var line = new Object();
      if(val.data!=""){ //controllo se la riga esiste
        for (let i = 0; i < val.data.length; i++) { //ciclo su tutti i valori della riga
          if(val.data[i]=="") //controllo se il valore é diverso da null
            line[columns[i]] = "undefined";     //se un valore é vuoto lo metto ad undefined
          else
            line[columns[i]] = (+val.data[i]) ? +val.data[i] : val.data[i]; //se il valore é numerico lo salvo come numerico, altrimenti come stringa
        }
        parsedData.push(line);  //riempio un array l'oggetto appena creato
      }
    });
    //per ogni dimensione vado a costruire un oggetto e raccolgo tutto in un array
    let dims = columns.map((tempDim) => ({"value": tempDim, "isChecked": true, "toRedux":true, "isRedux": false ,"isNumeric": (+parsedData[0][tempDim]) ? true : false}))
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