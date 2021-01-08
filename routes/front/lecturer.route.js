const express = require('express');
const bcrypt = require('bcryptjs');
const lecturerModel = require('../../models/lecturer.model');
const auth = require('../../middlewares/auth.mdw');

const router = express.Router();

router.get('/log-in', function (req, res) {
    res.render('vwLecturer/log-in', {
        forLecturer: true,
    });
});

router.get('/sign-up', function (req, res) {
    res.render('vwLecturer/sign-up', {
        forLecturer: true,
    });
});

router.post('/log-in', async function (req, res) {
    console.log(req.body);
    const result = await lecturerModel.singleByUsername(req.body.username);
    console.log(result);
    if (result == null) {
        return res.render('vwLecturer/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forLecturer: true,
        });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, result.password);
    console.log(correctPassword);
    if (correctPassword == false) {
        return res.render('vwLecturer/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forLecturer: true,
        });
    }

    req.session.isAuth = true;
    req.session.level = {
        user: false,
        admin: false,
        lecturer: true,
    }

    req.session.profile = {
        username: result.username,
        name: result.name,
        email: result.email,
        picture: result.picture,
    }


    res.redirect('/lecturer');
});

router.get('/profile', auth.lecturer, function (req, res) {
    res.render('vwLecturer/profile', {
        forLecturer: true,
    })
});

router.post('/sign-up', async function (req, res) {
    const result = await lecturerModel.singleByUsername(req.body.username);
    console.log(req.body);
    if (result) {
        return res.render('vwLecturer/sign-up', {
            err_message: 'This account already exists. Please login or enter another account.',
            forLecturer: true,
        });
    }

    const newLecturer = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        email: req.body.email,
        bankid: req.body.bankid,
        bankname: req.body.bankname,
    }

    lecturerModel.add(newLecturer);
    res.redirect('/lecturer');
});

router.post('/profile', auth.lecturer, async function (req, res) {
    console.log(req.body);
    let post_id = req.body.postId;

    // =========== CHANGE PICTURE ============
    if (post_id == null) {
        console.log("CHANGING PICTURE!");
        let filename = req.session.profile.username;
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/data/profile_img/')
            },
            filename: function (req, file, cb) {
                filename = filename.concat(file.originalname);
                cb(null, filename);
            }
        });
        const upload = multer({ storage });
        upload.single('filename')(req, res, function (err) {
            console.log(req.body);
            if (err) {
                return res.render('vwLecturer/profile', {
                    notify: {
                        message: "Something Went Wrong! Please Try Again",
                        err: true,
                    },
                    forUser: true,
                })
            } else {
                filename = profile_img_path.concat(filename);
                console.log("Filename: ");
                console.log(filename);
                userModel.changePicture(filename, req.session.profile.username);
                req.session.profile.picture = filename;
                return res.render('vwLecturer/profile', {
                    notify: {
                        message: "Change Your Picture Successfully!",
                        err: false,
                    },
                    forUser: true,
                })
            }
        });
    }
    // ========================================


    // =========== CHANGE PASSWORD ============ 
    if (post_id === "password") {
        console.log("IAMHERE");
        let result = await lecturerModel.singleByUsername(req.session.profile.username);
        console.log(result);
        const correctPassword = bcrypt.compareSync(req.body.currPass, result.password);
        if (correctPassword == false) {
            return res.render('vwLecturer/profile', {
                notify: {
                    message: "Wrong Password! Please try again!",
                    err: true,
                },
                forUser: true,
            });
        }
        const newPassword = bcrypt.hashSync(req.body.newPass, 10);
        lecturerModel.changePassword(newPassword, req.session.profile.username);
        res.render('vwLecturer/profile', {
            forUser: true,
            notify: {
                message: "Change Password Successfully!",
                err: false,
            },
        });
    }
    // ==========================================
});

router.get("/create", auth.lecturer, function (req, res) {
    res.render("vwLecturer/create", {
        forLecturer: true,
    })
});

module.exports = router;