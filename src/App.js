import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";
import MyCSVReader from './components/CsvReader';
import DimensionsList from './components/DimList'

function App() {
  const [data, setData] = useState([]);
  const [dims, setDims] = useState([]);

  function handleDataLoad(newData){
    if(newData == null){
      setDims([]);
      setData([]);
      return;
    }
    let tempDims = newData.shift();
    let dims = [];
    tempDims.data.forEach(tempDim => {
      dims.push({"value": tempDim, "isChecked": true});
    });
    
    let data = [];
    newData.forEach(val =>{
      let line = [];
      for (let i = 0; i < val.data.length; i++) {
        line.push({"value" : val.data[i], "column": dims[i].value});
      }
      data.push(line);
    });
    setDims(dims);
    setData(data);
  }
  function handleChangeDims(newDims){

  }
  function handleShowData(){
    console.log(data);
  }
  function handleShowDimension(){
    console.log(dims);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Demo react hooks</h1>
        <MyCSVReader onChange={handleDataLoad}></MyCSVReader>
        <hr></hr>
        <button className="btn btn-primary" onClick={handleShowData}>Show Data</button>
        <hr></hr>
        <button className="btn btn-primary" onClick={handleShowDimension}>Show Dimension</button>
        <hr></hr>
        <DimensionsList dims={dims}/>
      </header>
    </div>
  );
}

export default App;
