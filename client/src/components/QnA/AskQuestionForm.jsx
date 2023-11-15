import React, { useState } from 'react';
import {addQuestion, mapTagsToIds} from '../../services/dataServices.js';
import logger from "../../logger/logger";

function AskQuestionForm({ setActiveView, setActiveTab }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [username, setUsername] = useState('');

    const [titleError, setTitleError] = useState('');
    const [textError, setTextError] = useState('');
    const [tagError, setTagError] = useState('');
    const [usernameError, setUsernameError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = document.getElementById('formTitleInput').value;
        const text = document.getElementById('formTextInput').value;
        const tags = document.getElementById('formTagInput').value.split(' ');
        const username = document.getElementById('formUsernameInput').value;

        logger.log(tags);

        let valid = true;

        // Title validation
        if (!title) {
            valid = false;
            setTitleError('Title cannot be empty');
        } else if (title.length > 100) {
            valid = false;
            setTitleError('Title cannot be more than 100 characters');
        } else {
            setTitleError('');
        }

        // Text validation
        if (!text) {
            valid = false;
            setTextError('Question text cannot be empty');
        } else {
            const regex = /\s*\[([^\]]+)\]\s*\(\s*([^)]+)\s*\)/g;

            const matches = text.match(regex);

            logger.log('Input Text: '+text);
            logger.log('Matches: '+matches);


            let invalidLinkFound = false;

            if (matches) {
                for (const match of matches) {
                    const linkText = match.match(/\[([^\]]+)\]/)[1];
                    const linkTarget = match.match(/\(([^)]+)\)/)[1];

                    logger.log('Link Text: '+ linkText);
                    logger.log('Link Target: ' + linkTarget);


                    if (!linkText.trim() || !linkTarget.trim() || !linkTarget.startsWith('https://')) {
                        invalidLinkFound = true;
                        break;
                    }
                }
            }

            if (invalidLinkFound) {
                valid = false;
                setTextError('Invalid hyperlink');
            } else {
                setTextError('');
            }
        }


        // Tags validation
        // const tagsArray = tags.split(' ');
        const tagsArray = tags;
        if (tagsArray.length > 5) {
            valid = false;
            setTagError('Cannot have more than 5 tags');
        } else if (tagsArray.some(tag => tag.length > 20)) {
            valid = false;
            setTagError('New tag length cannot be more than 20');
        } else {
            setTagError('');
        }

        // Username validation
        if (!username) {
            valid = false;
            setUsernameError('Username cannot be empty');
        } else {
            setUsernameError('');
        }


        if (valid) {

            const mappedTagIds = mapTagsToIds(tags);

            const newQuestion = {
                qid: 'q' + (new Date().getTime()),
                title: title,
                text: text,
                tagIds: mappedTagIds,
                askedBy: username,
                askDate: new Date(),
                ansIds: [],
                views: 0
            };

            try {
                await addQuestion(newQuestion);
                // Reset the form and change view only after successful addition
                setTitle('');
                setText('');
                setTags('');
                setUsername('');
                setActiveView('questions');
                setActiveTab('questions');
            } catch (error) {
                console.error('Error posting question:', error);
                // Handle error (e.g., show error message to user)
            }



            setActiveView('questions');
            setActiveTab('questions');
        }


    };

    return (
        <div className="ask-question-form">
            <h3>Ask a Question</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="formTitleInput">Title:</label>
                    <input type="text" id="formTitleInput" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your question title" />
                    <div className="error-message">{titleError}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="formTextInput">Question:</label>
                    <textarea id="formTextInput" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your question text"></textarea>
                    <div className="error-message">{textError}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="formTagInput">Tags (separate with spaces, max 5 tags):</label>
                    <input type="text" id="formTagInput" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. javascript react nodejs" />
                    <div className="error-message">{tagError}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="formUsernameInput">Username:</label>
                    <input type="text" id="formUsernameInput" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                    <div className="error-message">{usernameError}</div>
                </div>

                <button type="submit" className="blue-button" >Post Question</button>
            </form>
        </div>
    );
}

export default AskQuestionForm;
