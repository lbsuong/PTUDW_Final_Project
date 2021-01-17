const express = require('express');
const bcrypt = require('bcryptjs');
const adminModel = require('../../models/admin.model');
const lecturerModel = require('../../models/lecturer.model');
const userModel = require('../../models/user.model');
const courseModel = require('../../models/course.model');
const config = require('../../config/default.json');
const categoryModel = require('../../models/category.model');
const auth = require('../../middlewares/auth.mdw');
const multer = require('multer');
const func = require('../../middlewares/function.mdw');
const fs = require('fs');
const lessonModel = require('../../models/lesson.model');
const { lecturer } = require('../../middlewares/auth.mdw');

const DEFAULT_ADMIN_PAGE = 'user-list';

const router = express.Router();

router.get('/log-in', function (req, res) {
    res.render('vwAdmin/log-in', {
        forAdmin: true,
    });
});

router.get('/profile', auth.admin, function (req, res) {
    res.render('vwAdmin/profile', {
        forAdmin: true,
    })
});
router.post('/log-in', async function (req, res) {
    let result = await adminModel.singleByUsername(req.body.username);
    if (result === null) {
        return res.render('vwAdmin/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forLecturer: true,
        })
    }

    const correctPassword = bcrypt.compareSync(req.body.password, result.password);
    if (correctPassword == false) {
        return res.render('vwAdmin/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forAdmin: true,
        });
    }
    req.session.isAuth = true;
    req.session.profile = {
        username: result.username,
        name: result.name,
        email: result.email,
        picture: null,
    };
    req.session.level = {
        admin: true,
        lecturer: false,
        user: false,
    }

    res.redirect(`/admin/${DEFAULT_ADMIN_PAGE}`);
});


//----------------------------category-list-------------------------------

router.get('/user-list', auth.admin, async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Account has been changed';
    } else if (req.query.result === '2') {
        message = 'Account has been deleted';
    } else if (req.query.result === '3') {
        message = 'Account has been disable';
    } else if (req.query.result === '4') {
        message = 'Account has been enable';
    } else {
        message = null;
    }
    let page = +req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginationOnUser.limit;
    const total = await userModel.countOnUser();
    const nPage = Math.ceil(total / config.paginationOnUser.limit);
    const pageItems = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        pageItems.push(item);
    }
    const userList = await userModel.pageOnUser(offset);

    res.render('vwAdmin/user_list/user-list', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        userList,
        tabID: 'users-list-link',
        message,
        pageItems,
        canGoPrevious: page > 1,
        canGoNext: page < nPage,
        previousPage: +page - 1,
        nextPage: +page + 1
    });
});

router.get('/user-list/edit/:username', auth.admin, async function (req, res) {
    const username = req.params.username;
    const user = await userModel.singleByUsername(username);
    res.render('vwAdmin/user_list/edit-user-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'users-list-link',
        user
    });
});

router.post('/user-list/edit/:username', auth.admin, async function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
        const user = await userModel.singleByUsername(req.params.username);
        return res.render('vwAdmin/user_list/edit-user-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            tabID: 'users-list-link',
            err_message: 'Password does not match',
            user
        });
    }
    let newProfile = {};
    if (req.body.password === '') {
        newProfile = {
            username: req.params.username,
            name: req.body.name,
            email: req.body.email,
        }
    } else {
        newProfile = {
            username: req.params.username,
            password: bcrypt.hashSync(req.body.password, 10),
            name: req.body.name,
            email: req.body.email,
        }
    }
    await userModel.changeProfile(newProfile);
    res.redirect('/admin/user-list' + '?result=1');
});

router.post('/user-list/delete', auth.admin, async function (req, res) {
    await userModel.deleteAccount(req.body.usernameWantToDelete);
    res.redirect('/admin/user-list' + '?result=2')
});

router.post('/user-list/disable', auth.admin, async function (req, res) {
    await userModel.disableAccount(req.body.usernameWantToDisable);
    res.redirect('/admin/user-list' + '?result=3')
});

router.post('/user-list/enable', auth.admin, async function (req, res) {
    await userModel.enableAccount(req.body.usernameWantToEnable);
    res.redirect('/admin/user-list' + '?result=4')
});

//------------------------------------------------------------------------


//----------------------------lecturer-list-------------------------------

router.get('/lecturer-list', auth.admin, async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Account has been created successfully';
    } else if (req.query.result === '2') {
        message = 'Account has been changed';
    } else if (req.query.result === '3') {
        message = 'Account has been deleted'
    } else if (req.query.result === '4') {
        message = 'Account has been disable'
    } else if (req.query.result === '5') {
        message = 'Account has been enable'
    } else {
        message = null;
    }
    let page = +req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginationOnLecturer.limit;
    const total = await lecturerModel.countOnLecturer();
    const nPage = Math.ceil(total / config.paginationOnLecturer.limit);
    const pageItems = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        pageItems.push(item);
    }
    const lecturerList = await lecturerModel.pageOnLecturer(offset);

    res.render('vwAdmin/lecturer_list/lecturer-list', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        lecturerList,
        tabID: 'lecturers-list-link',
        message,
        pageItems,
        canGoPrevious: page > 1,
        canGoNext: page < nPage,
        previousPage: +page - 1,
        nextPage: +page + 1
    });
});

router.get('/lecturer-list/create-lecturer-account', auth.admin, function (req, res) {
    res.render('vwAdmin/lecturer_list/create-lecturer-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'lecturers-list-link'
    });
});

router.post('/lecturer-list/create-lecturer-account', auth.admin, async function (req, res) {
    const isExisted = await lecturerModel.singleByUsername(req.body.username);
    if (isExisted) {
        return res.render('vwAdmin/lecturer_list/create-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Account has already existed. Please use another username.',
            tabID: 'lecturers-list-link'
        });
    }
    const emailIsExisted = await lecturerModel.emailExisted(req.body.email);
    if (emailIsExisted) {
        return res.render('vwAdmin/lecturer_list/create-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Email has existed',
            tabID: 'lecturers-list-link'
        });
    }
    if (req.body.confirmPassword !== req.body.password) {
        return res.render('vwAdmin/lecturer_list/create-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Password does not match',
            tabID: 'lecturers-list-link'
        });
    }
    await lecturerModel.add({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.username,
        email: req.body.email,
        bankid: req.body.bankid,
        bankname: req.body.bankname,
        disable: false
    });
    res.redirect('/admin/lecturer-list' + '?result=1');
});

router.get('/lecturer-list/edit/:username', auth.admin, async function (req, res) {
    const username = req.params.username;
    const lecturer = await lecturerModel.singleByUsername(username);
    res.render('vwAdmin/lecturer_list/edit-lecturer-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'lecturers-list-link',
        lecturer
    });
});

router.post('/lecturer-list/edit/:username', auth.admin, async function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
        const lecturer = await lecturerModel.singleByUsername(req.params.username);
        return res.render('vwAdmin/lecturer_list/edit-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            tabID: 'lecturers-list-link',
            err_message: 'Password does not match',
            lecturer
        });
    }
    let newProfile = {};
    if (req.body.password === '') {
        newProfile = {
            username: req.params.username,
            name: req.body.name,
            email: req.body.email,
            bankid: req.body.bankid,
            bankname: req.body.bankname
        }
    } else {
        newProfile = {
            username: req.params.username,
            password: bcrypt.hashSync(req.body.password, 10),
            name: req.body.name,
            email: req.body.email,
            bankid: req.body.bankid,
            bankname: req.body.bankname
        }
    }
    await lecturerModel.changeProfile(newProfile);
    res.redirect('/admin/lecturer-list' + '?result=2');
});

router.post('/lecturer-list/delete', auth.admin, async function (req, res) {
    await lecturerModel.deleteAccount(req.body.usernameWantToDelete);
    res.redirect('/admin/lecturer-list' + '?result=3')
});

router.post('/lecturer-list/disable', auth.admin, async function (req, res) {
    await lecturerModel.disableAccount(req.body.usernameWantToDisable);
    res.redirect('/admin/lecturer-list' + '?result=4')
});

router.post('/lecturer-list/enable', auth.admin, async function (req, res) {
    await lecturerModel.enableAccount(req.body.usernameWantToEnable);
    res.redirect('/admin/lecturer-list' + '?result=5')
});

//------------------------------------------------------------------------


//----------------------------category-list-------------------------------

router.get('/category-list', auth.admin, async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Category has been created successfully';
    } else if (req.query.result === '2') {
        message = 'Category has been changed';
    } else if (req.query.result === '3') {
        message = 'Category has been deleted'
    } else {
        message = null;
    }
    let page = +req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginationOnCategory.limit;
    const total = await categoryModel.countOnCategory();
    const nPage = Math.ceil(total / config.paginationOnCategory.limit);
    const pageItems = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        pageItems.push(item);
    }
    const categoryList = await categoryModel.pageOnCategory(offset);
    for (category of categoryList) {
        const result = await categoryModel.parentCatByID(category.id);
        if (result === null) {
            category.parentid = null;
        } else {
            category.parentid = result.id;
        }
    }

    res.render('vwAdmin/category_list/category-list', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        categoryList,
        tabID: 'categories-list-link',
        message,
        pageItems,
        canGoPrevious: page > 1,
        canGoNext: page < nPage,
        previousPage: +page - 1,
        nextPage: +page + 1
    });
});

router.get('/category-list/create-category', auth.admin, async function (req, res) {
    const allParentCategories = await categoryModel.allCatIDByLevel(1);
    res.render('vwAdmin/category_list/create-category', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'categories-list-link',
        allParentCategories
    });
});

router.post('/category-list/create-category', auth.admin, async function (req, res) {
    if (req.body.parentid === undefined && req.body.level === '2') {
        return res.render('vwAdmin/category_list/create-category', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'You currently don\'t have any level 1 category. Please create one',
            tabID: 'categories-list-link'
        });
    }

    const isExisted = await categoryModel.singleByName(req.body.categoryname);
    if (isExisted) {
        return res.render('vwAdmin/category_list/create-category', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Category has already existed. Please use another name.',
            tabID: 'categories-list-link'
        });
    }
    const level = +req.body.level;
    await categoryModel.add({
        name: req.body.categoryname,
        level: level,
        countinaweek: 0
    });
    if (level === 2) {
        const newCategoryID = await categoryModel.getLastID();
        await categoryModel.addCategoryRelationship({
            parentid: +req.body.parentid,
            subid: +newCategoryID
        });
    }
    res.redirect('/admin/category-list' + '?result=1');
});

router.get('/category-list/edit/:id', auth.admin, async function (req, res) {
    let err_message = null;
    if (req.query.err === '1') {
        err_message = 'There are courses in this category. You cannot delete this category.';
    }

    const id = +req.params.id;
    const targetCategory = await categoryModel.singleByID(id);
    let allParentCategories = await categoryModel.allCatIDByLevel(1);
    const level = [];
    for (i = 1; i <= 2; i++) {
        const item = {
            value: i,
            isSelected: i === targetCategory.level
        }
        level.push(item);
    }
    if (targetCategory.level === 1) {
        for (i = 0; i < allParentCategories.length; i++) {
            if (allParentCategories[i].id === id) {
                allParentCategories.splice(i, 1);
                break;
            }
        }
    } else if (targetCategory.level === 2) {
        let parentCategory = await categoryModel.parentCatByID(id);
        for (i = 0; i < allParentCategories.length; i++) {
            allParentCategories[i].isSelected = (allParentCategories[i].id === parentCategory.id)
        }
    }
    res.render('vwAdmin/category_list/edit-category', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'categories-list-link',
        targetCategory,
        allParentCategories,
        level,
        err_message
    });
});

router.post('/category-list/edit/:id', auth.admin, async function (req, res) {
    if (req.body.parentid === undefined && req.body.level === '2') {
        return res.render('vwAdmin/category_list/edit-category', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'You currently don\'t have any level 1 category. Please create one',
            tabID: 'categories-list-link'
        });
    }

    const id = +req.params.id;
    const level = +req.body.level;
    const targetCategory = await categoryModel.singleByID(id);
    if (level === 1) {
        await categoryModel.changeInfo(id, {
            name: req.body.categoryname,
            level: 1
        });
        if (targetCategory.level === 2) {
            const result = categoryModel.parentCatByID(id);
            const parentid = +result.id;
            await categoryModel.removeCategoryRelationship({
                parentid: parentid,
                subid: id
            });
            await categoryModel.addCategoryRelationship({
                parentid: req.body.parentid,
                subid: id
            });
        }
    } else if (level === 2) {
        await categoryModel.changeInfo(id, {
            name: req.body.categoryname,
            level: 2
        });
        if (targetCategory.level === 1) {
            await categoryModel.changeCatFromLevelOneToLevelTwo(id, req.body.parentid);
        } else if (targetCategory.level === 2) {
            const result = await categoryModel.parentCatByID(id);
            const parentid = +result.id;
            await categoryModel.removeCategoryRelationship({
                parentid: parentid,
                subid: id
            });
            await categoryModel.addCategoryRelationship({
                parentid: +req.body.parentid,
                subid: id
            });
        }
    }
    res.redirect('/admin/category-list' + '?result=2');
});

router.post('/category-list/delete', auth.admin, async function (req, res) {
    const id = +req.body.idWantToDelete
    const canBeDeleted = await categoryModel.canBeDeleted(id);
    const targetCategory = await categoryModel.singleByID(id);
    if (!canBeDeleted) {
        return res.redirect('/admin/category-list/edit/' + id + '?err=1');
    }
    if (targetCategory.level === 1) {
        await categoryModel.deleteCategoryWithLevelOne(id);
    } else if (targetCategory.level === 2) {
        const result = await categoryModel.parentCatByID(id);
        const parentid = +result.id;
        await categoryModel.removeCategoryRelationship({
            parentid: parentid,
            subid: id
        });
    }
    await categoryModel.deleteCategory(id);
    res.redirect('/admin/category-list' + '?result=3')
});

//------------------------------------------------------------------------


//----------------------------course-list-------------------------------

router.get('/course-list', auth.admin, async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Course has been changed';
    } else if (req.query.result === '2') {
        message = 'Course has been deleted';
    } else if (req.query.result === '3') {
        message = 'Course has been disable';
    } else if (req.query.result === '4') {
        message = 'Course has been enable';
    } else {
        message = null;
    }

    let filter = null;
    if (req.query.byLecturer === 'on' || req.query.byCategory === 'on') {
        filter = {
            lecturerid: null,
            categoryid: null
        };
        if (req.query.byLecturer === 'on') {
            filter.lecturerid = req.query.lecturerid;
        }
        if (req.query.byCategory === 'on') {
            filter.categoryid = req.query.categoryid;
        }
    }

    let page = +req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.pagination.limit;
    const total = await courseModel.countOnCourse(filter);
    const nPage = Math.ceil(total / config.pagination.limit);
    const pageItems = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        pageItems.push(item);
    }
    const courseList = await courseModel.pageOnCourse(offset, filter);
    const lecturerList = await lecturerModel.all();
    const categoryList = await categoryModel.allCatIDByLevel(2);

    for (i = 0; i < lecturerList.length; i++) {
        lecturerList[i].isSelected = (lecturerList[i].username === req.query.lecturerid);
    }
    for (i = 0; i < categoryList.length; i++) {
        categoryList[i].isSelected = (categoryList[i].id === +req.query.categoryid);
    }

    res.render('vwAdmin/course_list/course-list', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        courseList,
        tabID: 'courses-list-link',
        showFilter: true,
        lecturerList,
        categoryList,
        query: req.query,
        message,
        pageItems,
        canGoPrevious: page > 1,
        canGoNext: page < nPage,
        previousPage: +page - 1,
        nextPage: +page + 1,
        byLecturerChecked: (req.query.byLecturer === 'on'),
        byCategoryChecked: (req.query.byCategory === 'on')
    });
});

router.get('/course-list/edit/:id', auth.admin, async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Lesson has been changed';
    } else if (req.query.result === '2') {
        message = 'Lesson has been deleted';
    } else {
        message = null;
    }

    const id = req.params.id;
    const course = await courseModel.singleByID(id);
    const category = await categoryModel.allCatIDByLevel(2);
    for (i = 0; i < category.length; i++) {
        category[i].isSelected = (course.categoryid === category[i].id);
    }
    const lessonList = await lessonModel.allByCourse(id);

    res.render('vwAdmin/course_list/edit-course', {
        course,
        category,
        lessonList,
        message
    })
});

router.post('/course-list/edit/:id', auth.admin, async function (req, res) {
    const id = req.params.id;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const rand = func.random(5);
    let video_path = `/public/courses/${id}/`;
    const storage = multer.diskStorage({
        destination: '.' + video_path,
        filename: function (req, file, cb) {
            const filename = req.session.profile.username.concat(rand).concat(file.originalname);
            video_path = video_path.concat(filename);
            cb(null, filename);
        }
    });
    const upload = multer({ storage: storage })
    upload.single('thumbnail')(req, res, async function (err) {
        if (err) {
            console.log(err);
        } else {
            const course = await courseModel.singleByID(id);
            if (req.file !== undefined) {
                fs.unlink('.' + course.bigthumbnaillink, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (course.categoryid !== +req.body.category) {
                await categoryModel.addCountInAWeekFor(+req.body.category, 1);
                await categoryModel.addCountInAWeekFor(course.categoryid, -1);
            }
            const entity = {
                id: id,
                categoryid: +req.body.category,
                title: req.body.title,
                tinydes: req.body.tinydes,
                fulldes: req.body.fulldes,
                bigthumbnaillink: video_path,
                smallthumbnaillink: video_path,
                lastupdatedate: today,
                originalprice: +req.body.originalprice,
                promotionalprice: +req.body.promotionalprice,
                status: +req.body.status
            }
            if (req.file === undefined) {
                delete entity.bigthumbnaillink;
                delete entity.smallthumbnaillink;
            }
            await courseModel.changeInfo(entity);
        }
    });

    res.redirect('/admin/course-list' + '?result=1');
});

router.post('/course-list/delete', auth.admin, async function (req, res) {
    await courseModel.deleteCourse(req.body.idWantToDelete);
    res.redirect('/admin/course-list' + '?result=2');
});

router.post('/course-list/disable', auth.admin, async function (req, res) {
    await courseModel.disableCourse(req.body.idWantToDisable);
    res.redirect('/admin/course-list' + '?result=3');
});

router.post('/course-list/enable', auth.admin, async function (req, res) {
    await courseModel.enableCourse(req.body.idWantToEnable);
    res.redirect('/admin/course-list' + '?result=4');
});

router.get('/course-list/edit/:courseid/lesson/edit/:lessonid', auth.admin, async function (req, res) {
    const courseid = req.params.courseid;
    const lessonid = req.params.lessonid;
    const lesson = await lessonModel.singleByID(lessonid);

    res.render('vwAdmin/course_list/edit-lesson', {
        courseid,
        lesson
    })
});

router.post('/course-list/edit/:courseid/lesson/edit/:lessonid', auth.admin, async function (req, res) {
    const courseid = req.params.courseid;
    const lessonid = req.params.lessonid;

    let today = new Date();
    const hour = String(today.getHours());
    const minute = String(today.getMinutes());
    const second = String(today.getSeconds());
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = second + minute + hour + dd + mm + yyyy;

    let video_path = `/public/courses/${courseid}/`;
    const storage = multer.diskStorage({
        destination: '.' + video_path,
        filename: function (req, file, cb) {
            const filename = req.session.profile.username.concat(today).concat('.').concat(file.mimetype.split('/').pop());
            video_path = video_path.concat(filename);
            cb(null, filename);
        }
    });
    const upload = multer({ storage: storage })
    upload.single('video')(req, res, async function (err) {
        if (err) {
            console.log(err);
        } else {
            const lesson = await lessonModel.singleByID(lessonid);
            if (req.file !== undefined) {
                fs.unlink('.' + lesson.video, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            const updateDate = `${yyyy}-${mm}-${dd} ${hour}:${minute}:${second}`;
            const entity = {
                id: lessonid,
                title: req.body.title,
                rank: req.body.rank,
                video: video_path,
                detail: req.body.detail,
                date: updateDate
            }
            if (req.file === undefined) {
                delete entity.video;
            }
            await lessonModel.changeInfo(entity);
        }
    });

    res.redirect(`/admin/course-list/edit/${courseid}` + '?result=1');
});

router.post('/course-list/edit/:courseid/lesson/delete', auth.admin, async function (req, res) {
    const courseid = req.params.courseid;
    const lesson = await lessonModel.singleByID(req.body.idWantToDelete);
    fs.unlink('.' + lesson.video, (err) => {
        if (err) {
            console.log(err);
        }
    });
    await lessonModel.delById(req.body.idWantToDelete);
    res.redirect(`/admin/course-list/edit/${courseid}` + '?result=2');
});

//------------------------------------------------------------------------

module.exports = router;