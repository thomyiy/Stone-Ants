const Stone = require("../models/StoneModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email")
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs');
const path = require("path");
const uuid = require('uuid')
const xlsx = require('node-xlsx');
const request = require("request-promise-native");


const getStoneCertificate = async (req, res) => {
    const stoneId = req.params.stoneId

    if (!fs.existsSync("./uploads/" + stoneId + ".pdf"))
        res.sendStatus(404)
    const options = {
        root: path.join("./uploads")
    };

    const fileName = stoneId + '.pdf';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
}
const getStoneImage = async (req, res) => {
    const stoneId = req.params.stoneId
    if (!fs.existsSync("./uploads/" + stoneId + "-image.jpg"))
        res.sendStatus(404)
    const options = {
        root: path.join("./uploads")
    };

    const fileName = stoneId + '-image.jpg';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
}

const getStoneVideo360 = async (req, res) => {
    const stoneId = req.params.stoneId
    if (!fs.existsSync("./uploads/" + stoneId + "-video360.mp4"))
        res.sendStatus(404)
    const options = {
        root: path.join("./uploads")
    };

    const fileName = stoneId + '-video360.mp4';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
}

const getStonePlotting = async (req, res) => {
    const stoneId = req.params.stoneId
    if (!fs.existsSync("./uploads/" + stoneId + "-plotting.jpg"))
        res.sendStatus(404)
    const options = {
        root: path.join("./uploads")
    };

    const fileName = stoneId + '-plotting.jpg';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
}

const getStoneProportion = async (req, res) => {
    const stoneId = req.params.stoneId
    if (!fs.existsSync("./uploads/" + stoneId + "-proportion.jpg"))
        res.sendStatus(404)
    const options = {
        root: path.join("./uploads")
    };

    const fileName = stoneId + '-proportion.jpg';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
}

const get12BiggestStone = async (req, res) => {
    Stone.find()
        .sort({Size: -1})
        .limit(12)
        .then(stones => {
            console.log(stones)
            res.send(stones)
        });
}


module.exports = {
    getStoneCertificate,
    getStoneImage,
    getStoneVideo360,
    getStonePlotting,
    getStoneProportion,
    get12BiggestStone
}
