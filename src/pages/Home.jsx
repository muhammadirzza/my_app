import React, { useState } from 'react';
import ExcelJs from 'exceljs';
import filedownload from 'js-file-download';

function Home() {

    const [reportingData, setReportingData] = useState({
        transmodeCode: "TRM",
        reportCode: "TKLIP",
        fromFundsCode: "REK",
        toFundsCode: "REK",
        personalAccountType: "TPE",
        trsToCountry: "ID",
        fromAccSwift: "CENAIDJAXXX",
        rentityId: 3846,
        rentityBranch: "PT Rpay Finansial Digital Indonesia"
    })

    // const [transmodeCode, setTransmodeCode] = useState("TRM")
    // const [reportCode, setReportCode] = useState("TKLIP")
    // const [fromFundsCode, setFromFundsCode] = useState("REK")
    // const [toFundsCode, setToFundsCode] = useState("REK")

    const [data, setData] = useState({
        excelFile: undefined,
        excelFileName: ""
    });

    const [jsonBlob, setJsonBlob] = useState([]);

    const checkExcel = async () => {
        const { reportCode, rentityId, rentityBranch } = reportingData
        const workbook = new ExcelJs.Workbook();
        const result = await workbook.xlsx.load(data.excelFile)

        // let dataToSend = {}
        // let report = []
        let transaction = []
        let dataTosend = {}
        let sheetName = result._worksheets[1].name
        // console.log(sheetName)

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
        dataTosend.report.reporting_person.gender = "F"
        dataTosend.report.reporting_person.title = ""
        dataTosend.report.reporting_person.first_name = ""
        dataTosend.report.reporting_person.middle_name = ""
        dataTosend.report.reporting_person.last_name = "Agnes F Triliana"
        dataTosend.report.reporting_person.mothers_name = ""
        dataTosend.report.location = {}
        dataTosend.report.location.address_type = "K"
        dataTosend.report.location.address = "Gedung Capitol lt 7, Jl. Prapatan No. 14-16SA"
        dataTosend.report.location.town = "Senen"
        dataTosend.report.location.city = "Jakarta Pusat"
        dataTosend.report.location.zip = "10410"
        dataTosend.report.location.country_code = "ID"
        dataTosend.report.reason = ""
        dataTosend.report.action = ""

        let ws = result.getWorksheet(sheetName)
        ws.eachRow({includeEmpty: true}, function (row, rowNumber) {
            console.log(row.values)
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
                dataTosend.report.transaction = transaction
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
        // setJsonBlob(report)
        setJsonBlob(JSON.stringify(dataTosend,undefined, 4))
    }

    const downloadButton = () => {
        // let downnload = JSON.stringify(jsonBlob, undefined, 4)
        let downnload = jsonBlob

        filedownload(downnload, `${today("ref")}-my-json-file.json`)
        setData({
            ...data, excelFile:undefined, excelFileName:"choose file"
        })
        setJsonBlob([])
    }

    const onInputExcel = (e) => {
        e.persist()
        const file = e.target.files[0]
        if (file) {
            setData({
                ...data, excelFile: file, excelFileName: file.name
            })
        }
        console.log(e.target.files[0], "oninputexcel")
    }

    const transactionsToXML = (data) => {
        const { fromFundsCode, toFundsCode, transmodeCode, trsToCountry, fromAccSwift } = reportingData
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
        obj.t_from.from_account.account = data[9]
        obj.t_from.from_country = data[21]
        obj.t_to = {}
        obj.t_to.to_funds_code = toFundsCode
        obj.t_to.to_account = {}
        obj.t_to.to_account.institution_name = data[17]
        obj.t_to.to_account.swift = data[20]
        obj.t_to.to_account.non_bank_institution = 0
        obj.t_to.to_account.branch = "-"
        obj.t_to.to_account.account = data[19]
        obj.t_to.to_account.currency_code = "IDR"
        obj.t_to.to_account.account_name = data[18]
        obj.t_to.to_account.iban = ""
        obj.t_to.to_account.client_number = data[19]
        obj.t_to.to_account.personal_account_type = "TPE"
        obj.t_to.to_account.signatory = {}
        obj.t_to.to_account.signatory.t_person = {}
        obj.t_to.to_account.signatory.t_person.last_name = data[18]
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

    return(
        <div>
            <input type="file" onChange={(e) => onInputExcel(e)}/>
            <button onClick={checkExcel}>Cek excel</button>
            {
                jsonBlob.length ?
                <button onClick={downloadButton}>Download</button>
                :
                null
            }
            Ini Home
        </div>
    )
}

export default Home