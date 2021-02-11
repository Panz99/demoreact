import './App.css';
import React, {useState, useEffect} from "react";
import * as druid from '@saehrimnir/druidjs';
import MyCSVReader from './components/CsvReader.js';
import DimensionsList from './components/DimList.js';
import ScatterPlotDiv from './components/ScatterPlotDiv';
import ScatterPlotMatrixDiv from './components/ScatterPlotMatrixDiv';



function App() {
  const [data, setData] = useState([]); //array di oggetti {dim1: numeric, dim2: "string"}
  const [dims, setDims] = useState([]); //array di oggetti  {value: "string", isChecked: bool, isNumeric: bool}
  const [uData, setUData] = useState([]); //array di oggetti {dim1: numeric, dim2: "string"} con solo le dim selezionate
  const [graphDims, setGraphDims] = useState([]); //array di oggetti con dimensioni original + ridotte
  const [graphData, setGraphData] = useState([]); //array di oggetti con dimensioni originali + ridotte
  const [test, setTest] = useState(false);
  const [test2, setTest2] = useState(false);
  useEffect(() => {
    syncDimsData();
  }, [dims]);

  async function handleDataLoad(newData, newColumns){
    setTest(false);
    setTest2(false);
    //se viene richiamato il metodo quando si elimina il file
    if(newData == null){
      setDims([]);
      setData([]);
      setUData([]);
      return;
    }
    console.log("Dati ricevuti:",newData);
    console.log("Dimensioni ricevute:", newColumns);
    setData(newData);
    setDims(newColumns);
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
  function reduxDims(){
    let sendedData = [];
    let numericKey = dims.filter(dim => dim.isNumeric && dim.isChecked).map((d) => d.value);
    uData.forEach(obj => {
      let row = [];
      numericKey.forEach(key =>{
        if(!isNaN(obj[key]))
          row.push(obj[key]);
      });
      sendedData.push(row);
    });
    let matrix = druid.Matrix.from(sendedData);
    const X = matrix; // X is the data as object of the Matrix class.
    let pca = new druid.PCA(X, 2);
    let transData = pca.transform().to2dArray;
    let tempdims = [...dims], tempdata=[];
    tempdims.push({"value": "pca1", "isChecked": true, "isNumeric": true});
    tempdims.push({"value": "pca2", "isChecked": true, "isNumeric": true});
    setGraphDims(tempdims);
    let data = [...uData]
    for (let i = 0; i < uData.length; i++) {
      let line = data[i];
      line["pca1"] = transData[i][0];
      line["pca2"] = transData[i][1]; 
      tempdata.push(line);
    }
    setGraphData(tempdata);
    console.log("Riduzione PCA:", transData);
    console.log("Graph data:", graphData);
    console.log("Graph dims:", graphDims);
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
        <button className="btn btn-primary m-2" onClick={reduxDims}>Redux Dims</button>
        <hr/>
        <button className="btn btn-primary m-2" onClick={showGraph}>Show graph</button>
        {test ?
          (<ScatterPlotDiv data={uData}/>) : (null)
        }
        <button className="btn btn-primary m-2" onClick={showGraph2}>Show matrix graph</button>
        {test2 ?
          (<ScatterPlotMatrixDiv data={graphData} dims={graphDims}/>) : (null)
        }
      </header>
    </div>
  );
}

export default App;
