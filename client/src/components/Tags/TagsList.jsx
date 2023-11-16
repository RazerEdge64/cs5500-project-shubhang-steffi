// import React, {useState, useEffect} from 'react';
// import {getAllQuestions, getAllTags, getTagById} from '../../services/dataServices.js';
//
// function TagsList({onTagClick, setActiveView}) {
//     const [tags, setTags] = useState([]);
//
//     useEffect(async () => {
//         const allTags = getAllTags();
//         setTags(await allTags);
//     }, []);
//
//     return (
//         <div>
//             <div className="header" style={{flexDirection: 'row'}}>
//                 <div>
//                     <h2>{tags.length} Tags</h2>
//                 </div>
//                 <div>
//                     <h3>All Tags</h3>
//                 </div>
//                 <div>
//                     <button className="blue-button" id="askQuestionBtn" onClick={() => setActiveView('askQuestion')}>Ask a Question</button>
//
//                 </div>
//             </div>
//             <div className="tags-grid">
//                 {tags.map(tag => {
//                     const questionsWithTag = getAllQuestions().filter(question =>
//                         question.tagIds.some(tagId => getTagById(tagId).name === tag.name)
//                     );
//                     return (
//                         <div className="tagNode tag-card" key={tag.tid}>
//                             <a href="#" onClick={() => onTagClick(tag.name)}>{tag.name}</a>
//                             <div>{questionsWithTag.length} questions</div>
//                         </div>
//                     );
//                 })}
//             </div>
//
//         </div>
//     );
// }
//
//
// export default TagsList;

import React, {useState, useEffect} from 'react';
import {getAllQuestions, getAllTags, getTagById} from '../../services/dataServices.js';

function TagsList({onTagClick, setActiveView}) {
    const [tags, setTags] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const fetchedTags = await getAllTags();
            setTags(fetchedTags);
            const fetchedQuestions = await getAllQuestions();
            setQuestions(fetchedQuestions);
        }

        fetchData();
    }, []);

    const getQuestionsCountForTag = (tagName) => {
        return questions.filter(question =>
            question.tagIds.some(async tagId => {
                const tag = await getTagById(tagId);
                return tag.name === tagName;
            })
        ).length;
    };

    return (
        <div>
            <div className="header" style={{flexDirection: 'row'}}>
                <div>
                    <h2>{tags.length} Tags</h2>
                </div>
                <div>
                    <h3>All Tags</h3>
                </div>
                <div>
                    <button className="blue-button" id="askQuestionBtn" onClick={() => setActiveView('askQuestion')}>Ask
                        a Question
                    </button>
                </div>
            </div>
            <div className="tags-grid">
                {tags.map(tag => (
                    <div className="tagNode tag-card" key={tag.tid}>
                        <a href="#" onClick={() => onTagClick(tag.name)}>{tag.name}</a>
                        <div>{getQuestionsCountForTag(tag.name)} questions</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TagsList;