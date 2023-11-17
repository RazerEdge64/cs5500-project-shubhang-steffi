import React, { useState, useEffect } from 'react';
import {getAllQuestions, getTagById, getAnswerById, incrementQuestionViews, getAllTags} from '../../services/dataServices.js';
import { formatDate } from '../../utils/utilities.js';
import logger from "../../logger/logger";

function QuestionsList({ onQuestionClick, searchString, setActiveView }) {

    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [sortType, setSortType] = useState('newest');

    const headerName = searchString ? "Search Results" : "All Questions";

    logger.log("searchString " + searchString);


    useEffect(() => {
        async function fetchData() {
            const fetchedTags = await getAllTags();
            setTags(fetchedTags);
            await displayQuestions(sortType);
        }

        fetchData();
    }, [sortType]);


    useEffect(() => {
        logger.log("searchString changed: "+ searchString);

        if (searchString) {
            searchAndDisplayQuestions(searchString);
        } else {
            displayQuestions(sortType);
        }
    }, [searchString, tags]);

    // function handleQuestionClick(question) {
    //
    //     console.log("handle Question");
    //     question.views++;
    //
    //     const updatedQuestions = questions.map(q => {
    //         if (q.qid === question.qid) {
    //             return question;
    //         }
    //         return q;
    //     });
    //     setQuestions(updatedQuestions);
    //
    //     if (onQuestionClick) {
    //         onQuestionClick(question.qid);
    //     }
    // }
    // async function handleQuestionClick(question) {
    //     // ... existing code for handling question click ...
    //
    //     try {
    //         // Call the API to increment the question views
    //         await axios.post(`http://localhost:8000/questions/increment-views/${question.qid}`);
    //         console.log("Views incremented for question:", question.qid);
    //
    //         // Optionally, update the UI to reflect the new view count
    //         // This could involve re-fetching the question data or incrementing the view count in the state
    //     } catch (error) {
    //         console.error('Error incrementing views:', error);
    //     }
    // }
    async function handleQuestionClick(question) {
        console.log("handle Question");

        // Call the function to increment views
        await incrementQuestionViews(question.qid);

        // Update the local state to reflect the new view count
        const updatedQuestions = questions.map(q => {
            if (q.qid === question.qid) {
                return { ...question, views: question.views + 1 };
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
                            const tag = tags.find(t => t.tid === tagId);
                            return tag ? <span key={tagId}>{tag.name}</span> : null;
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
            console.log("From Q Lists - ",allQuestions);
            switch (sortType) {
                case 'newest':
                    sortedQuestions.sort((a, b) => new Date(b.askDate) - new Date(a.askDate));
                    break;
                case 'active':
                    sortedQuestions.sort((a, b) => {
                        const lastAnswerA = a.ansIds.map(id => getAnswerById(id)).sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate))[0] || {ansDate: new Date(a.askDate)};
                        const lastAnswerB = b.ansIds.map(id => getAnswerById(id)).sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate))[0] || {ansDate: new Date(b.askDate)};
                        return new Date(lastAnswerB.ansDate) - new Date(lastAnswerA.ansDate);
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
    // async function displayQuestions(sortType) {
    //     try {
    //         const allQuestions = await getAllQuestions();
    //         let sortedQuestions = [...allQuestions];
    //
    //         if (sortType === 'active') {
    //             // const questionAnswerMap = await mapQuestionsToLatestAnswers(allQuestions);
    //             // sortedQuestions.sort((a, b) => {
    //             //     const lastAnswerDateA = questionAnswerMap.get(a.id) || new Date(a.askDate);
    //             //     const lastAnswerDateB = questionAnswerMap.get(b.id) || new Date(b.askDate);
    //             //     return new Date(lastAnswerDateB) - new Date(lastAnswerDateA);
    //             // });
    //
    //             // const questionAnswerMap = await mapQuestionsToLatestAnswerDates(allQuestions);
    //             // sortedQuestions.sort((a, b) => questionAnswerMap.get(b.id) - questionAnswerMap.get(a.id));
    //
    //             // const questionAnswerMap = await mapQuestionsToLatestAnswerDates(allQuestions);
    //             // sortedQuestions.sort((a, b) => {
    //             //     const aDate = questionAnswerMap.get(a.id) || new Date(a.askDate);
    //             //     const bDate = questionAnswerMap.get(b.id) || new Date(b.askDate);
    //             //     return bDate - aDate;
    //             // });
    //
    //         } else if (sortType === 'newest') {
    //             sortedQuestions.sort((a, b) => new Date(b.askDate) - new Date(a.askDate));
    //         } else if (sortType === 'unanswered') {
    //             sortedQuestions = sortedQuestions.filter(q => q.ansIds.length === 0);
    //         }
    //
    //         setQuestions(sortedQuestions);
    //
    //     } catch (error) {
    //         console.error('Error in displayQuestions: ', error);
    //     }
    // }

    // async function mapQuestionsToLatestAnswers(questions) {
    //     const latestAnswersPromises = questions.map(async question => {
    //         const answers = await Promise.all(question.ansIds.map(getAnswerById));
    //         return {
    //             questionId: question.id,
    //             latestAnswer: answers.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate))[0]
    //         };
    //     });
    //
    //     const latestAnswers = await Promise.all(latestAnswersPromises);
    //     const questionAnswerMap = new Map();
    //     latestAnswers.forEach(item => {
    //         questionAnswerMap.set(item.questionId, item.latestAnswer ? new Date(item.latestAnswer.ansDate) : null);
    //     });
    //
    //     return questionAnswerMap;
    // }
    // async function mapQuestionsToLatestAnswerDates(questions) {
    //     const questionAnswerMap = new Map();
    //
    //     for (const question of questions) {
    //         if (question.ansIds.length > 0) {
    //             const answerDates = await Promise.all(question.ansIds.map(async id => {
    //                 const answer = await getAnswerById(id);
    //                 return new Date(answer.ansDate);
    //             }));
    //             const latestAnswerDate = new Date(Math.max(...answerDates));
    //             questionAnswerMap.set(question.id, latestAnswerDate);
    //         } else {
    //             // For questions without answers, we set a very old date to ensure they come after questions with answers
    //             questionAnswerMap.set(question.id, new Date(0)); // Date(0) represents 1970-01-01
    //         }
    //     }
    //
    //     return questionAnswerMap;
    // }




    async function searchAndDisplayQuestions(searchString) {
        const tags = searchString.match(/\[([^\]]+)\]/g) || [];
        const words = searchString.replace(/\[([^\]]+)\]/g, '').trim().split(/\s+/).filter(word => word);

        const allQuestions = await getAllQuestions();

        // Map each question to a promise that resolves to true or false
        const questionPromises = allQuestions.map(async question => {
            const hasMatchingTag = await Promise.all(tags.map(async tag => {
                const tagName = tag.slice(1, -1).toLowerCase();
                return Promise.all(question.tagIds.map(async tagId => {
                    const tag = await getTagById(tagId);
                    return tag.name.toLowerCase() === tagName;
                })).then(results => results.some(result => result));
            })).then(results => results.some(result => result));

            const hasMatchingWord = words.some(word =>
                question.title.toLowerCase().includes(word.toLowerCase()) ||
                question.text.toLowerCase().includes(word.toLowerCase())
            );

            return hasMatchingTag || hasMatchingWord;
        });

        // Wait for all promises to resolve and filter the questions
        const filteredQuestions = (await Promise.all(questionPromises))
            .map((matches, index) => matches ? allQuestions[index] : null)
            .filter(question => question !== null);

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
