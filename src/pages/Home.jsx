import React, { useState } from 'react';
import ExcelJs from 'exceljs';
import filedownload from 'js-file-download';
import { MDBContainer, MDBModal, MDBModalBody, MDBInput, MDBFormInline } from 'mdbreact';

function Home() {

    const [reportingData, setReportingData] = useState({
        transmodeCode: "TRM",
        reportCode: "TKLIP",
        fromFundsCode: "REK",
        // toFundsCode: "UE",
        toFundsCode: "REK",
        personalAccountType: "TPE",
        trsToCountry: "ID",
        fromAccSwift: "CENAIDJAXXX",
        fromAccAccount: "0703074003",
        fromAccInstitutionName: "PT. Sinar Digital Terdepan",
        rentityId: 3846,
        rentityBranch: "PT Rpay Finansial Digital Indonesia",
        rowData: undefined,
        rowDataCount:0,
        workSheetName: ""
    })
    const user = {
        nama_lengkap: "Nesya Zahary",
        tanggal_lahir: "1993-01-25T00:00:00",
        nik: "3171076501930001",
        kewarganegaraan: "ID",
        email: "nezsya.rpay@gmail.com",
        pekerjaan: "Staff Legal &#38; Compliance",
        jenis_kelamin: "F",
        title: "Sarjana Hukum",
        residence: "ID"
    }
    // const [user, setUser] = useState({
    //     nama_lengkap: "Nesya Zahary",
    //     tanggal_lahir: "1993-01-25T00:00:00",
    //     nik: "3171076501930001",
    //     kewarganegaraan: "ID",
    //     email: "nezsya.rpay@gmail.com",
    //     pekerjaan: "Staff Legal &#38; Compliance",
    //     jenis_kelamin: "F",
    //     title: "Sarjana Hukum",
    //     residence: "ID"
    // })
    const structureColumn = [
        "Transaction ID",
        "External ID",
        "Transaction Type",
        "Date & Time",
        "Sender Mobile",
        "Sender Name",
        "Sender Grade",
        "Sender Amount",
        "Receiver Mobile",
        "Receiver Name",
        "Receiver Grade",
        "Receiver Amount",
        "Service Charge",
        "Commission",
        "Status",
        "Message",
        "Destination Bank",
        "SWIFT CODE",
        "Destination Bank Account",
        "Destination Person",
        "From Country"
    ]
    const [error, setError] = useState({
        isError: false,
        errorMessage: ""
    })
    const [workSheets, setWorkSheets] = useState({
        sheetName: "",
        sheetData: []
    })
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        excelFile: undefined,
        excelFileName: "choose file"
    });
    const [jsonBlob, setJsonBlob] = useState([]);
    let isProsesError = false

    const arrayCompare = ( array1, array2 ) => {
        for (let index = 0; index < array1.length; index++) {
            if ( array1[index].toLowerCase() !== array2[index + 1].toLowerCase() ) {
                // return setError({
                //     ...error, isError: true, errorMessage: `Invalid column format, make sure the sequence is as same as this structure : ${structureColumn.toString()}`
                // })
                return isProsesError = true
            }
            // setError({
            //     ...error, isError: false, errorMessage: ""
            // })            
        }
    }

    const checkExcel = async () => {
        const workbook = new ExcelJs.Workbook();
        
        if (data.excelFile) {
            const result = await workbook.xlsx.load(data.excelFile)
            console.log(result)
            console.log(result._worksheets) 
            setWorkSheets({
                ...workSheets, sheetData: result._worksheets
            })
            setLoading(false)
        } else {
            setError({
                ...error, isError: true, errorMessage: "Please input excel file first ..."
            })
        }
    }

    const processExcel = async () => {
        const { sheetName } = workSheets
        const { reportCode, rentityId, rentityBranch } = reportingData
        const { nama_lengkap, tanggal_lahir, nik, kewarganegaraan, jenis_kelamin, email, pekerjaan, title, residence } = user
        const workbook = new ExcelJs.Workbook();

        const search = (obj) => {
            if (obj) {
                return obj.name === sheetName
            }
        }
        
        if (sheetName) {
            const result = await workbook.xlsx.load(data.excelFile)
            const indexSheet = result._worksheets.findIndex(search)
            // const indexSheet = result._worksheets.findIndex(x => {
            //     if (x) {
            //         return x.name === sheetName 
            //     }
            //     return setError({
            //         ...error, isError: true, errorMessage: 'no index sheet found'
            //     })
            // });
            // console.log(result)
            // console.log(result._worksheets)
            // setWorkSheets({
            //     ...workSheets, sheetData: result._worksheets
            // })
    
            // let dataToSend = {}
            // let report = []
            let transaction = []
            let dataTosend = {}
            // let sheetName = result._worksheets[2].name
            let totalRow = result._worksheets[indexSheet]._rows.length - 3
            // console.log(result._worksheets[1]._rows.length)
            // reporting person
            dataTosend.report = {}
            dataTosend.report.rentity_id = rentityId
            dataTosend.report.rentity_branch = rentityBranch
            dataTosend.report.submission_code = "E"
            dataTosend.report.report_code = reportCode
            dataTosend.report.entity_reference = `LTKLI-RPAY/${today("ref")}`
            dataTosend.report.fiu_ref_number = ""
            dataTosend.report.submission_date = today()
            dataTosend.report.currency_code_local = "IDR"
            dataTosend.report.reporting_person = {}
            dataTosend.report.reporting_person.gender = jenis_kelamin
            dataTosend.report.reporting_person.title = title
            dataTosend.report.reporting_person.first_name = ""
            dataTosend.report.reporting_person.middle_name = ""
            dataTosend.report.reporting_person.last_name = nama_lengkap
            dataTosend.report.reporting_person.birthdate = tanggal_lahir
            dataTosend.report.reporting_person.mothers_name = ""
            dataTosend.report.reporting_person.ssn = nik
            dataTosend.report.reporting_person.nationality1 = kewarganegaraan
            dataTosend.report.reporting_person.residence = residence
            dataTosend.report.reporting_person.email = email
            dataTosend.report.reporting_person.occupation = pekerjaan
            dataTosend.report.location = {}
            dataTosend.report.location.address_type = "K"
            dataTosend.report.location.address = "Gedung Capitol lt 7, Jl. Prapatan No. 14-16SA"
            dataTosend.report.location.town = "Senen"
            dataTosend.report.location.city = "Jakarta Pusat"
            dataTosend.report.location.zip = "10410"
            dataTosend.report.location.country_code = "ID"
            dataTosend.report.location.state = "DKI Jakarta"
            dataTosend.report.reason = ""
            dataTosend.report.action = ""

            let ws = result.getWorksheet(sheetName)
            // console.log(ws._rows[2].values)
            arrayCompare(structureColumn, ws._rows[2].values)

            if (isProsesError) {
                // console.log(error.isError, 'proses error')
                setError({
                    ...error, isError: true, errorMessage: `Invalid column format, make sure the sequence is as same as this structure : ${structureColumn.join(", ")}`
                });
                onReset();  
            } else {
                ws.eachRow({includeEmpty: true}, function (row, rowNumber) {
                    // console.log(row.values, rowNumber)
                    if (rowNumber > 3) {
                        // console.log(`Row ${rowNumber} = ${row.values}`)
                        // transactionsToXML(row.values)
                        // dataToSend.rentity_id = 3846
                        // dataToSend.rentity_branch = "PT Rpay Finansial Digital Indonesia"
                        // dataToSend.submission_code = "E"
                        // dataToSend.report_code = "TKLIP"
                        // dataToSend.entity_reference = `LTKLI-000${rowNumber}/202102261723`
                        // dataToSend.fiu_ref_number = ""
                        // dataToSend.submission_date = "2021-03-01T09:06:53"
                        // dataToSend.currency_code_local = "IDR"
                        // dataToSend.reporting_person = {}
                        // dataToSend.reporting_person.gender = "F"
                        // dataToSend.reporting_person.title = ""
                        // dataToSend.reporting_person.first_name = ""
                        // dataToSend.reporting_person.middle_name = ""
                        // dataToSend.reporting_person.last_name = "Agnes F Triliana"
                        // dataToSend.reporting_person.mothers_name = ""
                        // dataToSend.location = {}
                        // dataToSend.location.address_type = "K"
                        // dataToSend.location.address = "Gedung Capitol lt 7, Jl. Prapatan No. 14-16SA"
                        // dataToSend.location.town = "Senen"
                        // dataToSend.location.city = "Jakarta Pusat"
                        // dataToSend.location.zip = "10410"
                        // dataToSend.location.country_code = "ID"
                        // dataToSend.reason = ""
                        // dataToSend.action = ""
                        // dataToSend.transaction = {}
                        // dataToSend.transaction.transactionnumber = row.values[1]
                        // dataToSend.transaction.internal_ref_number = row.values[2]
                        // dataToSend.transaction.transaction_location = ""
                        // dataToSend.transaction.transaction_description = row.values[16]
                        // dataToSend.transaction.date_transaction = row.values[4]
                        // dataToSend.transaction.transmode_code = "TRM"
                        // dataToSend.transaction.amount_local = parseFloat(row.values[12]).toFixed(2)
                        // dataToSend.transaction.t_from = {}
                        // dataToSend.transaction.t_from.from_funds_code = "UE"
                        // dataToSend.transaction.t_from.from_account = {}
                        // dataToSend.transaction.t_from.from_account.institution_name = row.values[10]
                        // dataToSend.transaction.t_from.from_account.swift = "CENAIDJAXXX"
                        // dataToSend.transaction.t_from.from_account.non_bank_institution = 1
                        // dataToSend.transaction.t_from.from_account.branch = "-"
                        // dataToSend.transaction.t_from.from_account.account = row.values[9]
                        // dataToSend.transaction.t_from.from_country = "HK"
                        // dataToSend.transaction.t_to = {}
                        // dataToSend.transaction.t_to.to_funds_code = "REK"
                        // dataToSend.transaction.t_to.to_account = {}
                        // // dataToSend.transaction.t_to.to_account.institution_name = parsedataToSend(val.request).bankName
                        // dataToSend.transaction.t_to.to_account.swift = "TES"
                        // dataToSend.transaction.t_to.to_account.non_bank_institution = 0
                        // dataToSend.transaction.t_to.to_account.branch = "-"
                        // dataToSend.transaction.t_to.to_account.account = 12787009898
                        // dataToSend.transaction.t_to.to_account.currency_code = "IDR"
                        // dataToSend.transaction.t_to.to_account.account_name = "Tes username"
                        // dataToSend.transaction.t_to.to_account.iban = ""
                        // dataToSend.transaction.t_to.to_account.client_number = 12345678
                        // dataToSend.transaction.t_to.to_account.personal_account_type = "TPE"
                        // dataToSend.transaction.t_to.to_account.signatory = {}
                        // dataToSend.transaction.t_to.to_account.signatory.t_person = {}
                        // dataToSend.transaction.t_to.to_account.signatory.t_person.last_name = "Tes Last_name"
                        // dataToSend.transaction.t_to.to_country = "ID"
                        // // dataToSend.transactionId = row.values[1]
                        // // dataToSend.externalId = row.values[2]
                        // report.push(dataToSend)
                        // dataToSend = {}
                        transaction.push(transactionsToXML(row.values))
                        setReportingData({
                            ...reportingData, rowDataCount: ++reportingData.rowDataCount
                        })
                        // dataTosend.report.transaction = transaction
                        // dataTosend.report = {}
                        // dataTosend.report.transactions = {}
                        // dataTosend.report.transactions.transaction = transaction
                        // for (let i = 0; i < row.values.length; i++) {
                        //     const element = row.values[i];
                        //     console.log(element)
                        // }
                    }
                    // console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)}`)
                    // row.values.forEach((val, index) => {
                        //     console.log(val)
                        // })
                        // for (let index = 3; index < row.values.length; index++) {
                            //     console.log(row.values[index])
                            //     // const element = array[index];
                            // }
                })
                dataTosend.report.transaction = transaction
                setReportingData({
                    ...reportingData, rowData: totalRow, workSheetName: sheetName
                })
                console.log(error.isError, 'proses berhasil')
                // setJsonBlob(report)
                setJsonBlob(JSON.stringify(dataTosend,undefined, 4))
                // console.log(reportingData)
            }
        } else {
            setError({
                ...error, isError: true, errorMessage: "Please select worksheet excel name first ..."
            })
        }
    }

    const today = ( code = "" ) => {
        // let year = new Date().getFullYear()
        // let month = new Date().getMonth()
        // let day = new Date().getDate()
        // let hours = new Date().getHours()
        // let min = new Date().getMinutes()
        // let sec = new Date().getSeconds()

        if (code === "ref") {
            let todayDate = new Date().toISOString().substr(0, 19)
            return todayDate.replace(/-|T|:/gi, "")
        }
        
        return new Date().toISOString().substr(0, 19)
    }

    const downloadButton = () => {
        // let downnload = JSON.stringify(jsonBlob, undefined, 4)
        const downnload = jsonBlob

        filedownload(downnload, `${today("ref")}-wallet_to_bank-${reportingData.workSheetName}.json`)
        // setData({
        //     ...data, excelFile:undefined, excelFileName:"choose file"
        // })
        // setJsonBlob([])
        // setReportingData({
        //     ...reportingData, rowDataCount: 0, rowData: undefined
        // })
        onReset()
    }

    const onInputExcel = (e) => {
        e.persist()
        const file = e.target.files[0]
        if (file) {
            setData({
                ...data, excelFile: file, excelFileName: file.name
            })
            e.target.value = null
        }
        console.log(e.target.value, "oninputexcel")
    }

    const getSwiftCode = (input) => {
        if (input[17] === 'OVO') return 'NOBUIDJA';
        if (input[17] === 'GoPay') return 'GOJKIDJA';
        return input[18];
    }

    const transactionsToXML = (data) => {
        const { fromFundsCode, toFundsCode, transmodeCode, trsToCountry, fromAccSwift, fromAccAccount, fromAccInstitutionName } = reportingData
        let obj = {}

        obj = {}
        obj.transactionnumber = data[1]
        obj.internal_ref_number = data[2]
        obj.transaction_location = ""
        obj.transaction_description = data[16]
        obj.date_transaction = convertDate(data[4])
        obj.transmode_code = transmodeCode
        obj.amount_local = parseFloat(data[12]).toFixed(2)
        obj.t_from = {}
        obj.t_from.from_funds_code = fromFundsCode
        obj.t_from.from_account = {}
        obj.t_from.from_account.institution_name = data[10]
        obj.t_from.from_account.swift = fromAccSwift
        obj.t_from.from_account.non_bank_institution = 1
        obj.t_from.from_account.branch = "-"
        obj.t_from.from_account.account = fromAccAccount
        obj.t_from.from_account.account_name = fromAccInstitutionName
        obj.t_from.from_country = data[21]
        obj.t_to = {}
        obj.t_to.to_funds_code = toFundsCode
        obj.t_to.to_account = {}
        obj.t_to.to_account.institution_name = data[17]
        // obj.t_to.to_account.swift = data[20]
        // obj.t_to.to_account.swift = data[18]
        obj.t_to.to_account.swift = getSwiftCode(data)
        obj.t_to.to_account.non_bank_institution = (data[17] === "OVO" || data[17] === "GoPay") ? 1 : 0
        obj.t_to.to_account.branch = "-"
        obj.t_to.to_account.account = data[19]
        obj.t_to.to_account.currency_code = "IDR"
        // obj.t_to.to_account.account_name = data[18]
        obj.t_to.to_account.account_name = data[20]
        obj.t_to.to_account.iban = ""
        obj.t_to.to_account.client_number = data[19]
        obj.t_to.to_account.personal_account_type = "TPE"
        obj.t_to.to_account.signatory = {}
        obj.t_to.to_account.signatory.t_person = {}
        // obj.t_to.to_account.signatory.t_person.last_name = data[18]
        obj.t_to.to_account.signatory.t_person.last_name = data[20]
        obj.t_to.to_country = trsToCountry

        return obj
    }

    const convertDate = (input_date = String) => {
        let date = ""
        if (typeof(input_date === "string")) {
            date = input_date.toString().replace(" ", "T")
        }

        return date
    }

    const onClickSheetName = (e) => {
        // console.log(e)
        // setCheckedName(e)
        setWorkSheets({
            ...workSheets, sheetName: e
        })
    }

    const renderWorksheetChoice = () => {
        let choice = workSheets.sheetData
        // console.log(choice)
        if (!loading) {
            return choice.map((val, index) => {
                return (
                    <MDBInput
                        size="sm"
                        key={index}
                        gap
                        onClick={ () => onClickSheetName(val.name) }
                        checked={workSheets.sheetName === val.name ? true : false}
                        label={val.name}
                        type="radio"
                        id="WorksheetName"
                    />
                )
            })
        }
        return (
            setError({
                ...error, isError: true, errorMessage: "No Worksheet Name Found"
            })
        )
    }

    const onReset = () => {
        setJsonBlob([]);
        setWorkSheets({
            ...workSheets, sheetName: "",sheetData: []
        })
        setData({
            ...data, excelFile:undefined, excelFileName:"choose file"
        })
        setReportingData({
            ...reportingData, rowDataCount: 0, rowData: undefined
        })
        // setUser({
        //     ...user,
        //     nama_lengkap: "Nesya Zahary",
        //     tanggal_lahir: "1993-01-25T00:00:00",
        //     nik: "3171076501930001",
        //     kewarganegaraan: "ID",
        //     email: "nezsya.rpay@gmail.com",
        //     pekerjaan: "Staff Legal &#38; Compliance",
        //     jenis_kelamin: "F",
        //     title: "Sarjana Hukum",
        //     residence: "ID"
        // })
        setLoading(true)
    }

    return(
        <div>
            {/* modal error */}
            <MDBContainer>
                <MDBModal isOpen={error.isError} toggle={() => setError({...error, isError: false, errorMessage: "" })} frame position="top">
                    <MDBModalBody className="text-center" style={{color: 'red'}}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <h5>
                                { error.errorMessage }
                            </h5>
                            <div className="button5" style={{ margin:'10px', backgroundColor:"#2bbbad", cursor:'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={() => setError({...error, isError: false, errorMessage: "" })}>Close</div>
                        </div>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer>

            <div className='d-flex justify-content-center align-items-center' style={{height:'90vh'}}>
                <div className='d-flex justify-content-center align-items-center' style={{flexDirection:"column", width:'30%', border:'2px solid #281e5a', borderRadius:'10px', height:'500px'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                        <h3 className="h3 text-center mb-4" style={{lineHeight:0, color:'#281e5a'}}>Please input excel file</h3>
                        <div className="grey-text" style={{marginTop: '10px', marginBottom: '10px'}} >
                            <div className="custom-file">
                                <input
                                    style={{cursor: 'pointer'}}
                                    type="file"
                                    className="custom-file-input"
                                    id="inputExcelFile"
                                    // aria-describedby="inputGroupFileAddon01"
                                    onChange={(e) => onInputExcel(e)}
                                />
                                <label className="custom-file-label" style={{cursor: 'pointer'}} htmlFor="inputExcelFile">
                                    { data.excelFileName }
                                </label>
                            </div>
                        </div>
                    </div>
                    {
                        loading === false ?
                        <div style={{ marginTop: "2rem", width: "100%", padding: "25px 10px" }}>
                            <p>Please Select Worksheets Name below :</p>
                            <MDBFormInline className="mt-2 form-custom" >
                                { renderWorksheetChoice() }
                            </MDBFormInline>
                            {
                                workSheets.sheetName ?
                                <div>
                                    <div className="button5" style={{backgroundColor:"#281e5a", cursor:'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={processExcel}>Process !</div>
                                    <div className="button5" style={{backgroundColor:"#ff3547", cursor:'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={onReset}>Reset</div>
                                </div>

                                :
                                null
                            }
                        </div>
                        :
                        null
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <div className="button5" style={{backgroundColor:"#281e5a", cursor:'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={checkExcel}>Cek excel</div>
                        <div style={{width:'100%', textAlign: 'center', marginBottom: '10px', marginTop: '10px', maxHeight:'300px'}}>
                            {
                                reportingData.rowData === reportingData.rowDataCount ?
                                <button className="btn downloadButton" style={{minWidth: 'max-content', border:'1px solid #281e5a', color: '#281e5a', marginBottom: '10px', marginTop: '10px' }} onClick={downloadButton}>Download</button>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home