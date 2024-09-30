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
    if (!files.length && req.files.file)
        if (req.files.file)
            files = [req.files.file]
        else
            return res.redirect("/import");


    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uniqueRandomID = uuid.v4();
        const filePath = uniqueRandomID + path.extname(file.name);
        console.log("file " + file.name)

        file.mv("./uploads/" + filePath).then(async function () {
            console.log("./uploads/" + filePath + " file moved")
            var obj = xlsx.parse("./uploads/" + filePath);
            var d = obj[0].data
            for (let x = 1; x < d.length; x++) {
                var data = d[x]
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
                try {
                    const count = await Stone.countDocuments({StockRef: formdata.StockRef});
                    if (count === 0)
                        await Stone.create(formdata).then(async function () {
                            console.log("Stone " + formdata.StockRef + " created");
                        });
                    if (!fs.existsSync("./uploads/" + formdata.StockRef + ".pdf"))
                        await request.get({
                            uri: "https://assets.3dvirtualdiamond.com/certificate/" + formdata.StockRef,
                            encoding: null
                        }).then(function (pdfBuffer) {
                            console.log("Writing downloaded PDF file to " + formdata.StockRef + ".pdf ...");
                            fs.writeFileSync("./uploads/" + formdata.StockRef + ".pdf", pdfBuffer);
                        });
                    if (!fs.existsSync("./uploads/" + formdata.StockRef + "-video.mp4"))
                        await request.get({
                            uri: "https://assets.3dvirtualdiamond.com/mp4/" + formdata.StockRef,
                            encoding: null
                        }).then(function (pdfBuffer) {
                            console.log("Writing downloaded Video file to " + formdata.StockRef + "-video.mp4...");
                            fs.writeFileSync("./uploads/" + formdata.StockRef + "-video.mp4", pdfBuffer);
                        });
                    if (!fs.existsSync("./uploads/" + formdata.StockRef + "-video360.mp4"))
                        await request.get({
                            uri: "https://assets.3dvirtualdiamond.com/mp4v/" + formdata.StockRef,
                            encoding: null
                        }).then(function (pdfBuffer) {
                            console.log("Writing downloaded Video file to " + formdata.StockRef + "-video360.mp4...");
                            fs.writeFileSync("./uploads/" + formdata.StockRef + "-video360.mp4", pdfBuffer);
                        });
                    if (!fs.existsSync("./uploads/" + formdata.StockRef + "-image.jpg"))
                        await request.get({
                            uri: "https://assets.3dvirtualdiamond.com/image/" + formdata.StockRef,
                            encoding: null
                        }).then(function (pdfBuffer) {
                            console.log("Writing downloaded Image file to " + formdata.StockRef + "-image.jpg...");
                            fs.writeFileSync("./uploads/" + formdata.StockRef + "-image.jpg", pdfBuffer);
                        });
                    if (!fs.existsSync("./uploads/" + formdata.StockRef + "-plotting.jpg"))
                        await request.get({
                            uri: "https://assets.3dvirtualdiamond.com/plotting/" + formdata.StockRef,
                            encoding: null
                        }).then(function (pdfBuffer) {
                            console.log("Writing downloaded Plotting file to " + formdata.StockRef + "-plotting.jpg...");
                            fs.writeFileSync("./uploads/" + formdata.StockRef + "-plotting.jpg", pdfBuffer);
                        });
                    if (!fs.existsSync("./uploads/" + formdata.StockRef + "-proportion.jpg"))
                        await request.get({
                            uri: "https://assets.3dvirtualdiamond.com/WF/" + formdata.StockRef + ".jpg?theme=light.jpg",
                            encoding: null
                        }).then(function (pdfBuffer) {
                            console.log("Writing downloaded Proportion file to " + formdata.StockRef + "-proportion.jpg...");
                            fs.writeFileSync("./uploads/" + formdata.StockRef + "-proportion.jpg", pdfBuffer);
                        });
                } catch (error) {
                    console.log(`Create error--> ${error}`);
                }
            }
            fs.unlinkSync("./uploads/" + filePath);
        });
    }
}

module.exports = {importFromXlsx}
