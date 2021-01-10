const express = require('express');
const bcrypt = require('bcryptjs');
const adminModel = require('../../models/admin.model');
const lecturerModel = require('../../models/lecturer.model');
const userModel = require('../../models/user.model');
const courseModel = require('../../models/course.model');
const config = require('../../config/default.json');
const categoryModel = require('../../models/category.model');

const DEFAULT_ADMIN_PAGE = 'user-list';

const router = express.Router();

router.get('/log-in', function (req, res) {
    res.render('vwAdmin/log-in', {
        forAdmin: true,
    });
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
    console.log(correctPassword);
    if (correctPassword == false) {
        return res.render('vwAdmin/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forAdmin: true,
        });
    }
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.permission = 2;
    req.session.isAuth = true;

    res.redirect(`/admin/${DEFAULT_ADMIN_PAGE}`);
});


//----------------------------category-list-------------------------------

router.get('/user-list', async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Account has been changed';
    } else if (req.query.result === '2') {
        message = 'Account has been deleted';
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

router.get('/user-list/edit/:username', async function (req, res) {
    const username = req.params.username;
    const user = await userModel.singleByUsername(username);
    res.render('vwAdmin/user_list/edit-user-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'users-list-link',
        user
    });
});

router.post('/user-list/edit/:username', async function (req, res) {
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

router.post('/user-list/delete', async function (req, res) {
    await userModel.deleteAccount(req.body.usernameWantToDelete);
    res.redirect('/admin/user-list' + '?result=2')
});

//------------------------------------------------------------------------


//----------------------------lecturer-list-------------------------------

router.get('/lecturer-list', async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Account has been created successfully';
    } else if (req.query.result === '2') {
        message = 'Account has been changed';
    } else if (req.query.result === '3') {
        message = 'Account has been deleted'
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

router.get('/lecturer-list/create-lecturer-account', function (req, res) {
    res.render('vwAdmin/lecturer_list/create-lecturer-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'lecturers-list-link'
    });
});

router.post('/lecturer-list/create-lecturer-account', async function (req, res) {
    const isExisted = await lecturerModel.singleByUsername(req.body.username);
    if (isExisted) {
        return res.render('vwAdmin/lecturer_list/create-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Account has already existed. Please use another username.',
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
        bankname: req.body.bankname
    });
    res.redirect('/admin/lecturer-list' + '?result=1');
});

router.get('/lecturer-list/edit/:username', async function (req, res) {
    const username = req.params.username;
    const lecturer = await lecturerModel.singleByUsername(username);
    res.render('vwAdmin/lecturer_list/edit-lecturer-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'lecturers-list-link',
        lecturer
    });
});

router.post('/lecturer-list/edit/:username', async function (req, res) {
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

router.post('/lecturer-list/delete', async function (req, res) {
    await lecturerModel.deleteAccount(req.body.usernameWantToDelete);
    res.redirect('/admin/lecturer-list' + '?result=3')
});

//------------------------------------------------------------------------


//----------------------------category-list-------------------------------

router.get('/category-list', async function (req, res) {
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

router.get('/category-list/create-category', async function (req, res) {
    const allParentCategories = await categoryModel.allCatIDByLevel(1);
    res.render('vwAdmin/category_list/create-category', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'categories-list-link',
        allParentCategories
    });
});

router.post('/category-list/create-category', async function (req, res) {
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

router.get('/category-list/edit/:id', async function (req, res) {
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

router.post('/category-list/edit/:id', async function (req, res) {
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

router.post('/category-list/delete', async function (req, res) {
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

router.get('/course-list', async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Course has been changed';
    } else if (req.query.result === '2') {
        message = 'Course has been deleted';
    } else {
        message = null;
    }
    let page = +req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.pagination.limit;
    const total = await courseModel.countOnCourse();
    const nPage = Math.ceil(total / config.pagination.limit);
    const pageItems = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        pageItems.push(item);
    }
    const courseList = await courseModel.pageOnCourse(offset);

    res.render('vwAdmin/course_list/course-list', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        courseList,
        tabID: 'courses-list-link',
        message,
        pageItems,
        canGoPrevious: page > 1,
        canGoNext: page < nPage,
        previousPage: +page - 1,
        nextPage: +page + 1
    });
});

//------------------------------------------------------------------------

module.exports = router;