const Stone = require("../models/StoneModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email")
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs');
const path = require("path");
const uuid = require('uuid')
const xlsx = require('node-xlsx');
const request = require("request-promise-native");
var pdf = require("pdf-creator-node");
const generatePost = async (req, res) => {
    var html = fs.readFileSync("./utils/template.html", "utf8");
    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };
    var users = [
        {
            name: "Shyam",
            age: "26",
        },
        {
            name: "Navjot",
            age: "26",
        },
        {
            name: "Vitthal",
            age: "26",
        },
    ];
    var document = {
        html: html,
        data: {
            users: users,
        },
        path: "./output.pdf",
        type: "",
    };
    pdf.create(document, options)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(error);
        });
}

module.exports = {generatePost}
