import axios from "axios";

// Questions
export async function getAllQuestions() {
    try {
        const response = await axios.get('http://localhost:8000/questions');
        return response.data;
    } catch (error) {
        console.error('Error fetching questions: ', error);
        return [];
    }
}

export async function getQuestionById(qid) {
    try {
        const response = await axios.get(`http://localhost:8000/questions/${qid}`);
        const data = response.data;

        // Assuming the response structure is { question: {...}, answerCount: number }
        return data.question ? {
            ...data.question,
            answerCount: data.answerCount
        } : null;
    } catch (error) {
        console.error('Error fetching question by ID: ', error);
        return null;
    }
}

export async function addQuestion(question) {
    console.log("dataservices question - ",question);
    try {
        console.log(question);
        const response = await axios.post('http://localhost:8000/questions', question);
        return response.data;
    } catch (error) {
        console.error('Error adding question: ', error);
    }
}

export async function incrementQuestionViews(qid) {
    try {
        await axios.post(`http://localhost:8000/questions/increment-views/${qid}`);
        console.log("Views incremented for question:", qid);
    } catch (error) {
        console.error('Error incrementing views:', error);
    }
}


// Tags
export async function getAllTags() {
    try {
        const response = await axios.get('http://localhost:8000/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching all tags: ', error);
        return [];
    }
}


export async function getTagById(id) {
    try {
        const response = await axios.get(`http://localhost:8000/tags/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tag by ID: ', error);
        return null;
    }
}

export async function mapTagsToIds(tags) {
    const tagIds = [];

    for (const tagName of tags) {
        console.log("mapTagsToIds tagname - ",tagName);
        try {
            // Checking if the tag exists
            let response;
            try {
                response = await axios.get(`/tags/name/${tagName}`);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("tag doesn't exist, creating new one");
                    response = await axios.post('http://localhost:8000/tags', { name: tagName });

                } else {
                    console.log(error);
                }
            }

            const tag = response.data;
            tagIds.push(tag.tid);
        } catch (error) {
            console.error('Error in mapTagsToIds: ', error);
        }
    }
    return tagIds;
}

export async function getQuestionCountForTag(tagId) {
    try {
        const response = await axios.get(`http://localhost:8000/tags/${tagId}/questions/count`);
        return response.data.count;
    } catch (error) {
        console.error('Error fetching question count for tag: ', error);
        return 0;
    }
}


// Answers

/**
 * This method is used to add an answer to the respective question.
 * @param answer represents the new answer.
 * @param currentQuestion   represents the question to which the answer is being added to.
 */
export async function addAnswer(answer, currentQuestion) {

    console.log("from addanswer - ",currentQuestion);
    try {
        const response = await axios.post(`http://localhost:8000/answers/add/${currentQuestion._id}`, answer);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error adding answer: ', error);
        return null;
    }
}

export async function getAnswerById(aid) {
    try {
        const response = await axios.get(`http://localhost:8000/answers/${aid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching answer by ID: ', error);
        return null;
    }
}




