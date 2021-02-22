import './App.css';
import logo from './logo.svg';
import React, {useState, useEffect} from "react";
import * as druid from '@saehrimnir/druidjs';
import MyCSVReader from './components/CsvReader.js';
import DimensionsList from './components/DimList.js';
import DimensionsListRedux from './components/DimList2.js';
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
  const [nCNRDims, setNCNRDims] = useState(0);  //numero di dimensioni selezionate e non ridotte
  const [drAlgo, setDrAlgo] = useState("FASTMAP");
  const [neighbors, setNeighbors] = useState(30);
  const [test, setTest] = useState(false);
  const [test2, setTest2] = useState(false);
  const [newDimName, setNewDimName] = useState("FASTMAP");
  const [nNewDim, setNNewDim] = useState(2);
  useEffect(() => {
    setTest(false);
    setTest2(false);
  }, [dims]);

  useEffect(() => {
    syncDimsData();
  }, [nCNRDims])

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
    setNCNRDims(newColumns.filter(d => d.isChecked && !d.isRedux).length);
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
    setNCNRDims(newDims.filter(d => d.isChecked && !d.isRedux).length);
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
    //Array con dimensioni numeriche e selezionate e da ridurre
    const numericDims = dims.filter(dim => dim.isNumeric && dim.isChecked && dim.toRedux).map((d) => d.value);
    //Dati con dimensioni numeriche e selezionate e da ridurre
    const sendedData = uData.map(obj => {
      return Array.from(numericDims.map((dim) => obj[dim]))
    });
    function dr(){
      // Matrice con i dati delle dimensioni da ridurre
      const X = druid.Matrix.from(sendedData); 
      // DR é l'algoritmo scelto dall'utente
      const DR = druid[drAlgo]; 
      //costruisco l'oggetto di riduzione dimensionale
      switch(drAlgo){
        case "FASTMAP":
        case "TSNE":
          return new DR(X, nNewDim);
        default:
          return new DR(X, nNewDim, neighbors);
      }
    }
    let redux = dr();
    const Y = redux.transform()  //Con transform applico la riduzione
    //Aggiorno l'array delle dimensioni con le dimensioni ridotte
    //Aggiorno l'array dei dati con i dati ricevuti dalla riduzione
    
    let reduxDims = [];//Nuove dimensioni ridotte
    for (let i = 1; i <= Y._cols; i++) {
      reduxDims.push({"value": (newDimName+i), "isChecked": true, "toRedux": true,"isNumeric": true, "isRedux" : true});
    }
    let tempdims=[...dims].filter(d => !d.value.includes(newDimName));

    let tempdata = uData.map((d) =>{
      return Object.fromEntries(tempdims.map((dim => [dim.value, d[dim.value]])))
    });
    tempdims = tempdims.concat(reduxDims);
    //aggiungo ad ogni dato i nuovi valori delle nuove dimensioni
    for(let i = 0; i<tempdata.length; i++){
      let data = tempdata[i];
      let j=0;
      reduxDims.forEach(dim => {
        data[dim.value] = Y.to2dArray[i][j]
        j++
      });
    }
    //aggiorno udata e dims con le nuove dimensioni e dati
    setUData(tempdata);
    setDims(tempdims);
    alert("Riduzione effettuata con successo")
  }
  function renderParams(){
    switch (drAlgo) {
      case "FASTMAP":
      case "TSNE":
        return <span>Nessun parametro configurabile</span>;
      case "ISOMAP":
        return <label><input name="k" type="range" min={10} max={300} value={neighbors} onChange={changeNeighbours}/> neighbors <i>k</i><p>{neighbors}</p></label>;
      case "LLE":
        return <label><input name="k" type="range" min={10} max={300} value={neighbors} onChange={changeNeighbours}/> neighbors <i>k</i><p>{neighbors}</p></label>;
      default:
        return <span>Nulla configurabile</span>;
    }
  }
  function changeNeighbours(e){
    setTest(false);
    setTest2(false);
    setNeighbors(e.target.value);
  }
  function changeAlgo(e){
    setTest(false);
    setTest2(false);
    setNewDimName(e.target.value)
    setDrAlgo(e.target.value)
  }
  function changeNewDimName(e){
    setTest(false);
    setTest2(false);
    setNewDimName(e.target.value)
  }
  function changeNNewDim(e){
    setTest(false);
    setTest2(false);
    setNNewDim(e.target.value)
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
            <button className="btn btn-primary m-2" onClick={() =>{console.log("Import Configurazione")}}>Import Configurazione</button>
            <button className="btn btn-primary m-2" onClick={() =>{console.log("Export Configurazione")}}>Export Configurazione</button>
          </div>
        </div>
        <hr/>
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
        <div className="w-75 mx-auto d-flex justify-content-between align-items-center">
          <DimensionsListRedux dims={dims} updateDims={handleChangeDims}/>
          <select id="algRedux" value={drAlgo} className="form-select" onChange={changeAlgo}>
            <option value={"FASTMAP"}>FASTMAP</option>
            <option value={"LLE"}>LLE</option>
            <option value={"ISOMAP"}>ISOMAP</option>
            <option value={"TSNE"}>TSNE</option>
          </select>
          <div className="d-flex flex-column">
            <label forhtml="dimName">Nome della/e nuove dimensioni</label>
            <input id="dimName" type="text" onChange={changeNewDimName} value={newDimName}></input>
            <label forhtml="nNewDim">Dimensioni di ritorno</label>
            <input id="nNewDim" type="number" onChange={changeNNewDim} value={nNewDim}></input>
            <br/>
            {
            renderParams()
            }
          </div>
          
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
