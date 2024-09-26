const fs = require('fs')
const csv = require('csv-parser');
var cron = require('node-cron');

const https = require("https");


const test = () => {

    scraphtml();

    function scraphtml() {
        const fs = require("fs");
        fs.readFile("test/test.html", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            var count = (data.match(/strJSON/g) || []).length;

            var t1 = data.split(("var strJSON1 = '["))[1].split("]'")[0].split(",");
            var t2 = data.split(("var strJSON2 = '["))[1].split("]'")[0].split(",");
            var t3 = data.split(("var strJSON3 = '["))[1].split("]'")[0].split(",");
            var t4 = data.split(("var strJSON4 = '["))[1].split("]'")[0].split(",");
            var t5 = data.split(("var strJSON5 = '["))[1].split("]'")[0].split(",");
            var t6 = data.split(("var strJSON6 = '["))[1].split("]'")[0].split(",");
            var t7 = data.split(("var strJSON7 = '["))[1].split("]'")[0].split(",");
            var t8 = data.split(("var imageList = '"))[1].split("'")[0].split(",");

            console.log("t1 : " + t1.length)
            console.log("t2 : " + t2.length)
            console.log("t3 : " + t3.length)
            console.log("t4 : " + t4.length)
            console.log("t5 : " + t5.length)
            console.log("t6 : " + t6.length)
            console.log("t7 : " + t7.length)
            //console.log("t8 : " + t8.length)
            console.log( t1.length+ t2.length+ t3.length+ t4.length+ t5.length+ t6.length+ t7.length)

            var index = 0;
            t1.forEach((x) => {
                fs.writeFile("test/images/1_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t2.forEach((x) => {
                fs.writeFile("test/images/2_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t3.forEach((x) => {
                fs.writeFile("test/images/3_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t4.forEach((x) => {
                fs.writeFile("test/images/4_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t5.forEach((x) => {
                fs.writeFile("test/images/5_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t6.forEach((x) => {
                fs.writeFile("test/images/6_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t7.forEach((x) => {
                fs.writeFile("test/images/7_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            /*index = 0;
            t8.forEach((x) => {
                fs.writeFile("test/images/8_"+index+".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })*/

            //console.log(data.includes("strJSON"))
        });
    }


    //downloadCSV();

    /*cron.schedule('* * * * *', () => {
        console.log('running a task every minute');
    })*/

    //getFilteredData()

    function getFilteredData(y, callback) {
        const result = [];
        fs.createReadStream('test/newfile.csv')
            .pipe(csv())
            .on('data', (row) => {
                const headers = Object.keys(row);
                if (row["SHAPE"] === "ROUND" && Number(row["DISC"]) < -80) {
                    //console.log(row)
                    var r = {
                        STOCKID: row["STOCKID"],
                        SHAPE: row["SHAPE"],
                        CARAT: row["CARAT"],
                        COLOR: row["COLOR"],
                        CLARITY: row["CLARITY"],
                        CERT: row["CERT"],
                        CERTNO: row["CERTNO"],
                        CUT: row["CUT"],
                        POL: row["POL"],
                        SYM: row["SYM"],
                        FLUOR: row["FLUOR"],
                        MEASUREMENT: row["MEASUREMENT"],
                        PRICE: row["PRICE:"] * 1.2,
                    }
                    //console.log(r)

                    result.push(r)
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                //console.log(result)
                //callback(result)
            });
    }
}

function downloadCSV() {
    https.get(`https://kps.diamonds:8443/estock/apistock?user=CwZI3kqSLIKHnPpbxqJmjw==`, resp => {
        let data = "";
        resp.on("data", chunk => {
            data += chunk;
        });
        resp.on("end", () => {
            let fileUrl = JSON.parse(data).fileUrl;
            console.log(fileUrl);
            https.get(fileUrl, resp => {
                let data = "";
                resp.on("data", chunk => {
                    data += chunk;
                });
                resp.on("end", () => {
                    console.log("file downloaded");
                    fs.writeFile('test/newfile.csv', data, function (err) {
                        if (err) throw err;
                        console.log('File is created successfully.');
                    });
                });
            }).on("error", err => {
                console.log("Error: " + err.message);
            });
        });
    }).on("error", err => {
        console.log("Error: " + err.message);
    });
}

module.exports = test;
