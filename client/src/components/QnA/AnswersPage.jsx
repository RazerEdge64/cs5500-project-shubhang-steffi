import React, { useState, useEffect } from 'react';
import { getQuestionById, getAnswerById } from '../../services/dataServices.js';
import { formatDate } from '../../utils/utilities.js';
import logger from "../../logger/logger";

function AnswersPage({ questionId, setActiveView }) {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    // useEffect(() => {
    //     const fetchedQuestion = getQuestionById(questionId);
    //     setQuestion(fetchedQuestion);
    //
    //     const fetchedAnswers = fetchedQuestion.ansIds.map(id => getAnswerById(id));
    //     fetchedAnswers.sort((a, b) => b.ansDate - a.ansDate);
    //
    //     logger.log("Fetched answers for question " + questionId + ":" + JSON.stringify(fetchedAnswers));
    //
    //     setAnswers(fetchedAnswers);
    // }, [questionId]);
    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedQuestion = await getQuestionById(questionId);
                if (fetchedQuestion) {
                    setQuestion(fetchedQuestion);

                    const fetchedAnswersPromises = fetchedQuestion.ansIds.map(id => getAnswerById(id));
                    const fetchedAnswers = await Promise.all(fetchedAnswersPromises);
                    fetchedAnswers.sort((a, b) => b.ansDate - a.ansDate);

                    logger.log("Fetched answers for question " + questionId + ":" + JSON.stringify(fetchedAnswers));

                    setAnswers(fetchedAnswers);
                }
            } catch (error) {
                console.error('Error fetching question or answers:', error);
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
                        <h2>{question.ansIds?.length} answers</h2>
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
                            asked {formatDate(new Date(question.askDate))}
                        </p>
                    </div>
                </div>
            )}

            <div id="answersContainer">
                {answers?.map(answer => (
                    <div className="answer" key={answer.aid}>
                        <div className="answerText">

                            <div dangerouslySetInnerHTML={{ __html: processHyperlinks(answer.text) }} />
                        </div>
                        <div className="answerAuthor">
                            {answer.ansBy} <br /> answered on {formatDate(answer.ansDate)}
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