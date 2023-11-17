import React, { useState } from 'react';
import {getAllAnswers} from "../../services/dataServices";
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
        } else if (answerText.includes('](http')) {
            valid = false;
            setTextError('Invalid hyperlink in the answer text');
        } else {
            const regex = /\s*\[([^\]]+)\]\s*\(\s*([^)]+)\s*\)/g;
            const matches = answerText.match(regex);

            let invalidLinkFound = false;

            if (matches) {
                for (const match of matches) {
                    const linkText = match.match(/\[([^\]]+)\]/)[1];
                    const linkTarget = match.match(/\(([^)]+)\)/)[1];

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

        if (valid) {
            const newAnswer = {
                // aid: 'a' + (getAllAnswers().length + 1),
                text: answerText,
                ans_by: username,
                ans_date_time: new Date()
            };

            // onAnswerSubmit(newAnswer);
            //
            // setUsername('');
            // setAnswerText('');
            onAnswerSubmit(newAnswer)
                .then(() => {
                    // Handle successful submission
                    setUsername('');
                    setAnswerText('');
                    // Maybe show a success message or navigate to another page
                })
                .catch(error => {
                    // Handle errors
                    console.error('Error submitting answer:', error);
                    // Maybe show an error message
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
