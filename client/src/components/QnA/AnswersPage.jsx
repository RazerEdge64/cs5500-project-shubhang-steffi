import React, { useState, useEffect } from 'react';
import { getQuestionById } from '../../services/dataServices.js';
import { formatDate } from '../../utils/utilities.js';
import logger from "../../logger/logger";

function AnswersPage({ questionId, setActiveView }) {
    logger.log("questionID - ",questionId);
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        logger.log(answers);
    }, [answers]);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedQuestion = await getQuestionById(questionId);
                logger.log(fetchedQuestion);
                if (fetchedQuestion) {
                    setQuestion(fetchedQuestion);

                    if (fetchedQuestion.answers && fetchedQuestion.answers.length > 0) {
                        const sortedAnswers = fetchedQuestion.answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
                        setAnswers(sortedAnswers);
                    }

                    logger.log("Fetched answers for question " + questionId + ":" + JSON.stringify(fetchedQuestion.answers));
                }
            } catch (error) {
                logger.log('Error fetching question or answers:', error);
            }
        }

        fetchData();
    }, [questionId]);


    const handleAnswerClick = () => {
        setActiveView('answerForm');
    };

    const processHyperlinks = (text) => {
        const regex = /\[([^\]]+)\]\((https:\/\/[^)]+)\)/g;
        return text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    };


    return (
        <div className="answers-page">
            {question && (
                <div id="answersHeader" className="header">
                    <div>
                        <h2>{question.answerCount} answers</h2>
                    </div>
                    <div>
                        <h3>{question.title}</h3>
                    </div>
                    <div>
                        <button className="blue-button" id="askQuestionBtn" onClick={() => setActiveView('askQuestion')}>Ask a Question</button>
                    </div>
                </div>
            )}

            {question && (
                <div id="questionBody">
                    <div>
                        <p>{question.views} views</p>
                    </div>
                    <div>
                        <p dangerouslySetInnerHTML={{ __html: processHyperlinks(question.text) }} />
                    </div>
                    <div className="lastActivity">
                        <p>
                            <span>{question.askedBy}</span><br />
                            asked {formatDate(new Date(question.ask_date_time))}
                        </p>
                    </div>
                </div>
            )}

            <div id="answersContainer">
                {answers && answers.map(answer => (
                    <div className="answer" key={answer.aid}>
                        <div className="answerText">

                            <div dangerouslySetInnerHTML={{ __html: processHyperlinks(answer.text) }} />
                        </div>
                        <div className="answerAuthor">
                            {answer.ans_by} <br /> answered on {formatDate(answer.ans_date_time)}
                        </div>
                    </div>
                ))}
                {answers && answers.length === 0 && <p>No answers available.</p>}
                <button className="blue-button" id="answerQuestionBtn" style={{ marginTop: '20px' }} onClick={handleAnswerClick}>
                    Answer Question
                </button>

            </div>
        </div>
    );
}

export default AnswersPage;
