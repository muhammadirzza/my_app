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
        toFundsCodeCompany: "TRVEN",    // for company
        toFundsCodeIndividual: "REK",         // for individual

        personalAccountType: "TPE",
        trsToCountry: "ID",
        fromAccSwift: "CENAIDJAXXX",
        fromAccAccount: "0703074003",
        fromAccInstitutionName: "PT. Sinar Digital Terdepan",
        //rentityId: 3846,
        rentityId: 36624,
        rentityBranch: "PT Rpay Finansial Digital Indonesia",
        rowData: undefined,
        rowDataCount: 0,
        workSheetName: ""
    })
    const user = {
        nama_lengkap: "Ivonne Bonita",
        tanggal_lahir: "1993-03-11T00:00:00",
        nik: "3273035103950007",
        kewarganegaraan: "ID",
        email: "ivonne.bonita@yourpay.co.id",
        pekerjaan: "Staff Risk, Legal &#38; Compliance",
        jenis_kelamin: "F",
        title: "Master Manajemen",
        residence: "ID"
    }

    const structureColumn = [
        "transaction_id",
        "system_date_and_time",
        "sender_msisdn",
        "sender_name",
        "destination_bank",
        "swift_code",
        "destination_bank_account",
        "destination_person",
        "sender_amount",
        "from_country"
    ]

    const [error, setError] = useState({
        isError: false,
        errorMessage: ""
    })

    const [workSheets, setWorkSheets] = useState({
        sheetName: "",
        sheetData: []
    })

    const [loading, setLoading] = useState(false)
    const [loadingExcel, setLoadingExcel] = useState(false)

    const [fundsCode, setFundsCode] = useState("individual")

    const [data, setData] = useState({
        excelFile: undefined,
        excelFileName: "choose file"
    });

    const [jsonBlob, setJsonBlob] = useState([]);
    let isProsesError = false

    const arrayCompare = (array1, array2) => {
        for (let index = 0; index < array1.length; index++) {
            if (array1[index].toLowerCase().trim() !== array2[index + 1].toLowerCase().trim()) {
                return isProsesError = true
            }
        }
    }

    const checkExcel = async () => {
        setLoading(true)
        const workbook = new ExcelJs.Workbook();

        if (data.excelFile) {
            const result = await workbook.xlsx.load(data.excelFile)
            setWorkSheets({
                ...workSheets, sheetData: result._worksheets
            })
            setLoading(false)
        } else {
            setError({
                ...error, isError: true, errorMessage: "Please input excel file first ..."
            })
            setLoading(false)
        }
    }

    const processExcel = async (type) => {
        setLoadingExcel(true)
        setFundsCode(type)
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
            
            let transaction = []
            let dataTosend = {}
            
            let totalRow = result._worksheets[indexSheet]._rows.length - 3
            
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
                ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                    if (rowNumber > 3) {
                        console.log(`Row ${rowNumber} = ${row.values}`)
                        transaction.push(transactionsToXML(row.values, rowNumber, type))
                        setReportingData({
                            ...reportingData, rowDataCount: ++reportingData.rowDataCount
                        })
                    }
                })
                dataTosend.report.transaction = transaction
                setReportingData({
                    ...reportingData, rowData: totalRow, workSheetName: sheetName
                })
                console.log(error.isError, 'proses berhasil')
                setLoadingExcel(false)

                setJsonBlob(JSON.stringify(dataTosend, undefined, 4))
            }
        } else {
            setError({
                ...error, isError: true, errorMessage: "Please select worksheet excel name first ..."
            })
        }
    }

    const today = (code = "") => {
        if (code === "ref") {
            let todayDate = new Date().toISOString().substr(0, 19)
            return todayDate.replace(/-|T|:/gi, "")
        }

        return new Date().toISOString().substr(0, 19)
    }

    const downloadButton = () => {
        const downnload = jsonBlob
        filedownload(downnload, `${today("ref")}-wallet_to_bank-${reportingData.workSheetName}.json`)
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
        if (input[5] === 'OVO') return 'NOBUIDJA';
        if (input[5] === 'GoPay') return 'GOJKIDJA';
        return input[6];
    }

    const transactionsToXML = (data, rowNumber, type) => {
        const { fromFundsCode, toFundsCodeCompany, toFundsCodeIndividual, transmodeCode, trsToCountry, fromAccSwift, fromAccAccount, fromAccInstitutionName } = reportingData
        let obj = {}

        obj = {}
        obj.transactionnumber = `${rowNumber - 3}`
        obj.internal_ref_number = data[1]
        obj.transaction_location = ""
        obj.transaction_description = ""
        obj.date_transaction = convertDate(data[2])
        obj.transmode_code = transmodeCode
        obj.amount_local = parseFloat(data[9]).toFixed(2)
        obj.t_from = {}
        obj.t_from.from_funds_code = fromFundsCode
        obj.t_from.from_account = {}
        obj.t_from.from_account.institution_name = data[11]
        obj.t_from.from_account.swift = fromAccSwift
        obj.t_from.from_account.non_bank_institution = 0 //1
        obj.t_from.from_account.branch = "-"
        obj.t_from.from_account.account = fromAccAccount
        obj.t_from.from_account.account_name = fromAccInstitutionName
        obj.t_from.from_account.signatory = {}
        obj.t_from.from_account.signatory.t_person = {}
        obj.t_from.from_account.signatory.t_person.last_name = "SINAR DIGITAL TERDEPAN"
        obj.t_from.from_country = data[10]

        obj.t_to = {}
        obj.t_to.to_funds_code = type === "individual" ? toFundsCodeIndividual : toFundsCodeCompany

        if (type === "individual") {
            console.log("individual");
            obj.t_to.to_account = {}
            obj.t_to.to_account.institution_name = data[5]  //bank name
            obj.t_to.to_account.swift = getSwiftCode(data)
            obj.t_to.to_account.non_bank_institution = (data[5] === "OVO" || data[5] === "GoPay") ? 1 : 0
            obj.t_to.to_account.branch = "-"
            obj.t_to.to_account.account = data[7]
            obj.t_to.to_account.currency_code = "IDR"
            obj.t_to.to_account.account_name = data[8]
            obj.t_to.to_account.iban = ""
            obj.t_to.to_account.client_number = data[7]
            obj.t_to.to_account.personal_account_type = "TPE"
            obj.t_to.to_account.signatory = {}
            obj.t_to.to_account.signatory.t_person = {}
            obj.t_to.to_account.signatory.t_person.last_name = data[8]   
        } else {
            console.log("company");
            obj.t_to.to_entity = {}
            obj.t_to.to_entity.name = data[8]
            obj.t_to.to_entity.commercial_name = data[8]
            obj.t_to.to_entity.swift = getSwiftCode(data)
        }

        obj.t_to.to_country = trsToCountry

        return obj
    }

    const convertDate = (input_date = String) => {
        let date = ""
        if (typeof (input_date === "string")) {
            date = input_date.toString().replace(" ", "T")
        }

        return date
    }

    const replaceStrAnd = (str) => {
        if (!str) return "";
        const strFinal = str.replace("&", "&#38;");
        return strFinal;
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
        if (!loading) {
            return choice.map((val, index) => {
                return (
                    <MDBInput
                        size="sm"
                        key={index}
                        gap
                        onClick={() => onClickSheetName(val.name)}
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
            ...workSheets, sheetName: "", sheetData: []
        })
        
        setData({
            ...data, excelFile: undefined, excelFileName: "choose file"
        })
        
        setReportingData({
            ...reportingData, rowDataCount: 0, rowData: undefined
        })
        
        setLoading(false)
    }

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}>
                <div className="spinner-border" role="status" />
            </div>
        )
    }
    return (
        <div>
            {/* modal error */}
            <MDBContainer>
                <MDBModal isOpen={error.isError} toggle={() => setError({ ...error, isError: false, errorMessage: "" })} frame position="top">
                    <MDBModalBody className="text-center" style={{ color: 'red' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <h5>
                                {error.errorMessage}
                            </h5>
                            <div className="button5" style={{ margin: '10px', backgroundColor: "#2bbbad", cursor: 'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={() => setError({ ...error, isError: false, errorMessage: "" })}>Close</div>
                        </div>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer>

            <div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}>
                <div className='d-flex justify-content-center align-items-center' style={{ flexDirection: "column", width: '30%', border: '2px solid #281e5a', borderRadius: '10px', height: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <h3 className="h3 text-center mb-4" style={{ lineHeight: 0, color: '#281e5a' }}>Please input excel file</h3>
                        <div className="grey-text" style={{ marginTop: '10px', marginBottom: '10px' }} >
                            <div className="custom-file">
                                <input
                                    style={{ cursor: 'pointer' }}
                                    type="file"
                                    className="custom-file-input"
                                    id="inputExcelFile"
                                    onChange={(e) => onInputExcel(e)}
                                />
                                <label className="custom-file-label" style={{ cursor: 'pointer' }} htmlFor="inputExcelFile">
                                    {data.excelFileName}
                                </label>
                            </div>
                        </div>
                    </div>
                    {
                        workSheets.sheetData.length > 0 ?
                            <div style={{ marginTop: "2rem", width: "100%", padding: "25px 10px" }}>
                                <p>Please Select Worksheets Name below :</p>
                                <MDBFormInline className="mt-2 form-custom" >
                                    {renderWorksheetChoice()}
                                </MDBFormInline>
                                {
                                    workSheets.sheetName ?
                                        <div>
                                            <div className="button5" style={{ backgroundColor: "#281e5a", cursor: 'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={() => processExcel("individual")}>Process Individual</div>
                                            <div className="button5" style={{ backgroundColor: "#281e5a", cursor: 'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={() => processExcel("company")}>Process Company</div>
                                            <div className="button5" style={{ backgroundColor: "#ff3547", cursor: 'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={onReset}>Reset</div>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            :
                            null
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <div className="button5" style={{ backgroundColor: "#281e5a", cursor: 'pointer', borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }} onClick={checkExcel}>Cek excel</div>
                        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px', marginTop: '10px', maxHeight: '300px' }}>
                            {
                                reportingData.rowData === reportingData.rowDataCount ?
                                    <button className="btn downloadButton" style={{ minWidth: 'max-content', border: '1px solid #281e5a', color: '#281e5a', marginBottom: '10px', marginTop: '10px' }} onClick={downloadButton}>Download</button>
                                    :
                                    loadingExcel ? <div className="spinner-border" role="status" /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home