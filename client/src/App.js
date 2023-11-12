import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Content from './components/Content.jsx';
import './stylesheets/index.css';
import './stylesheets/custom-buttons.css';
import './stylesheets/questions.css';
import './stylesheets/askQuestion.css';
import './stylesheets/cards.css';
import './stylesheets/answers.css';
import { addAnswer } from './services/dataServices';
import logger from "./logger/logger";

function App() {
    const [activeView, setActiveView] = useState('questions');
    const [activeTab, setActiveTab] = useState('questions');
    const [searchString, setSearchString] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    const handleTagClick = (tagName) => {
        logger.log("clicked the tag - " + tagName);
        setSearchString(`[${tagName}]`);
        setActiveView('questions');
        setActiveTab('questions');
    };

    const handleQuestionClick = (questionId) => {
        logger.log("Question clicked - " + questionId);
        setSelectedQuestionId(questionId);
        setActiveView('answers');
    };

    const handleNewAnswer = (newAnswer) => {
        logger.log('Handling new answer:'+ newAnswer);
        addAnswer(newAnswer, currentQuestion);
        setAnswers([...answers, newAnswer]);
        setActiveView('answers');
    };

    const handleSidebarClick = (view) => {
        logger.log("Handling the sidebar click " + view);
        setActiveView(view);
        setActiveTab(view);
    };

    const handleSearchEnter = () => {
        setActiveView('questions');
        setActiveTab('questions');
    };

    return (
        <div className="main">
            <Header
                searchString={searchString}
                setSearchString={setSearchString}
                onSearchEnter={handleSearchEnter}
            />
            <div className="contentWrapper">
                <Sidebar activeTab={activeTab} onSidebarClick={handleSidebarClick} />
                <Content
                    activeView={activeView}
                    setActiveView={setActiveView}
                    setActiveTab={setActiveTab}
                    searchString={searchString}
                    handleTagClick={handleTagClick}
                    handleQuestionClick={handleQuestionClick}
                    handleNewAnswer={handleNewAnswer}
                    selectedQuestionId={selectedQuestionId}
                    answers={answers}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion = {setCurrentQuestion}
                />
            </div>
        </div>
    );
}

export default App;
