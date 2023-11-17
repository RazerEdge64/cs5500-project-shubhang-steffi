const express = require('express');
const router = express.Router();
const Answer = require('../models/answers');
const Question = require('../models/questions');

// Get all answers with transformed response
router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find({});
        const transformedAnswers = answers.map(answer => {
            return {
                aid: answer._id.toString(), // Convert ObjectId to string
                text: answer.text,
                ansBy: answer.ans_by,
                ansDate: answer.ans_date_time
            };
        });
        res.json(transformedAnswers);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get an answer by ID
router.get('/:aid', async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.aid);
        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        const transformedAnswer = {
            aid: answer._id.toString(), // Convert ObjectId to string
            text: answer.text,
            ansBy: answer.ans_by,
            ansDate: answer.ans_date_time
        };

        res.json(transformedAnswer);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Add an answer to a question
router.post('/add/:questionId', async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).send('Question not found');
        }

        const newAnswer = new Answer(req.body);
        await newAnswer.save();

        question.answers.push(newAnswer._id);
        await question.save();

        res.status(201).json(newAnswer);
    } catch (error) {
        console.log("Error in adding answer: ", error);
        res.status(500).send(error);
    }
});


module.exports = router;