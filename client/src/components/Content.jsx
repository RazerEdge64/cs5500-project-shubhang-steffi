import QuestionsList from './QnA/QuestionsList';
import TagsList from './Tags/TagsList';
import AnswersPage from './QnA/AnswersPage';
import AskQuestionForm from './QnA/AskQuestionForm';
import AnswerQuestionForm from './QnA/AnswerQuestionForm';
import {getQuestionById} from '../services/dataServices';

/**
 * This is the method which is responsible for loading all the main content on the screen.
 * @param activeView    This state is used to update the active class in the sidebar.
 * @param setActiveView This method is used to set the current active state.
 * @param searchString  This state is used to check if there is a search text in the search bar.
 * @param setSearchString   This method is used to set the searchString value.
 * @returns {JSX.Element}   Returns the main content based on the constraints.
 * @constructor
 */
function Content({
                     activeView,
                     setActiveView,
                     setActiveTab,
                     searchString,
                     handleTagClick,
                     handleQuestionClick,
                     handleNewAnswer,
                     selectedQuestionId,
                     answers,
                     currentQuestion,
                     setCurrentQuestion
                 }) {
    return (
        <div className="content">
            {activeView === 'questions' &&
                <QuestionsList
                    searchString={searchString}
                    onQuestionClick={handleQuestionClick}
                    setActiveView={setActiveView}
                />
            }
            {activeView === 'tags' &&
                <TagsList
                    onTagClick={handleTagClick}
                    searchString = {searchString}
                    setActiveView={setActiveView}
                />
            }
            {activeView === 'askQuestion' &&
                <AskQuestionForm
                    setActiveView={setActiveView}
                    setActiveTab={setActiveTab}

                />}
            {activeView === 'answers' && (
                <AnswersPage
                    questionId={selectedQuestionId}
                    answers={answers}
                    setActiveView={(view) => {
                        if (view === 'answerForm') {
                            const question = getQuestionById(selectedQuestionId);
                            setCurrentQuestion(question);
                        }
                        setActiveView(view);
                    }}
                />
            )}
            {activeView === 'answerForm' && (
                <AnswerQuestionForm
                    currentQuestion={currentQuestion}
                    onAnswerSubmit={handleNewAnswer}
                />
            )}
        </div>
    );
}

export default Content;
