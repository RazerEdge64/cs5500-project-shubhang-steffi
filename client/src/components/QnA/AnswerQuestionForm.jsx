import React, { useState } from 'react';
import logger from "../../logger/logger";

function AnswerQuestionForm({ onAnswerSubmit }) {
    const [username, setUsername] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [textError, setTextError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        logger.log('Answer question submit button clicked');

        let valid = true;

        if (!username.trim()) {
            valid = false;
            setUsernameError('Username cannot be empty');
        } else {
            setUsernameError('');
        }

        if (!answerText.trim()) {
            valid = false;
            setTextError('Answer text cannot be empty');
        } else {
            const hyperlinkRegex = /\[([^\]]+)\]\((https:\/\/[^)]+)\)/g;
            let match;
            let invalidLinkFound = false;

            while ((match = hyperlinkRegex.exec(answerText)) !== null) {
                if (match[1].trim() === '' || match[2].trim() === '') {
                    invalidLinkFound = true;
                    break;
                }
            }

            if (invalidLinkFound || (answerText.includes('[') && !hyperlinkRegex.test(answerText))) {
                valid = false;
                setTextError('Invalid hyperlink');
            } else {
                setTextError('');
            }
        }


        if (valid) {
            const newAnswer = {
                text: answerText,
                ans_by: username,
                ans_date_time: new Date()
            };

            onAnswerSubmit(newAnswer)
                .then(() => {
                    setUsername('');
                    setAnswerText('');
                })
                .catch(error => {
                    console.error('Error submitting answer:', error);
                });

        }
    };


    return (
        <div className="ask-question-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h3>Username*</h3>
                    <input 
                        type="text" 
                        id="answerUsernameInput" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <div className="error-message">{usernameError}</div>
                </div>
                <div className="form-group">
                    <h3>Answer Text*</h3>
                    <input 
                        type="text" 
                        id="answerTextInput" 
                        value={answerText} 
                        onChange={(e) => setAnswerText(e.target.value)} 
                    />
                    <div className="error-message">{textError}</div>
                </div>
                <button type="submit" className="blue-button">Post Answer</button>
            </form>
        </div>
    );
}

export default AnswerQuestionForm;
