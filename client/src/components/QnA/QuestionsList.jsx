import React, { useState, useEffect } from 'react';
import {getAllQuestions, getTagById, getAnswerById} from '../../services/dataServices.js';
import { formatDate } from '../../utils/utilities.js';
import logger from "../../logger/logger";

function QuestionsList({ onQuestionClick, searchString, setActiveView }) {

    const [questions, setQuestions] = useState([]);
    const [sortType, setSortType] = useState('newest');

    const headerName = searchString ? "Search Results" : "All Questions";

    logger.log("searchString " + searchString);


    useEffect(() => {
        displayQuestions(sortType);
    }, [sortType]);

    useEffect(() => {
        logger.log("searchString changed: "+ searchString);

        if (searchString) {
            searchAndDisplayQuestions(searchString);
        } else {
            displayQuestions(sortType);
        }
    }, [searchString]);

    function handleQuestionClick(question) {
        question.views++;

        const updatedQuestions = questions.map(q => {
            if (q.qid === question.qid) {
                return question;
            }
            return q;
        });
        setQuestions(updatedQuestions);

        if (onQuestionClick) {
            onQuestionClick(question.qid);
        }
    }



    function createQuestionElement(question) {
        return (
            <div className="question" key={question.qid}>
                <div className="postStats">
                    <span>{question.ansIds.length} answers</span>
                    <span>{question.views} views</span>
                </div>
                <div className="postTitleContainer">
                    <div className="postName">
                        <div className="postTitle">
                            <a href="#" data-qid={question.qid} onClick={() => handleQuestionClick(question)}>{question.title}</a>

                        </div>
                    </div>
                    <div className="postTags">
                        {question.tagIds.map(tagId => {
                            const tag = getTagById(tagId);
                            return <span key={tagId}>{tag.name}</span>;
                        })}
                    </div>
                </div>
                <div className="lastActivity">
                    <span>{question.askedBy}</span>&nbsp;asked {formatDate(question.askDate)}
                </div>
            </div>
        );
    }



    function displayQuestions(sortType) {
        getAllQuestions().then(allQuestions => {
            let sortedQuestions = [...allQuestions];

            switch (sortType) {
                case 'newest':
                    sortedQuestions.sort((a, b) => b.askDate - a.askDate);
                    break;
                case 'active':
                    sortedQuestions.sort((a, b) => {
                        const lastAnswerA = a.ansIds.map(id => getAnswerById(id)).sort((a, b) => b.ansDate - a.ansDate)[0] || {ansDate: a.askDate};
                        const lastAnswerB = b.ansIds.map(id => getAnswerById(id)).sort((a, b) => b.ansDate - a.ansDate)[0] || {ansDate: b.askDate};
                        return lastAnswerB.ansDate - lastAnswerA.ansDate;
                    });
                    break;

                case 'unanswered':
                    sortedQuestions = sortedQuestions.filter(q => q.ansIds.length === 0);
                    break;

            }
            setQuestions(sortedQuestions);

        }).catch(error => {
            console.error('Error in displayQuestions: ', error);
        });
    }

    function searchAndDisplayQuestions(searchString) {
        const tags = searchString.match(/\[([^\]]+)\]/g) || [];
        const words = searchString.replace(/\[([^\]]+)\]/g, '').trim().split(/\s+/).filter(word => word);

        const filteredQuestions = getAllQuestions().filter(question => {
            const hasMatchingTag = tags.some(tag => {
                const tagName = tag.slice(1, -1).toLowerCase();
                return question.tagIds.some(tagId => getTagById(tagId).name.toLowerCase() === tagName);
            });

            const hasMatchingWord = words.some(word =>
                question.title.toLowerCase().includes(word.toLowerCase()) ||
                question.text.toLowerCase().includes(word.toLowerCase())
            );

            return hasMatchingTag || hasMatchingWord;
        });

        const sortedQuestions = filteredQuestions.sort((a, b) => new Date(b.askDate) - new Date(a.askDate));

        setQuestions(sortedQuestions);
    }

    return (
        <div>
            <div className="header">
                <div className="header-first-row">
                    <h2>{headerName}</h2>

                    <div>
                        {/*<button className="blue-button" id="askQuestionBtn">Ask a Question</button>*/}
                        <button className="blue-button" id="askQuestionBtn" onClick={() => setActiveView('askQuestion')}>Ask a Question</button>

                    </div>
                </div>

                <div className="header-second-row">
                    <p><span id="totalQuestions">{questions.length}</span> questions</p>
                    <div className="buttons">
                        <button onClick={() => setSortType('newest')}>Newest</button>
                        <button onClick={() => setSortType('active')}>Active</button>
                        <button onClick={() => setSortType('unanswered')}>Unanswered</button>
                    </div>
                </div>
            </div>

            <div className="questions">
                {questions.length > 0 ? (
                    questions.map(question => createQuestionElement(question))
                ) : (
                    <div className="no-questions-found">No Questions Found.</div>
                )}
            </div>
        </div>
    );

}

export default QuestionsList;
