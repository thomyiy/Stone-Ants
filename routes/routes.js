const express = require('express');
const route = express.Router();
const path = require('path');
const fs = require('fs');

const AuthController = require("../controller/AuthController");
const {Console} = require('console');
const csv = require("csv-parser");

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
        res.render('auth-confirm-mail', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-email-verification', (req, res, next) => {
        res.render('auth-email-verification', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-lock-screen', (req, res, next) => {
        res.render('auth-lock-screen', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-login', (req, res, next) => {
        res.render('auth-login', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-logout', (req, res, next) => {
        res.render('auth-logout', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-recoverpw', (req, res, next) => {
        res.render('auth-recoverpw', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-register', (req, res, next) => {
        res.render('auth-register', {layout: 'layout/layout-without-nav'});
    })
    route.get('/auth-two-step-verification', (req, res, next) => {
        res.render('auth-two-step-verification', {layout: 'layout/layout-without-nav'});
    })


    route.get('/', (req, res, next) => {
        res.render('index', {title: 'Dashboard', page_title: 'Dashboard', folder: 'Dashboards'});
    })
    route.get('/index', (req, res, next) => {
        res.render('index', {title: 'Dashboard', page_title: 'Dashboard', folder: 'Dashboards'});
    })

    route.get('/layouts-vertical', (req, res, next) => {
        res.render('layouts-vertical', {layout: 'layout/layout-vertical'});
    })

    // Auth
    route.get('/login', (req, res, next) => {
        res.render('auth/login', {
            title: 'Login',
            layout: 'layout/layout-without-nav',
            'message': req.flash('message'),
            error: req.flash('error')
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
            'error': req.flash('error')
        })
    })

    // validate register form
    route.post("/signup", AuthController.signup)


    route.get('/forgotpassword', (req, res, next) => {
        res.render('auth/forgotpassword', {
            title: 'Forgot password',
            layout: 'layout/layout-without-nav',
            message: req.flash('message'),
            error: req.flash('error')
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

        function callback(result) {
            //console.log(result)
            res.status(200).send(JSON.stringify(result));
        }

        getFilteredData(callback, req.body);
    });


    //500
    route.get('/error', (req, res, next) => {
        res.render('auth/auth-500', {title: '500 Error', layout: 'layout/layout-without-nav'});
    })

    route.get('/stones', (req, res, next) => {
        function callback(result) {
            res.render('stones', {
                title: 'Stones',
                page_title: 'Stones',
                folder: 'Stones',
                data: JSON.stringify(result)
            });
        }

        getFilteredData(callback);
    })

    function getFilteredData(callback, search) {
        const result = [];
        fs.createReadStream('test/newfile.csv')
            .pipe(csv())
            .on('data', (row) => {
                const headers = Object.keys(row);
                if (search) {
                    if (search.shapes.length && !search.shapes.includes(row["SHAPE"])) {
                        return;
                    }
                    if (search.colors.length && !search.colors.includes(row["COLOR"])) {
                        return;
                    }
                    if (search.clarities.length && !search.clarities.includes(row["CLARITY"])) {
                        return;
                    }
                    if (search.certs.length && !search.certs.includes(row["CERT"])) {
                        return;
                    }
                    if (search.fluorescences.length && !search.fluorescences.includes(row["FLUOR"])) {
                        return;
                    }
                    if (search.cut.length && !search.cut.includes(row["CUT"])) {
                        return;
                    }
                    if (search.polish.length && !search.polish.includes(row["POL"])) {
                        return;
                    }
                    if (search.symmetry.length && !search.symmetry.includes(row["SYM"])) {
                        return;
                    }
                    if (search.carat.from.length && search.carat.from > Number(row["CARAT"])) {
                        return;
                    }
                    if (search.carat.to.length && search.carat.to < Number(row["CARAT"])) {
                        return;
                    }
                    if (search.price.from.length && search.price.from > Number(row["VALUE"] * 1.2)) {
                        return;
                    }
                    if (search.price.to.length && search.price.to < Number(row["VALUE"] * 1.2)) {
                        return;
                    }
                }
                // if (row["SHAPE"] === "ROUND" && Number(row["DISC"]) < -80) {
                //console.log(row)
                /*var r = {
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
                }*/

                var r = [];
                r.push(row["STOCKID"]);
                r.push(row["SHAPE"]);
                r.push(row["CARAT"]);
                r.push(row["COLOR"]);
                r.push(row["CLARITY"]);
                r.push(row["CERT"]);
                r.push(row["CERTNO"]);//row["CERTNO"]);
                r.push(row["CUT"]);
                r.push(row["POL"]);
                r.push(row["SYM"]);
                r.push(row["FLUOR"]);
                r.push(Math.round(row["PRICE"] * 1.2));
                r.push(Math.round(row["VALUE"] * 1.2));

                result.push(r)
                //}
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                //console.log(result)
                callback(result);
            });
    }
}
