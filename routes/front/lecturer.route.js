const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const lecturerModel = require('../../models/lecturer.model');
const categoryModel = require('../../models/category.model');
const rateModel = require('../../models/rate.model');
const auth = require('../../middlewares/auth.mdw');
const func = require('../../middlewares/function.mdw');
const courseModel = require('../../models/course.model');
const lessonModel = require('../../models/lesson.model');
const { lecturer } = require('../../middlewares/auth.mdw');
const router = express.Router();
const config = require('../../config/default.json');

const course_bigthum_path = './public/courses/big_thumbnail/';
const course_smallthum_path = './public/courses/small_thumbnail/';
const profile_img_path = 'data/lecturer_img/';

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
            notify: {
                message: 'There was a problem logging in. Check your email and password or create an account.',
                err: true,
            },
            forLecturer: true,
        });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, result.password);
    console.log(correctPassword);
    if (correctPassword == false) {
        return res.render('vwLecturer/log-in', {
            notify: {
                message: 'There was a problem logging in. Check your email and password or create an account.',
                err: true,
            },
            forLecturer: true,
        });
    }

    if (result.disable === true) {
        return res.render('vwUser/log-in', {
            notify: {
                message: 'Your account has been block. Please contact support for more information',
                err: true,
            },
            forUser: true,
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

router.post('/profile', auth.lecturer, async function (req, res) {
    let post_id = req.body.postId;

    // =========== CHANGE PICTURE ============
    if (post_id == null) {
        let rand = func.random(5);
        let pic_path = '/public/data/lecturer_img/';
        const storage = multer.diskStorage({
            destination: './public/data/lecturer_img/',
            filename: function (req, file, cb) {
                let file_ext = file.originalname.split('.').pop();
                let fname = req.session.profile.username.concat(rand).concat('.').concat(file_ext);
                pic_path = pic_path.concat(fname);
                cb(null, fname);
            }
        });
        const upload = multer({ storage });
        upload.single('filename')(req, res, function (err) {
            console.log(req.body);
            if (err) {
                console.log(err)
                return res.render('vwLecturer/profile', {
                    notify: {
                        message: "Something Went Wrong! Please Try Again",
                        err: true,
                    },
                    forUser: true,
                })
            } else {
                lecturerModel.changePicture(pic_path, req.session.profile.username);
                req.session.profile.picture = pic_path;
                return res.render('/lecturer/profile');
            }
        });
    }
    // ========================================


    // =========== CHANGE PASSWORD ============ 
    if (post_id === "password") {
        let result = await lecturerModel.singleByUsername(req.session.profile.username);
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

    // ============ CHANGE PROFILE ==============
    if (post_id === "info") {
        let checkEmail = await lecturerModel.singleByEmail(req.body.email);
        if (checkEmail) {
            if (checkEmail.username !== req.session.profile.username) {
                return res.render('vwLecturer/profile', {
                    notify: {
                        message: "Email already exists. Please enter another email.",
                        err: true,
                    },
                    forUser: true,
                });
            }
        }
        lecturerModel.changeInfo(req.body.name, req.body.email, req.session.profile.username);
        req.session.profile.name = req.body.name;
        req.session.profile.email = req.body.email;
        return res.redirect('/lecturer/profile');
    }
});

router.get("/create", auth.lecturer, async function (req, res) {
    let listCat = await categoryModel.all();
    res.render("vwLecturer/create", {
        forLecturer: true,
        listCat,
    })
});

router.post('/create', auth.lecturer, function (req, res) {
    let rand = func.random(5);
    let big_thumbnail_path = '/public/courses/big_thumbnail/';
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, course_bigthum_path);
        },
        filename: function (req, file, cb) {
            let file_ext = file.originalname.split('.').pop();
            let filename = req.session.profile.username.concat(rand).concat('.').concat(file_ext);
            big_thumbnail_path = big_thumbnail_path.concat(filename);
            cb(null, filename);
        }
    });
    const upload = multer({ storage });
    upload.single('bigthumbnaillink')(req, res, function (err) {
        console.log(req.body);
        if (err) {
            console.log(err);
        } else {
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

            let newCourse = {
                categoryid: req.body.categoryid,
                title: req.body.title,
                lecturer: req.session.profile.username,
                tinydes: req.body.tinydes,
                fulldes: req.body.fulldes,
                bigthumbnaillink: big_thumbnail_path,
                smallthumbnaillink: big_thumbnail_path,
                lastupdatedate: date,
                numstudent: 0,
                numstudentinaweek: 0,
                numview: 0,
                rate: 0,
                numrate: 0,
                originalprice: req.body.originalprice,
                promotionalprice: req.body.promotionalprice,
                status: 0,
                disable: 0
            }
            courseModel.addCourse(newCourse);

            res.redirect('/lecturer/create');
        }
    });
});

router.get('/payment', auth.lecturer, async function (req, res) {
    let result = await lecturerModel.singleByUsername(req.session.profile.username);
    res.render('vwLecturer/payment', {
        forLecturer: true,
        payment: {
            bankid: result.bankid,
            bankname: result.bankname,
        },
    });
});
router.post('/payment', auth.lecturer, function (req, res) {
    lecturerModel.changeBank(req.body.bankid, req.body.bankname, req.session.profile.username);
    res.redirect('/lecturer/payment');
});
router.get('/performance', auth.lecturer, function (req, res) {
    res.render('vwLecturer/performance', {
        forLecturer: true,
    });
});

router.get('/course', auth.lecturer, async function (req, res) {
    const limit = config.paginationOnCategory.limit;
    let c_page = +req.query.c || 1;
    if (c_page < 1) c_page = 1;

    const c_offset = (c_page - 1) * limit;
    const c_total = await courseModel.countCourseByLecID(req.session.profile.username);
    const c_npage = Math.ceil(c_total / limit);

    const c_pageItems = [];

    for (i = 1; i <= c_npage; i++) {
        const item = {
            value: i,
            isActive: i === c_page,
        }
        c_pageItems.push(item);
    }
    // Load course
    const course = await courseModel.pageOnCourseByLecID(req.session.profile.username, limit, c_offset);

    res.render('vwLecturer/course', {
        forLecturer: true,
        course,
        c_pageItems,
        c_canGoPrevious: c_page > 1,
        c_canGoNext: c_page < c_npage,
        c_previousPage: +c_page - 1,
        c_nextPage: +c_page + 1
    })
});

// DELETE COURSE HANDLE
router.post('/course/del', auth.lecturer, async function (req, res) {
    const courseid = req.body.courseid;
    const courseDetail = await lecturerModel.getOwnCourse(req.session.profile.username, courseid);
    console.log(courseid)
    console.log(courseDetail);
    if (courseDetail === null) {
        return res.render('refuse', {
            forLecturer: true,
        });
    }
    await courseModel.deleteByCourseID(courseid);
    res.redirect(req.headers.referer);
});

router.get('/course/:id', auth.lecturer, async function (req, res) {
    const courseid = req.params.id;
    const courseDetail = await lecturerModel.getOwnCourse(req.session.profile.username, courseid);
    if (courseDetail === null) {
        return res.render('refuse', {
            forLecturer: true,
        });
    }
    let listCat = await categoryModel.all();
    let lesson = await lessonModel.allByCourse(courseid);
    return res.render('vwLecturer/courseDetail', {
        currentCourse: courseDetail,
        forLecturer: true,
        listCat,
        lesson,
    })
});

router.post('/course/:id', auth.lecturer, async function (req, res) {
    const postid = req.body.postid;
    if (postid === "remove") {
        const lessonid = req.body.lessonid;
        console.log(req.body);
        lessonModel.delById(lessonid);
        return res.redirect(req.headers.referer);
    }
    const courseid = req.params.id;
    const courseDetail = await lecturerModel.getOwnCourse(req.session.profile.username, courseid);
    if (courseDetail === null) {
        return res.render('refuse', {
            forLecturer: true,
        });
    }
    newCourse = {
        id: courseid,
        title: req.body.title,
        tinydes: req.body.tinydes,
        originalprice: req.body.originalprice,
        categoryid: req.body.categoryid,
        status: req.body.status,
        fulldes: req.body.fulldes,
    }
    await courseModel.changeInfo(newCourse);
    let url = '/lecturer/course/'.concat(courseid);
    res.redirect(url);
});

router.get('/course/:id/add', auth.lecturer, async function (req, res) {
    const courseid = req.params.id;
    const courseDetail = await lecturerModel.getOwnCourse(req.session.profile.username, courseid);
    if (courseDetail === null) {
        return res.render('refuse', {
            forLecturer: true,
        });
    }
    availableRank = await lessonModel.getAvailableRank(courseid);

    res.render('vwLecturer/addVideo', {
        forLecturer: true,
        availableRank,
    });
});

router.post('/course/:id/add', auth.lecturer, async function (req, res) {
    const courseid = req.params.id;
    console.log(courseid);
    console.log(req.body);
    const courseDetail = await lecturerModel.getOwnCourse(req.session.profile.username, courseid);
    if (courseDetail === null) {
        return res.render('refuse', {
            forLecturer: true,
        });
    }

    let rand = func.random(5);
    let lesson_path = '/public/courses/lessons/';
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/courses/lessons/');
        },
        filename: function (req, file, cb) {
            let file_ext = file.originalname.split('.').pop();
            let filename = req.session.profile.username.concat(courseid).concat(rand).concat('.').concat(file_ext);
            lesson_path = lesson_path.concat(filename);
            console.log(filename);
            cb(null, filename);
        }
    });
    const upload = multer({ storage });
    upload.single('video')(req, res, function (err) {
        console.log(req.body);
        if (err) {
            console.log(err);
        } else {
            let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');

            let newLesson = {
                course: courseid,
                title: req.body.title,
                rank: req.body.rank,
                detail: req.body.detail,
                date: dateNow,
                video: lesson_path,
            }
            lessonModel.addLesson(newLesson);
            let url = '/lecturer/course/'.concat(courseid);
            res.redirect(url);
        }
    });
});

module.exports = router;