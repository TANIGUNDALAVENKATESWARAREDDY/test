const express = require('express');
const { addFeelistNewItem, getAllFeeListItems, updateSingleClassFeeItem } = require('./feelist.controller');
const feelistRouter = express.Router();
feelistRouter.post('/addfeelistitem',addFeelistNewItem);
feelistRouter.get('/getfeelist',getAllFeeListItems);
feelistRouter.put('/updatesinglefeelist',updateSingleClassFeeItem);
module.exports = feelistRouter;