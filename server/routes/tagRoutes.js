const express = require('express');
const router = express.Router();
const Tag = require('../models/tags');

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



module.exports = router;