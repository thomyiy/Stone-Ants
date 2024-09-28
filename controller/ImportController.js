const Stone = require("../models/StoneModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email")
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs');
const path = require("path");
const uuid = require('uuid')
const xlsx = require('node-xlsx');
const request = require("request-promise-native");

const importFromXlsx = async (req, res) => {
    let files = req.files.file;
    for (let i = 0; i < files.length; i++) {
        console.log('import')
        const file = files[i];
        const uniqueRandomID = uuid.v4();
        const filePath = uniqueRandomID + path.extname(file.name);
        console.log("file "+file.name)

        await file.mv("./uploads/" + filePath, async function (err) {
            if (err)
                return res.status(500).send(err);
            console.log("./uploads/" + filePath + " file moved")
            var obj = xlsx.parse("./uploads/" + filePath);
            var data = obj[0].data
            for (let x = 1; x < data.length; x++) {
                var StockRef = data[x][1]
                var Cert = data[x][2]
                var Shape = data[x][3]
                var Size = data[x][4]
                var DispColor = data[x][5]
                var DispClarity = data[x][6]
                var Cut = data[x][7]
                var Polish = data[x][8]
                var Sym = data[x][9]
                var Flour = data[x][10]
                var RapRate = data[x][12]
                var PPC = data[x][13]
                var Total = data[x][14]
                var formdata = {
                    StockRef: StockRef,
                    Cert: Cert,
                    Shape: Shape,
                    Size: parseFloat(Size),
                    DispColor: DispColor,
                    DispClarity: DispClarity,
                    Cut: Cut,
                    Polish: Polish,
                    Sym: Sym,
                    Flour: Flour,
                    RapRate: parseFloat(RapRate),
                    PPC: parseFloat(PPC),
                    Total: parseFloat(Total),
                }

                /*await Stone.create(formdata, function (err, result) {
                    if (err)
                        console.log(err.message);
                    else {
                        downloadPDF("https://assets.3dvirtualdiamond.com/certificate/" + StockRef, "./uploads/" + StockRef + ".pdf");
                    }

                });*/

            }

            fs.unlinkSync("./uploads/" + filePath);
        });
    }
}

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
    console.log("Writing downloaded PDF file to " + outputFilename + "...");
    fs.writeFileSync(outputFilename, pdfBuffer);
}

module.exports = {importFromXlsx}
