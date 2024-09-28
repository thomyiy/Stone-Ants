const Stone = require("../models/StoneModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email")
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs');
const path = require("path");
const uuid = require('uuid')
const xlsx = require('node-xlsx');
const request = require("request-promise-native");

const importFromXlsx = (req, res) => {
    let files = req.files.file;
    console.log(req.files)
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uniqueRandomID = uuid.v4();
        const filePath = uniqueRandomID + path.extname(file.name);
        console.log("file " + file.name)
        movefile(file, filePath)

    }
}

function movefile(file, filePath) {
    file.mv("./uploads/" + filePath, function (err) {
        if (err)
            console.log(err)
        console.log("./uploads/" + filePath + " file moved")
        parsefile(filePath)
    });
}

function parsefile(filePath) {
    var obj = xlsx.parse("./uploads/" + filePath);
    var d = obj[0].data
    for (let x = 1; x < d.length; x++) {
        var data = d[x]
        createStone(data)
        var miliseconds = 1000;
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
    }
    fs.unlinkSync("./uploads/" + filePath);
}

function createStone(data) {
    var formdata = {
        StockRef: data[1],
        Cert: data[2],
        Shape: data[3],
        Size: parseFloat(data[4]),
        DispColor: data[5],
        DispClarity: data[6],
        Cut: data[7],
        Polish: data[8],
        Sym: data[9],
        Flour: data[10],
        RapRate: parseFloat(data[12]),
        PPC: parseFloat(data[13]),
        Total: parseFloat(data[14]),
    }
    console.log("create stone " + formdata.StockRef)

    Stone.create(formdata, function (err, result) {
        if (err)
            console.log(err.message);
        else {
            downloadPDF("https://assets.3dvirtualdiamond.com/certificate/" + formdata.StockRef, "./uploads/" + formdata.StockRef + ".pdf");
        }
    });
}

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
    console.log("Writing downloaded PDF file to " + outputFilename + "...");
    await fs.writeFileSync(outputFilename, pdfBuffer);
}

module.exports = {importFromXlsx}
