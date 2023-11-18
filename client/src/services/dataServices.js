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

export async function getQuestionsSortedByActive() {
    try {
        const response = await axios.get('http://localhost:8000/questions/sorted/active');
        return response.data;
    } catch (error) {
        console.error('Error fetching questions sorted by active:', error);
        return [];
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
    const baseURL = 'http://localhost:8000'; // Replace with your server URL

    for (const tagName of tags) {
        try {
            let tagResponse;

            try {
                tagResponse = await axios.get(`${baseURL}/tags/name/${tagName}`);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    tagResponse = await axios.post(`${baseURL}/tags`, { name: tagName });
                } else {
                    throw error;
                }
            }

            if (tagResponse.data && tagResponse.data.tid) {
                tagIds.push(tagResponse.data.tid);
            }
        } catch (error) {
            console.error('Error in mapTagsToIds:', error);
        }
    }

    console.log("maptags to ids - ",tagIds);

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




