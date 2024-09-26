const Stone = require("../models/StoneModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email")
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs');
const path = require("path");
const uuid = require('uuid')
const xlsx = require('node-xlsx');

// Change password
const importFromXlsx = async (req, res) => {
    let files = req.files.file;
    for (let i = 0; i < files.length; i++) {
        console.log('import')
        const file = files[i];
        const uniqueRandomID = uuid.v4();
        const filePath = uniqueRandomID + path.extname(file.name);

        await file.mv("./uploads/" + filePath, async function (err) {
            if (err)
                return res.status(500).send(err);

            var obj = xlsx.parse("./uploads/" + filePath);
            var data = obj[0].data
            for (i = 1; i < data.length; i++) {
                var StockRef = data[i][1]
                var Cert = data[i][2]
                var Shape = data[i][3]
                var Size = data[i][4]
                var DispColor = data[i][5]
                var DispClarity = data[i][6]
                var Cut = data[i][7]
                var Polish = data[i][8]
                var Sym = data[i][9]
                var Flour = data[i][10]
                var RapRate = data[i][12]
                var PPC = data[i][13]
                var Total = data[i][14]
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

                Stone.create(formdata, function (err, result) {
                    if (err)
                        console.log(err.message);
                });
            }

            fs.unlinkSync("./uploads/" + filePath);
        });
    }
}

module.exports = {importFromXlsx}
