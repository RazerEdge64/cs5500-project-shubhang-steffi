const Question = require('../models/questions.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().populate('tags').populate('answers');
        const transformedQuestions = questions.map(question => {
            return {
                qid: question._id.toString(), // Convert ObjectId to string
                title: question.title,
                text: question.text,
                tagIds: question.tags.map(tag => tag._id.toString()),
                askedBy: question.asked_by,
                askDate: question.ask_date_time,
                views: question.views,
                ansIds: question.answers.map(answer => answer._id.toString())
            };
        });
        res.json(transformedQuestions);
    } catch (error) {
        console.log("Error in fetching questions data.", error);
        res.status(500).send(error);
    }
});

// Fetch a question by ID
router.get('/:qid', async (req, res) => {
    try {
        const question = await Question.findById(req.params.qid).populate('tags').populate('answers');
        if (!question) {
            return res.status(404).send('Question not found');
        }
        // Transform the question object as needed
        const answerCount = question.answers ? question.answers.length : 0;

        // Include answer count in the response
        res.json({
            question: question,
            answerCount: answerCount
        });
    } catch (error) {
        console.log("Error in fetching question by ID.", error);
        res.status(500).send(error);
    }
});

// Add a new question
router.post('/', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.log("Error in adding new question:", error);
        res.status(500).send(error);
    }
});


// Increment views of a question
router.post('/increment-views/:qid', async (req, res) => {
    try {
        const questionId = req.params.qid;
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).send('Question not found');
        }

        question.views += 1; // Increment the views
        await question.save(); // Save the updated question

        res.status(200).send({ message: 'Views incremented successfully' });
    } catch (error) {
        console.log("Error in incrementing question views:", error);
        res.status(500).send(error);
    }
});

// Get a question by ID with the count of answers
router.get('/:questionId/with-answers-count', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId).populate('answers');
        const answerCount = question.answers ? question.answers.length : 0;

        res.json({
            question: question,
            answerCount: answerCount
        });
    } catch (error) {
        console.log("Error in getting question with answer count:", error);
        res.status(500).send(error);
    }
});

module.exports = router;


module.exports = router;