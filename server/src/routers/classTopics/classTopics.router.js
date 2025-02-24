const express = require('express');
const { AddTopicController, GetAllTopicsController, DeleteTopicController, EditTopicController } = require('./classTopics.controller');

const classTopicsRouter = express.Router();
classTopicsRouter.post('/addNewTopic',AddTopicController);
classTopicsRouter.get('/getAllTopics/:classid/:subjectid/:chapterid',GetAllTopicsController);
classTopicsRouter.delete('/deleteTopic/:classid/:subjectid/:chapterid/:topicid',DeleteTopicController);
classTopicsRouter.put('/editTopic/:classid/:subjectid/:chapterid/:topicid',EditTopicController);
module.exports = classTopicsRouter;