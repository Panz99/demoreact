import './App.css';
import logo from './logo.svg';
import React, {useState, useEffect} from "react";
import * as druid from '@saehrimnir/druidjs';
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
  const [syncDim, setSyncDim] = useState(0);
  const [test, setTest] = useState(false);
  const [test2, setTest2] = useState(false);
  useEffect(() => {
    syncDimsData();
    setTest(false);
    setTest2(false);
  }, [syncDim]);

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
    setSyncDim(syncDim+1)
  }
  function haveNanValue(d){
    const numeric_checkedDims = dims.filter(dim => dim.isChecked && dim.isNumeric && !dim.isRedux).map((d) => d.value);
    let not_nan = true;
    numeric_checkedDims.forEach(dim => {
      if(isNaN(d[dim])){
        not_nan = false;
        return;
      }
    }); 
    return not_nan;
  }
  function syncDimsData(){
    console.log("syncDimData");
    const checkedDims = dims.filter(dim => dim.isChecked && !dim.isRedux).map((d) => d.value);  //array con i nomi delle dimensioni checked
    let aux = data.map(d => {    //con filter tolgo i dati che hanno alcune dimensioni numeriche selezionate NaN; e con map prendo le dimensioni selezionate
        return Object.fromEntries(checkedDims.map(dim => [dim, d[dim]]))
     }).filter(haveNanValue);
    setUData(aux);
    const removedReduxDims = dims.filter(dim => !dim.isRedux);
    setDims(removedReduxDims);
  }
  function handleChangeDims(newDims){
    setDims(newDims);
    setSyncDim(syncDim+1)
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
    const catDims = dims.filter(dim => !dim.isNumeric && dim.isChecked).map((d) => d.value);
    //Dati con dimensioni numeriche e selezionate
    const sendedData = uData.map(obj => {
      return Array.from(numericDims.map((dim) => obj[dim]))
    });
    //Dati con dimensioni categoriche e selezionate
    const label = uData.map(obj =>{
      return Array.from(catDims.map((dim) => obj[dim]))
    });
    //Matrix.from vuole un Array di array, senza quindi le chiavi delle dimensioni
    //Sendend data é un array del tipo [[1,2,3], [2,3,4], [5,6,7]]
    const matrix = druid.Matrix.from(sendedData); //matrix é un oggetto con campo column, row e data, con data array di valori [1,2,3,4,5,6,7,..]
    const DR = "LDA";
    let dr = new druid[DR](matrix, label.map(d => d[0]));
    const Y = dr.transform()  //IMPORTANTISSIMO ASSEGNARLO AD UN CONST
    //Aggiorno l'array delle dimensioni con le dimensioni ridotte
    
    let tempdims = [...dims];
    for (let i = 1; i <= Y._cols; i++) {
      tempdims.push({"value": (DR+i), "isChecked": true, "isNumeric": true, "isRedux" : true});
    }
    const reduxDims = tempdims.filter(d => d.isRedux).map(d => d.value);
    let tempdata = [...uData];
    for(let i = 0; i<uData.length; i++){
      let data = tempdata[i];
      let j=0;
      reduxDims.forEach(dim => {
        data[dim] = Y.to2dArray[i][j]
        j++
      });
    }
    setUData(tempdata);
    setDims(tempdims);
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
        </div>
        <hr/>
        <div className="w-75 mx-auto">
          <h4>Selenziona le dimensioni che desideri utilizzare</h4>
          <DimensionsList dims={dims} updateDims={handleChangeDims}/>
        </div>
        <hr/>
        <h2>Riduzione dimensionale</h2>
        <div className="w-75 mx-auto d-inline-flex">
          <DimensionsList dims={dims.filter(d => d.isChecked)}/>
          <select id="algRedux" className="form-select">
            <option>PCA</option>
          </select>
          <button className="btn btn-primary m-2" onClick={() =>{"Effettua riduzione Fake"}}>Effettua riduzione Fake</button>
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
            (<div className="w-75 mx-auto"><ScatterPlotMatrixDiv data={uData} dims={dims}/></div>) : (null)
          }
      </div>
    </div>
  );
}

export default App;
