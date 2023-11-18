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

        res.status(200).send({message: 'Views incremented successfully'});
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


// Endpoint to get questions sorted by most recent answer activity
router.get('/sorted/active', async (req, res) => {
    try {
        let questions = await Question.find({}).populate('answers');

        questions.sort((a, b) => {

            console.log(`Question A Answers: ${a.answers.length}, Question B Answers: ${b.answers.length}`);

            const hasAnswersA = a.answers.length > 0;
            const hasAnswersB = b.answers.length > 0;

            if (hasAnswersA && !hasAnswersB) return -1;
            if (!hasAnswersA && hasAnswersB) return 1;

            const latestAnswerDateA = hasAnswersA
                ? new Date(Math.max(...a.answers.map(ans => new Date(ans.ans_date_time).getTime())))
                : new Date(a.ask_date_time);

            const latestAnswerDateB = hasAnswersB
                ? new Date(Math.max(...b.answers.map(ans => new Date(ans.ans_date_time).getTime())))
                : new Date(b.ask_date_time);

            return latestAnswerDateB - latestAnswerDateA;
        });
        // const latestActivityMap = {};
        //
        // for (const question of questions) {
        //     const questionId = question._id.toString();
        //     let latestActivityDate = new Date(question.ask_date_time).getTime(); // Default to ask date
        //
        //     for (const answer of question.answers) {
        //         const answerDate = new Date(answer.ans_date_time).getTime();
        //         if (answerDate > latestActivityDate) {
        //             latestActivityDate = answerDate;
        //         }
        //     }
        //
        //     latestActivityMap[questionId] = latestActivityDate;
        // }
        //
        // questions.sort((a, b) => {
        //     const aId = a._id.toString();
        //     const bId = b._id.toString();
        //     return latestActivityMap[bId] - latestActivityMap[aId];
        // });
        //
        //
        res.json(questions);
    } catch (error) {
        console.error("Error fetching actively sorted questions:", error);
        res.status(500).send(error);
    }
});


module.exports = router;