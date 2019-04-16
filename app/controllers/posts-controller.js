const express = require('express');
const post = require('../models/post');
const global = require('../global');
const mongoose = require('mongoose');
module.exports = {
    searchPosts: async function (body, queryFilter = null) {
        let options = null;
        if (queryFilter !== null) {
            const { page, perPage } = queryFilter;
            options = {
                page: parseInt(page, 10) || 1,
                perPage: parseInt(perPage, 10) || 20
            };
        }else{
            options = {
                page: 1,
                perPage: 20
            };
        }
        let query = {};
        let isExistCategorySearch = false;
        let isExistKey = false;
        for (let key in body) { //could also be query and params
            if (!global.isNullOrUndefinedOrEmpty(body[key])) {
                isExistKey = true;
                if (key === "provinceCityId" || key === "districtTownId") {
                    let keyAlterName = 'address' + '.' + key;
                    query[keyAlterName] = body[key];
                } else if (key !== "title" && key !== "") {
                    query[key] = body[key];
                } else {
                    const regex = new RegExp(global.escapeRegex(body[key]), 'gi');
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