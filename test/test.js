const fs = require('fs')
const csv = require('csv-parser');
var cron = require('node-cron');
var request = require("request");

const https = require("https");
var HTMLParser = require('node-html-parser');
const Stone = require("../models/StoneModel");

const testApi = async () => {
    console.log("test Api")
    var __RequestVerificationToken = ""

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://stock.ddpl.com',
        'Referer': 'https://stock.ddpl.com/',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    };

    var options = {
        url: 'https://stock.ddpl.com/',
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var setcookie = response.headers["set-cookie"];
            if (setcookie) {
                setcookie.forEach(
                    function (cookiestr) {
                        if (cookiestr.startsWith("__RequestVerificationToken=")) {
                            __RequestVerificationToken = cookiestr.split(";")[0].split("=")[1]
                        }
                    }
                );
            }
        }
    }

    await request(options, callback);

    function doRequest(sizerange) {
        return new Promise(function (resolve, reject) {
            var headers = {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'fr-FR,fr;q=0.9',
                'content-type': 'application/json;charset=UTF-8',
                'cookie': 'ASP.NET_SessionId=135yebgugbjhq3jdv3jcsuav;' +
                    ' __RequestVerificationToken=' + __RequestVerificationToken + ';',

                'origin': 'https://stock.ddpl.com',
                'priority': 'u=1, i',
                'referer': 'https://stock.ddpl.com/searchstock',
                'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
            };

            //var dataString = '{"Shape":"","SizeStart":0,"SizeEnd":50,"SizeArr":"","ColorType":"WC","Color":"","Intensity":"","Overtone":"","Clarity":"","Cut":"","Polish":"","Sym":"","Flour":"","Cert":"","HnA":"","BGM":"","EyeClean":"","Location":"","IsDTL":false,"IsDOR":false,"StockRef":"","ReportNo":"","PriceStart":0,"PriceEnd":10000000,"DiscStart":-199,"DiscEnd":100,"M1Start":0,"M1End":100,"M2Start":0,"M2End":100,"M3Start":0,"M3End":100,"TableStart":0,"TableEnd":100,"DepthStart":0,"DepthEnd":100,"RatioStart":0,"RatioEnd":100,"CrHeightStart":0,"CrHeightEnd":100,"PavDepthStart":0,"PavDepthEnd":100,"GirdleStart":0,"GirdleEnd":100,"CrAngleStart":0,"CrAngleEnd":100,"PavAngleStart":0,"PavAngleEnd":100,"BlackInSideArry":"","TableIncArry":"","BlackInTableArry":"","KeySymblArr":"","OpenInArr":"","OpenCrownArr":"","OpenGirdleArr":"","OpenPavilionArr":"","CuletSizeArr":"","Bid4new":false,"Orderby":"Shape,size,DispColor,DispClarity|d","TabResult":"all","Page":' + currentPage + ',"Count":500,"ResType":2,"isPair":false,"isMyBid":false,"InShow":0,"searchRemark":"","Token":"daa79339cea3be07424f0e6990bf29a0","AdvToken":"a7da5c162add23086af4bda1bbfef90c"}';

            var dataString = '{"Shape":"","SizeStart":0,"SizeEnd":50,"SizeArr":"' + sizerange + '","ColorType":"WC","Color":"","Intensity":"","Overtone":"","Clarity":"","Cut":"","Polish":"","Sym":"","Flour":"","Cert":"","HnA":"","BGM":"","EyeClean":"","Location":"","IsDTL":false,"IsDOR":false,"StockRef":"","ReportNo":"","PriceStart":0,"PriceEnd":10000000,"DiscStart":-199,"DiscEnd":100,"M1Start":0,"M1End":100,"M2Start":0,"M2End":100,"M3Start":0,"M3End":100,"TableStart":0,"TableEnd":100,"DepthStart":0,"DepthEnd":100,"RatioStart":0,"RatioEnd":100,"CrHeightStart":0,"CrHeightEnd":100,"PavDepthStart":0,"PavDepthEnd":100,"GirdleStart":0,"GirdleEnd":100,"CrAngleStart":0,"CrAngleEnd":100,"PavAngleStart":0,"PavAngleEnd":100,"BlackInSideArry":"","TableIncArry":"","BlackInTableArry":"","KeySymblArr":"","OpenInArr":"","OpenCrownArr":"","OpenGirdleArr":"","OpenPavilionArr":"","CuletSizeArr":"","Bid4new":false,"Orderby":"Shape,size,DispColor,DispClarity|d","TabResult":"all","Page":1,"Count":500,"ResType":2,"isPair":false,"isMyBid":false,"InShow":0,"searchRemark":"","Token":"daa79339cea3be07424f0e6990bf29a0","AdvToken":"a7da5c162add23086af4bda1bbfef90c"}';
            console.log(sizerange)

            options = {
                url: 'https://stock.ddpl.com/api/SearchStockApi/getSearchDiamondsOffer',
                method: 'POST',
                headers: headers,
                body: dataString
            };

            request(options, function (error, res, body) {
                if (!error && res.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }


    var sizerange= ["0.18-0.29","0.29-0.299","0.30-0.30","0.31-0.32","0.32-0.33","0.33-0.34","0.33-0.34","0.40-0.49","0.50-0.59","0.60-0.69","0.70-0.79",]
    for (i=0; i < sizerange.length; i ++) {
        await doRequest(sizerange[i]).then(async function (body) {
            var data = JSON.parse(body)
            console.log(data.DataList.length)
            for (const element of data.DataList) {
                var formdata = {
                    StockRef: element.StockRef,
                    Cert: element.Cert,
                    Shape: element.Shape,
                    Size: element.Size,
                    DispColor: element.DispColor,
                    DispClarity: element.DispClarity,
                    Cut: element.Cut,
                    Polish: element.Polish,
                    Sym: element.Sym,
                    Flour: element.Flour,
                    RapRate: element.RapRate,
                    PPC: element.PPC,
                    Total: element.Size * element.PPC
                }
                await Stone.update({StockRef: formdata.StockRef}, formdata, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }).then(function (updatedUser, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("Stone " + formdata.StockRef + " created or updated");
                    }
                })
            }
            console.log("import finish")


        });
    }


    /*var options = { method: 'POST',
        url: 'https://stock.ddpl.com/dharamwebapi/api/StockDispApi/getDiamondData',
        headers: { 'content-type': 'application/json' },
        body: '{\n \n uniqID : \'27531\',\n company : \'STONE ANTS\',\n actCode:\'Sto@Ley#456@!\',\n selectAll : \'All\',\n StartIndex : \'1\',\n Count : \'20\',\n columns: \'\',\n finder : \'\',\n sort : \'\'\n}' };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });*/


    /*request.post({
       uri: "http://www.dharamhk.com/dharamwebapi/api/StockDispApi/getDiamondData",
        headers: { 'content-type': 'application/json' },
        body:'{\n \n uniqID : \'27531\',\n company : \'STONE ANTS\',\n actCode:\'Sto@Ley#456@!\',\n selectAll : \'All\',\n StartIndex : \'1\',\n count : \'20\',\n columns: \'\',\n finder : \'\',\n sort : \'\'\n}'
   }).then(function (data) {
       console.log("lalal")
   }).catch(function (err) {
        console.log("err")
       console.log(err)
    });*/
}
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
            console.log(t1.length + t2.length + t3.length + t4.length + t5.length + t6.length + t7.length)

            var index = 0;
            t1.forEach((x) => {
                fs.writeFile("test/images/1_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t2.forEach((x) => {
                fs.writeFile("test/images/2_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t3.forEach((x) => {
                fs.writeFile("test/images/3_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t4.forEach((x) => {
                fs.writeFile("test/images/4_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t5.forEach((x) => {
                fs.writeFile("test/images/5_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t6.forEach((x) => {
                fs.writeFile("test/images/6_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
                    if (err)
                        console.log(err);
                });
                index++;
            })
            index = 0;
            t7.forEach((x) => {
                fs.writeFile("test/images/7_" + index + ".png", x.replace('"', ""), 'base64', function (err) {
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

module.exports = testApi;
