import './App.css';
import React, {useState, useEffect} from "react";
import MyCSVReader from './components/CsvReader.js';
import DimensionsList from './components/DimList.js';
import ScatterPlotDiv from './components/ScatterPlotDiv';


//const aux = []
function App() {
  const [data, setData] = useState([]);
  const [dims, setDims] = useState([]);
  const [uData, setUData] = useState([]);
  const [test, setTest] = useState(false);
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
      let line = [];
      for (let i = 0; i < val.data.length; i++) {
        line.push({"value" : val.data[i], "column": dims[i].value});
      }
      data.push(line);
    });
    setData(data);
    setDims(dims);
  }

  function syncDimsData(){
    let aux = [];
    data.forEach(d => { //qui ho un array di oggetti del tipo val, column
      let line=[];  //qui salvo gli oggetti val, column se column = true
      d.forEach(value => {
        dims.forEach(dim => {
          if(value.column === dim.value && dim.isChecked)
            line.push(value);
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
    console.log("click show graph");
    setTest(true);
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
      </header>
    </div>
  );
}

export default App;
