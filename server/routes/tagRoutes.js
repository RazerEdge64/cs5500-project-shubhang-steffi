const express = require('express');
const router = express.Router();
const Tag = require('../models/tags');
const Question = require('../models/questions');

// Get all tags with transformed response
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find({});
        const transformedTags = tags.map(tag => {
            return {
                tid: tag._id.toString(), // Convert ObjectId to string
                name: tag.name
            };
        });
        res.json(transformedTags);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add new tag
router.post('/', async (req, res) => {
    console.log("post req body for tags",req);
    const tagName = req.body.name;

    if (!tagName) {
        return res.status(400).send('Tag name is required');
    }

    try {
        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name: tagName });
        if (existingTag) {
            return res.status(409).send('Tag already exists');
        }

        // Create and save the new tag
        const newTag = new Tag({ name: tagName });
        await newTag.save();

        res.status(201).json({
            tid: newTag._id.toString(), // Convert ObjectId to string for consistent API response
            name: newTag.name
        });
    } catch (error) {
        console.log("Error in adding new tag: ", error);
        res.status(500).send(error);
    }
});


// Get a tag by ID
router.get('/:tagId', async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.tagId);
        if (!tag) {
            return res.status(404).send('Tag not found');
        }

        res.json(tag);
    } catch (error) {
        console.log("Error in fetching tag: ", error);
        res.status(500).send(error);
    }
});

// Get a tag by name
router.get('/name/:tagName', async (req, res) => {
    try {
        const tag = await Tag.findOne({ name: req.params.tagName });
        if (!tag) {
            return res.status(404).send('Tag not found');
        }

        // Transform the tag object if necessary
        const transformedTag = {
            tid: tag._id.toString(), // Convert ObjectId to string
            name: tag.name
        };

        res.json(transformedTag);
    } catch (error) {
        console.log("Error in fetching tag by name: ", error);
        res.status(500).send(error);
    }
});

// Get the number of questions for a specific tag
router.get('/:tagId/questions/count', async (req, res) => {
    try {
        const tagId = req.params.tagId;
        const questionCount = await Question.countDocuments({ 'tags': tagId });

        res.json({ count: questionCount });
    } catch (error) {
        console.log("Error in getting question count for tag:", error);
        res.status(500).send(error);
    }
});



module.exports = router;