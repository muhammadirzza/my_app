import React, { useState, useCallback } from 'react';
import Axios from 'axios';
import filedownload from 'js-file-download';
import { useDropzone } from 'react-dropzone';
import { BiCloudUpload } from 'react-icons/bi';

function JsontoHash() {

    const [data, setData] = useState({
        addFile:undefined,
        addFileName:"Choose File"
    })
    const [jsonBlob, setJsonBlob] = useState(undefined)
    
    const submitFile = () => {
        // console.log(e)
        // e.preventDefault()
        if (data.addFile) {
            Axios.post("http://localhost:5000/hash/postgeohash", data)
            .then((res) => {
                setJsonBlob(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            alert("please input data")
        }
    }

    const resetFile = () => {
        setData({
            ...data, addFile:undefined, addFileName:"choose file"
        })
    }

    const downloadButton = () => {
        let downnload = JSON.stringify(jsonBlob, undefined, 4)

        filedownload(downnload, `${data.addFileName}.geojson`)
        acceptedFiles.length = 0
        acceptedFiles.splice(0, acceptedFiles.length)
        inputRef.current.value = ''
        setJsonBlob(undefined)
        resetFile()
        // setData({
        //     ...data, addFile:undefined, addFileName:"choose file"
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
            setData({
                ...data, addFile:binaryStr, addFileName:file.name
                })
                // console.log(file.name)
                }
                reader.readAsText(file)
        })
    }, [data])

    const {getRootProps, getInputProps, inputRef, acceptedFiles} = useDropzone({onDrop}) 

    return(
        <div className="container">
            <div style={{height:"110px", display:"flex", flexDirection:"column", justifyContent:"space-evenly", alignItems:"center"}}>
                <h2>
                    Geojson to Geohash
                </h2>
                <h3>
                    Convert your Geojson to Geohash
                </h3>
            </div>
            <div {...getRootProps()} style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"20rem", width:"80%", border:"5px dashed #2bbbad", borderRadius:"10px", outline:"none", marginTop:"5px"}}>
                <input {...getInputProps()} />
                <BiCloudUpload size="5rem"/>
                {
                    !data.addFile ?
                    <p>Drag 'n' drop some files here, or click to select files</p>
                    :
                    <p>{data.addFileName}</p>
                }
            </div>
          
            <div style={{marginTop:"2rem"}}>
                <div className="button5" style={{backgroundColor:"#2bbbad"}} onClick={submitFile}> Submit </div>
                {
                    data.addFile ?
                    <div className="button5" style={{backgroundColor:"salmon"}} onClick={resetFile}> Reset </div>
                    :
                    null
                }
            </div>

            <div style={{marginTop:"20px", height:"65px"}}>
                {
                    jsonBlob ? 
                    <button onClick={downloadButton} className="btn downloadButton">Download</button>
                    :
                    null      
                }
            </div>
        </div>
    )
}

export default JsontoHash