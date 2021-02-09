import './App.css';
import React, {useState, useEffect} from "react";
import MyCSVReader from './components/CsvReader.js';
import DimensionsList from './components/DimList.js';
import ScatterPlotDiv from './components/ScatterPlotDiv';
import ScatterPlotMatrixDiv from './components/ScatterPlotMatrixDiv';


function App() {
  const [data, setData] = useState([]);
  const [dims, setDims] = useState([]);
  const [uData, setUData] = useState([]);
  const [test, setTest] = useState(false);
  const [test2, setTest2] = useState(false);
  useEffect(() => {
    syncDimsData();
  }, [dims]);

  function handleDataLoad(newData){
    if(newData == null){
      setDims([]);
      setData([]);
      setUData([]);
      setTest(false);
      return;
    }
    let tempDims = newData.shift();
    let dims = [];
    tempDims.data.forEach(tempDim => {
      dims.push({"value": tempDim, "isChecked": true});
    });
    
    let data = [];
    newData.forEach(val =>{
      var line = new Object();
      for (let i = 0; i < val.data.length; i++) {
        line[dims[i].value] = val.data[i]
      }
      data.push(line);
    });
    setData(data);
    setDims(dims);
  }

  function syncDimsData(){
    let aux = [];
    data.forEach(d => { //qui ho un oggetto con tutti i campi
      let line= new Object();  //qui salvo i nuovi oggi con io campi true
      Object.keys(d).forEach(key => {
        dims.forEach(dim => {
          if(key === dim.value && dim.isChecked)
            line[key] = d[key];
        });
      });
      aux.push(line);
    });
    setUData(aux);
  }
  function handleChangeDims(newDims){
    setDims(newDims);
  }
  function showGraph(){
    setTest(true);
    setTest2(false);
  }
  
  function showGraph2(){
    setTest2(true);
    setTest(false);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Demo react hooks</h1>
        <MyCSVReader onChange={handleDataLoad}></MyCSVReader>
        <hr/>
        <div className="d-inline-flex">
          <button className="btn btn-primary m-2" onClick={() =>{console.log(data)}}>Log Data</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(dims)}}>Log Dimension</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(uData)}}>Log Used Data</button>
        </div>
        <DimensionsList dims={dims} updateDims={handleChangeDims}/>
        <hr/>
        <button className="btn btn-primary m-2" onClick={showGraph}>Show graph</button>
        {test ?
          (<ScatterPlotDiv data={uData}/>) : (null)
        }
        <button className="btn btn-primary m-2" onClick={showGraph2}>Show graph</button>
        {test2 ?
          (<ScatterPlotMatrixDiv data={uData}/>) : (null)
        }
      </header>
    </div>
  );
}

export default App;
