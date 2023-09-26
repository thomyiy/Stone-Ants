const fs = require('fs')
const csv = require('csv-parser');
var cron = require('node-cron');

const https = require("https");


const test = () => {

    //downloadCSV();

    /*cron.schedule('* * * * *', () => {
        console.log('running a task every minute');
    })*/

    getFilteredData()

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
