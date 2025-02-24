const express = require('express');
const { addNewTownController, getAllTownsController, deleteTownController, updateTownController } = require('./towns.controller');

const townsRouter = express.Router();
townsRouter.post('/addNewTown',addNewTownController);//adding the new town
townsRouter.get('/getAllTowns',getAllTownsController);//fetch all towns data
townsRouter.delete('/deleteTown',deleteTownController);//deleting the town
townsRouter.put('/updateTown',updateTownController);//updating the town

module.exports = townsRouter;