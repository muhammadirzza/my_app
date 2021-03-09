import React, { useState, useRef, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import filedownload from 'js-file-download'
import {useDropzone, on} from 'react-dropzone'
import {BiCloudUpload} from 'react-icons/bi'
import Dropzone from './dropzone/Dropzone'

function App() {
  const [data, setdata]=useState({
    addfile:undefined,
    addfileName:"choose file"
  })

  const [jsonblob, setjsonblob] = useState(undefined)
  const inputFile = useRef()

  const addfileChange = async (e) => {
    let fr = new FileReader()
    var file = e.target.files[0]
    console.log(file)

    // let read = await 
    fr.onload= await function (read) {
        // console.log(read.target.result)
        setdata({
          ...data, addfile:read.target.result
        })
      }
    await fr.readAsText(file)
  }

  const submitFile = (e) => {
    e.preventDefault()
    // console.log(e)
    // console.log(inputRef.current.value)
    console.log(acceptedFiles)
    // formdata.append('file', data.addfile)
    Axios.post(`http://localhost:5000/hash/postgeohash`, data)
    .then((res)=>{
      // console.log(res.data)
      setjsonblob(res.data)
    //   // inputFile.current.value = null
    //   // acceptedFiles.splice(acceptedFiles.indexOf(file), 1)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const downloadbutton = () => {
    console.log(jsonblob)
    var download = JSON.stringify(jsonblob, undefined, 4)
    filedownload(download, 'data.geojson')
    acceptedFiles.length = 0
    acceptedFiles.splice(0, acceptedFiles.length)
    inputRef.current.value = ''
    setjsonblob(undefined)
    setdata({
      ...data, addfile:undefined, addfileName:"choose file"
    })
    // jsonblob.blob().then(blob => {
    //   let url = window.URL.createObjectURL(new Blob(blob) )
    //   let a = document.createElement('a')
    //   a.href = url
    //   a.download = 'data.geojson'
    //   a.click()
    // })
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        setdata({
          ...data, addfile:binaryStr, addfileName:file.name
        })
        // console.log(file.name)
      }
      reader.readAsText(file)
    })
    
  }, [])
  const {getRootProps, getInputProps, inputRef, acceptedFiles} = useDropzone({onDrop})

  return (
    <div className="App">
      
      {/* <header className="App-header"> */}
        {/* <Dropzone /> */}
        
        {/* <input type="file" onChange={addfileChange} ref={inputFile}></input> */}
        <div className="container">
          <h2>
            Geojson to Geohash
          </h2>
          <h3>
            Convert your Geojson to Geohash
          </h3>
          <div {...getRootProps()} style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"20rem", width:"80%", border:"5px dashed salmon", borderRadius:"10px", marginTop:"5rem", outline:"none"}}>
            <input {...getInputProps()} />
            <BiCloudUpload size="5rem"/>
            {
              !data.addfile ?
              <p>Drag 'n' drop some files here, or click to select files</p>
              :
              <p>{data.addfileName}</p>
            }
          </div>
          
          <div style={{marginTop:"2rem"}}>
            <a href="#" className="button5" style={{backgroundColor:"salmon"}} onClick={submitFile}> Submit </a>
            {/* <button onClick={submitFile}>Submit</button> */}
          </div>

          <div style={{marginTop:"20px", height:"65px"}}>
            {
              jsonblob ? 
              <button onClick={downloadbutton} className="btn downloadButton">Download</button>
              :
              null        
            }
          </div>
        </div>
      {/* </header> */}
    </div>
  );
}

export default App;
