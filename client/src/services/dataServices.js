// import data from '../models/model.js';
import logger from '../logger/logger.js';
import axios from "axios";

export async function getAllQuestions() {
    try {
        const response = await axios.get('http://localhost:8000/questions');
        return response.data;
    } catch (error) {
        console.error('Error fetching questions: ', error);
        return [];
    }
}


// export function getQuestionById(qid) {
//     // logger.log("Fetching questions by the id " + qid);
//     return data.questions.find(question => question.qid === qid);
// }

export async function getQuestionById(qid) {
    try {
        const response = await axios.get(`http://localhost:8000/questions/${qid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question by ID: ', error);
        return null;
    }
}


// export function getAllAnswers() {
//     // logger.log("Fetching all the answers");
//     return data.answers;
// }
export async function getAllAnswers() {
    try {
        const response = await axios.get('http://localhost:8000/answers');
        return response.data;
    } catch (error) {
        console.error('Error fetching all answers: ', error);
        return [];
    }
}

// export function getAllTags() {
//     // logger.log("Fetching all the tags");
//     return data.tags;
// }
export async function getAllTags() {
    try {
        const response = await axios.get('http://localhost:8000/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching all tags: ', error);
        return [];
    }
}

// export function getAnswerById(aid) {
//     // logger.log("Fetching the answer by the id - "+ aid);
//     return data.answers.find(ans => ans.aid === aid);
// }
export async function getAnswerById(aid) {
    try {
        const response = await axios.get(`http://localhost:8000/answers/${aid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching answer by ID: ', error);
        return null;
    }
}


// export function getTagById(id) {
//     // logger.log("Fetching tag by the id - "+ id);
//     return data.tags.find(t => t.tid === id);
// }

export async function getTagById(id) {
    try {
        const response = await axios.get(`http://localhost:8000/tags/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tag by ID: ', error);
        return null;
    }
}


// export function getTagByName(tagName) {
//     // logger.log("Fetching tag by the name - "+ tagName);
//     return data.tags.find(tag => tag.name === tagName);
// }
export async function getTagByName(tagName) {
    try {
        const response = await axios.get(`http://localhost:8000/tags/name/${tagName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tag by name: ', error);
        return null;
    }
}


// Creating
// export function addQuestion(question) {
//     logger.log("Adding Question - " + JSON.stringify(question));
//     data.questions.push(question);
// }
export async function addQuestion(question) {
    console.log(question);
    try {
        console.log(question);
        const response = await axios.post('http://localhost:8000/questions', question);
        return response.data;
    } catch (error) {
        console.error('Error adding question: ', error);
    }
}

/**
 * This method is used to map all tag names from a question to their respective ids.
 * @param tags  represents the tag names.
 * @returns {*[]}   returns a list of tag ids.
 */
export function mapTagsToIds(tags) {
    const tagIds = [];

    tags.forEach(tagName => {

        const existingTag = getTagByName(tagName);

        if (existingTag) {

            tagIds.push(existingTag.tid);
        } else {
            const newTagId = 't' + (getAllTags().length + 1);
            getAllTags().push({
                tid: newTagId,
                name: tagName
            });
            tagIds.push(newTagId);
        }
    });

    return tagIds;

}

/**
 * This method is used to add an answer to the respective question.
 * @param answer represents the new answer.
 * @param currentQuestion   represents the question to which the answer is being added to.
 */
// export function addAnswer(answer, currentQuestion) {
//     data.answers.push(answer);
//
//     // logger.log("Current Question - " + JSON.stringify(currentQuestion));
//
//     const question = getQuestionById(currentQuestion.qid);
//     if (question) {
//         logger.log("Question is present");
//         question.ansIds.push(answer.aid);
//     }
// }
export async function addAnswer(answer, currentQuestion) {
    try {
        const response = await axios.post(`http://localhost:8000/answers/add/${currentQuestion.qid}`, answer);
        return response.data;
    } catch (error) {
        console.error('Error adding answer: ', error);
        return null;
    }
}