import './App.css';
import logo from './logo.svg';
import React, {useState, useEffect} from "react";
//import * as druid from '@saehrimnir/druidjs';
import MyCSVReader from './components/CsvReader.js';
import DimensionsList from './components/DimList.js';
import ScatterPlotDiv from './components/ScatterPlotDiv';
import ScatterPlotMatrixDiv from './components/ScatterPlotMatrixDiv';

/*-----------FUNZIONI UTILI---------------

--Filtra un array per un valore e restituisce un array con tutti i valori che preferisco--
const checkedDims = dims.filter(dim => dim.isChecked).map((d) => d.value);
*/

function App() {
  const [data, setData] = useState([]); //array di oggetti {dim1: numeric, dim2: "string"}
  const [dims, setDims] = useState([]); //array di oggetti  {value: "string", isChecked: bool, isNumeric: bool, isRedux: bool}
  const [uData, setUData] = useState([]); //array di oggetti {dim1: numeric, dim2: "string"} con solo le dim selezionate
  const [graphData, setGraphData] = useState([]); //array di oggetti con dimensioni originali + ridotte
  const [test, setTest] = useState(false);
  const [test2, setTest2] = useState(false);
  useEffect(() => {
    syncDimsData();
    setTest(false);
    setTest2(false);
  }, [dims]);

  function handleDataLoad(newData, newColumns){
    setTest(false);
    setTest2(false);
    //se viene richiamato il metodo quando si elimina il file
    if(newData == null){
      setDims([]);
      setData([]);
      setUData([]);
      return;
    }
    setData(newData);
    setDims(newColumns);
  }
  function haveNanValue(d){
    const numeric_checkedDims = dims.filter(dim => dim.isChecked && dim.isNumeric).map((d) => d.value);
    let not_nan = true;
    numeric_checkedDims.forEach(dim => {
      if(isNaN(d[dim])){
        not_nan = false;
        return
      }
    }); 
    return not_nan;
  }
  function syncDimsData(){
    const checkedDims = dims.filter(dim => dim.isChecked).map((d) => d.value);  //array con i nomi delle dimensioni checked
    let aux = data.map(d => {    //con filter tolgo i dati che hanno alcune dimensioni numeriche selezionate NaN; e con map prendo le dimensioni selezionate
        return Object.fromEntries(checkedDims.map(dim => [dim, d[dim]]))
     }).filter(haveNanValue);
    setUData(aux);
    setGraphData(aux);
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
    //Array con dimensioni numeriche e selezionate
    const numericDims = dims.filter(dim => dim.isNumeric && dim.isChecked).map((d) => d.value);
    //Dati con dimensioni numeriche e selezionate
    let sendedData = uData.map(obj => {
      return Object.fromEntries(numericDims.map((dim) => [dim, obj[dim]]))
    });
    console.log(sendedData);
    //VANNO RIMOSSI I VALORI NaN da sendedData
    /*let matrix = druid.Matrix.from(sendedData);
    const X = matrix; // X is the data as object of the Matrix class.
    let pca = new druid.PCA(X, 2);
    let transData = pca.transform().to2dArray;

    */
    let tempdims = [...dims];
    tempdims.push({"value": "pca1", "isChecked": true, "isNumeric": true, "isRedux" : true});
    tempdims.push({"value": "pca2", "isChecked": true, "isNumeric": true, "isRedux" : true});
    console.log(tempdims)
    setDims(tempdims);
    /*setGraphDims(tempdims);
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
    console.log("Graph dims:", graphDims);*/
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title" >PoC HDviz</h1>
      </header>
      <div>
        <div className="d-inline-flex m-3 justify-content-around w-75">
          <div>
            <MyCSVReader onChange={handleDataLoad}></MyCSVReader>
          </div>
          <div>
            <button className="btn btn-primary m-2" onClick={() =>{console.log("Carica dati dal db")}}>Carica dati dal db</button>
          </div>
          <div className="d-flex flex-column">
            <button className="btn btn-primary m-2" onClick={() =>{console.log("Carica dati dal db")}}>Carica dati dal db</button>
            <button className="btn btn-primary m-2" onClick={() =>{console.log("Export Configurazione")}}>Export Configurazione</button>
          </div>
        </div>
        <div className="d-inline-flex">
          <button className="btn btn-primary m-2" onClick={() =>{console.log(data)}}>Log Data</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(dims)}}>Log Dimension</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(uData)}}>Log Used Data</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(graphData)}}>Log GraphData</button>
        </div>
        <hr/>
        <div className="w-75 mx-auto">
          <h4>Selenziona le dimensioni che desideri utilizzare</h4>
          <DimensionsList dims={dims} updateDims={handleChangeDims}/>
        </div>
        <hr/>
        <h2>Riduzione dimensionale</h2>
        <div className="w-75 mx-auto d-inline-flex">
          <DimensionsList dims={dims}/>
          <select id="algRedux" className="form-select">
            <option>PCA</option>
          </select>
          <button className="btn btn-primary m-2" onClick={() =>{console.log("Effettua riduzione")}}>Effettua riduzione Fake</button>
          <button className="btn btn-primary m-2" onClick={reduxDims}>Redux Dims</button>
        </div>
        <hr/>
        <div className="d-inline-flex">
          <button className="btn btn-primary m-2" onClick={showGraph}>Scatter Plot</button>
          <button className="btn btn-primary m-2" onClick={showGraph2}>Scatter Plot Matrix</button>
        </div>
        {test ?
            (<div className="w-75 mx-auto"><ScatterPlotDiv data={uData}/></div>) : (null)
          }
          {test2 ?
            (<div className="w-75 mx-auto"><ScatterPlotMatrixDiv data={graphData} dims={dims}/></div>) : (null)
          }
      </div>
    </div>
  );
}

export default App;
