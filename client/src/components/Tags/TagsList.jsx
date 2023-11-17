import React, {useState, useEffect} from 'react';
import {getAllTags, getQuestionCountForTag} from '../../services/dataServices.js';

function TagsList({onTagClick, setActiveView}) {
    const [tags, setTags] = useState([]);
    // const [questions, setQuestions] = useState([]);
    const [tagQuestionsCount, setTagQuestionsCount] = useState({});


    useEffect(() => {
        async function fetchData() {
            const fetchedTags = await getAllTags();
            setTags(fetchedTags);

            const counts = {};
            for (const tag of fetchedTags) {
                console.log("tags list",tag);
                counts[tag.name] = await getQuestionCountForTag(tag.tid);
            }

            setTagQuestionsCount(counts);
        }

        fetchData();
    }, []);

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
                        <div>{tagQuestionsCount[tag.name]} questions</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TagsList;