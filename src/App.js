import './App.css';
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
    setData(newData);
    setDims(newColumns);
  }

  function syncDimsData(){
    const checkedDims = dims.filter(dim => dim.isChecked).map((d) => d.value);  //array con i nomi delle dimensioni checked
    let aux = data.map(d => {
       return Object.fromEntries(checkedDims.map(dim => [dim, d[dim]]))
     });
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


    let tempdims = [...dims];
    console.log(transData);
    console.log(tempdims)
    tempdims.push({"value": "pca1", "isChecked": true, "isNumeric": true});
    tempdims.push({"value": "pca2", "isChecked": true, "isNumeric": true});
    console.log(tempdims)
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
        <h1>Demo react hooks</h1>
        <MyCSVReader onChange={handleDataLoad}></MyCSVReader>
        <hr/>
        <div className="d-inline-flex">
          <button className="btn btn-primary m-2" onClick={() =>{console.log(data)}}>Log Data</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(dims)}}>Log Dimension</button>
          <button className="btn btn-primary m-2" onClick={() =>{console.log(graphData)}}>Log Used Data</button>
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
          (<ScatterPlotMatrixDiv data={graphData} dims={dims}/>) : (null)
        }
      </header>
    </div>
  );
}

export default App;
