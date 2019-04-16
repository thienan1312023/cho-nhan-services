const express = require('express');
const post = require('../models/post');
const global = require('../global');
const mongoose = require('mongoose');
module.exports = {
    searchPosts: async function (req) {
        const { page, perPage } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            perPage: parseInt(perPage, 10) || 20,
        };
        let query = {};
        let isExistCategorySearch = false;
        let isExistKey = false;
        for (let key in req.body) { //could also be req.query and req.params
            if (!global.isNullOrUndefinedOrEmpty(req.body[key])) {
                isExistKey = true;
                if (key === "provinceCityId" || key === "districtTownId") {
                    let keyAlterName = 'address' + '.' + key;
                    query[keyAlterName] = req.body[key];
                } else if (key !== "title" && key !== "") {
                    query[key] = req.body[key];
                } else {
                    const regex = new RegExp(global.escapeRegex(req.body[key]), 'gi');
                    query[key] = regex;
                }
                if (key === "categoryId") {
                    isExistCategorySearch = true;
                }

            }
        }
        const countPagesNum = await post.countDocuments();
        let totalPages = Math.ceil(countPagesNum / options.perPage);
        let posts = null;
        if (Object.keys(query).length) {
            posts = await post.find(query);
        } else {
            posts = await post.find();
        }
        if (posts) {
            let objResult = {
                posts: posts,
                totalPages: totalPages
            }
            if (objResult) {
                return objResult;
            } else {
                return false;
            }
        }
    }
}