import React, { useState } from 'react';
import { addQuestion, mapTagsToIds } from '../../services/dataServices.js';
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

        // Validate form fields
        let isValid = true;
        setTitleError('');
        setTextError('');
        setTagError('');
        setUsernameError('');

        if (!title) {
            setTitleError('Title cannot be empty');
            isValid = false;
        } else if (title.length > 100) {
            setTitleError('Title cannot be more than 100 characters');
            isValid = false;
        }

        // Validate text
        if (!text) {
            setTextError('Question text cannot be empty');
            isValid = false;
        } else {
            const hyperlinkRegex = /\[([^\]]+)\]\((https:\/\/[^)]+)\)/g;
            let match;
            let invalidLinkFound = false;

            while ((match = hyperlinkRegex.exec(text)) !== null) {
                // Check if either Link Text or URL is empty or URL doesn't start with https://
                if (match[1].trim() === '' || match[2].trim() === '' || !match[2].startsWith('https://')) {
                    invalidLinkFound = true;
                    break;
                }
            }

            if (invalidLinkFound || (text.includes('[') && !hyperlinkRegex.test(text))) {
                setTextError('Invalid hyperlink');
                isValid = false;
            }
        }



        const tagsArray = tags.split(' ').filter(tag => tag);
        if (tagsArray.length > 5) {
            setTagError('Cannot have more than 5 tags');
            isValid = false;
        } else if (tagsArray.some(tag => tag.length > 20)) {
            setTagError('Tag length cannot be more than 20');
            isValid = false;
        }

        if (!username) {
            setUsernameError('Username cannot be empty');
            isValid = false;
        }

        if (isValid) {
            try {
                console.log("tagsArray - ",tagsArray);
                const mappedTagIds = await mapTagsToIds(tagsArray);
                const newQuestion = {
                    title: title,
                    text: text,
                    tags: mappedTagIds,
                    answers: [],
                    asked_by: username,
                    ask_date_time: new Date(),
                    views: 0  
                };

                logger.log(newQuestion);

                await addQuestion(newQuestion);
                setTitle('');
                setText('');
                setTags('');
                setUsername('');
                setActiveView('questions');
                setActiveTab('questions');
            } catch (error) {
                logger.log('Error posting question:', error);
            }
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
