const express = require('express');
const { addNewSection, getAllSections, editEachSection, deleteEachSection } = require('./sections.controller');
const sectionsRouter = express.Router();
sectionsRouter.post('/addsection',addNewSection);
sectionsRouter.get('/getsections',getAllSections);
sectionsRouter.put('/editsection',editEachSection);
sectionsRouter.delete('/deletesection/:id',deleteEachSection);
module.exports = sectionsRouter;