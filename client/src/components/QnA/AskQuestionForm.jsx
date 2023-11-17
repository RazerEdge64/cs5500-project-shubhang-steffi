import React, { useState } from 'react';
import { addQuestion, mapTagsToIds } from '../../services/dataServices.js';
import logger from "../../logger/logger";

function AskQuestionForm({ setActiveView, setActiveTab }) {
    // Use React state for form fields
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [username, setUsername] = useState('');

    // Use React state for error messages
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

        if (!text) {
            setTextError('Question text cannot be empty');
            isValid = false;
        } else if (text.includes('](http')) {
            setTextError('Invalid hyperlink in the question text');
            isValid = false;
        }

        const tagsArray = tags.split(' ').filter(tag => tag); // Filter out empty strings
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
                const mappedTagIds = await mapTagsToIds(tagsArray); // Ensure this function is async
                const newQuestion = {
                    title: title,           // Collected from form
                    text: text,             // Collected from form
                    tags: mappedTagIds,     // Result from mapTagsToIds function
                    answers: [],            // Assuming no answers at the time of creation
                    asked_by: username,     // Collected from form
                    ask_date_time: new Date(),
                    views: 0  
                };

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
                // Display a generic error message or specific based on error content
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
