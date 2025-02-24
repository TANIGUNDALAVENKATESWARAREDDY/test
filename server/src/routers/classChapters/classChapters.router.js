const express = require('express');
const { addNewChapterController, getAllChaptersController, deleteChapterController, updateAddedChapterController } = require('./classChapters.controller');

const classChapterRouter = express.Router();
classChapterRouter.post('/addChapterToSubject',addNewChapterController);
classChapterRouter.get('/getAllChaptersOfASubject/:classid/:subjectid',getAllChaptersController);
classChapterRouter.delete('/deleteChapterOfASubject/:classid/:subjectid/:chapterid',deleteChapterController);
classChapterRouter.put('/updateAddedChapterToSubject',updateAddedChapterController);

module.exports =classChapterRouter;