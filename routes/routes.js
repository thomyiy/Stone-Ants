const express = require('express');
const route = express.Router();
const path = require('path');
const fs = require('fs');
const Stone = require("../models/StoneModel");
const StoneRequest = require("../models/StoneRequestModel");

const AuthController = require("../controller/AuthController");
const csv = require("csv-parser");

var nodemailer = require('nodemailer');
const ImportController = require("../controller/ImportController");
const StoneController = require("../controller/StoneController");

module.exports = function (route) {
    route.use((req, res, next) => {
        var uemail = req.session.useremail;
        const allowUrls = ["/login", "/auth-validate", "/register", "/signup", "/forgotpassword", "/sendforgotpasswordlink", "/resetpassword", "/error", "/changepassword"];

        if (allowUrls.indexOf(req.path) !== -1) {
            if (uemail != null && uemail != undefined) {
                return res.redirect('/');
            }

        } else if (!uemail) {
            return res.redirect('/login');
        }
        next();
    })


    route.get('/auth-confirm-mail', (req, res, next) => {
        res.render('auth-confirm-mail', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-email-verification', (req, res, next) => {
        res.render('auth-email-verification', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-lock-screen', (req, res, next) => {
        res.render('auth-lock-screen', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-login', (req, res, next) => {
        res.render('auth-login', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-logout', (req, res, next) => {
        res.render('auth-logout', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-recoverpw', (req, res, next) => {
        res.render('auth-recoverpw', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-register', (req, res, next) => {
        res.render('auth-register', {layout: 'layout/layout-without-nav', role: req.session.role});
    })
    route.get('/auth-two-step-verification', (req, res, next) => {
        res.render('auth-two-step-verification', {layout: 'layout/layout-without-nav', role: req.session.role});
    })


    route.get('/', (req, res, next) => {
        res.render('index', {
            title: 'Dashboard',
            page_title: 'Dashboard',
            folder: 'Dashboards',
            role: req.session.role
        });
    })
    route.get('/index', (req, res, next) => {
        res.render('index', {
            title: 'Dashboard',
            page_title: 'Dashboard',
            folder: 'Dashboards',
            role: req.session.role
        });
    })

    route.get('/layouts-vertical', (req, res, next) => {
        res.render('layouts-vertical', {layout: 'layout/layout-vertical', role: req.session.role});
    })

    // Auth
    route.get('/login', (req, res, next) => {
        res.render('auth/login', {
            title: 'Login',
            layout: 'layout/layout-without-nav',
            'message': req.flash('message'),
            error: req.flash('error'),
            role: req.session.role
        })
    })

    // validate login form
    route.post("/auth-validate", AuthController.validate)

    // logout
    route.get("/logout", AuthController.logout);

    route.get('/register', (req, res, next) => {
        res.render('auth/register', {
            title: 'Register',
            layout: 'layout/layout-without-nav',
            'message': req.flash('message'),
            'error': req.flash('error'),
            role: req.session.role
        })
    })

    // validate register form
    route.post("/signup", AuthController.signup)


    route.get('/forgotpassword', (req, res, next) => {
        res.render('auth/forgotpassword', {
            title: 'Forgot password',
            layout: 'layout/layout-without-nav',
            message: req.flash('message'),
            error: req.flash('error'),
            role: req.session.role
        })
    })

    // send forgot password link on user email
    route.post("/sendforgotpasswordlink", AuthController.forgotpassword)

    // reset password
    route.get("/resetpassword", AuthController.resetpswdview);

    // Change password
    route.post("/changepassword", AuthController.changepassword);


    /*route.get('/medias', (req, res, next) => {
         Media.find({}, function (err, result) {
             res.render('medias', {layout: 'layout/layout-vertical', useremail: req.session.useremail, medias: result});
         });
     })*/
    route.post("/search", (req, res) => {
        console.log(req.body);

        var filters = {}
        if (req.body.shapes.length > 0)
            filters["Shape"] = {$in: req.body.shapes}
        if (req.body.colors.length > 0)
            filters["DispColor"] = {$in: req.body.colors}
        if (req.body.clarities.length > 0)
            filters["DispClarity"] = {$in: req.body.clarities}
        if (req.body.certs.length > 0)
            filters["Cert"] = {$in: req.body.certs}
        if (req.body.fluorescences.length > 0)
            filters["Flour"] = {$in: req.body.fluorescences}
        if (req.body.cut.length > 0)
            filters["Cut"] = {$in: req.body.cut}
        if (req.body.polish.length > 0)
            filters["Polish"] = {$in: req.body.polish}
        if (req.body.symmetry.length > 0)
            filters["Sym"] = {$in: req.body.symmetry}
        if (req.body.carat.from !== "" && req.body.carat.to !== "")
            filters["Size"] = {$gte: parseFloat(req.body.carat.from), $lte: parseFloat(req.body.carat.to)}
        else if (req.body.carat.from !== "")
            filters["Size"] = {$gte: parseFloat(req.body.carat.from)}
        else if (req.body.carat.to !== "")
            filters["Size"] = {$lte: parseFloat(req.body.carat.to)}
        if (req.body.price.from !== "" && req.body.price.to !== "")
            filters["Total"] = {$gte: parseFloat(req.body.price.from), $lte: parseFloat(req.body.price.to)}
        else if (req.body.price.from !== "")
            filters["Total"] = {$gte: parseFloat(req.body.price.from)}
        else if (req.body.price.to !== "")
            filters["Total"] = {$lte: parseFloat(req.body.price.to)}


        console.log(filters)
        Stone.find(filters, function (err, result) {
            res.status(200).send(result);
        });
    });


    //500
    route.get('/error', (req, res, next) => {
        res.render('auth/auth-500', {title: '500 Error', layout: 'layout/layout-without-nav', role: req.session.role});
    })


    route.get('/stones', (req, res, next) => {
        res.render('stones', {
            role: req.session.role
        });
    })

    route.get('/stones/getall', async (req, res, next) => {
        const stones = await Stone.find({})
        res.send(stones)
    });

    route.get('/stones/:stoneId', async (req, res, next) => {
        var stone = await Stone.findById(req.params.stoneId)
        res.render('stone-detail', {
            data: stone,
            role: req.session.role
        });
    })

    route.get('/importer', (req, res, next) => {
        res.render('importer', {
            role: req.session.role
        });
    })

    route.post('/import', ImportController.importFromXlsx);

    route.get('/stone-request', (req, res, next) => {
        res.render('stone-request', {
            role: req.session.role
        });
    })

    route.get('/stone-request/getall', async (req, res, next) => {
        const stoneRequest = await StoneRequest.find({}).populate('user').populate('stones').exec()

        res.send(stoneRequest)
    });

    route.post("/bookstones", (req, res) => {

        console.log(req.body.stones)
        console.log(req.session.userid)

        var formdata = {
            user: req.session.userid,
            stones: req.body.stones,
        }
        StoneRequest.create(formdata, function (err, result) {
            if (err)
                console.log(err);
            console.log(result)
            res.send(JSON.stringify("ok"));

        });
    });

    route.get('/stonecertificate/:stoneId', StoneController.getStoneCertificate)
    route.get('/stoneimage/:stoneId', StoneController.getStoneImage)
    route.get('/stonevideo360/:stoneId', StoneController.getStoneVideo360)
    route.get('/stoneplotting/:stoneId', StoneController.getStonePlotting)
    route.get('/stoneproportion/:stoneId', StoneController.getStoneProportion)
}
