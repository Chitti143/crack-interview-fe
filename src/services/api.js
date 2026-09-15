const API_URL = 'http://localhost:5000/api';

export async function getTechnologies() {
    const res = await fetch(`${API_URL}/technologies`);
    return res.json();
}

export async function getQuestionsByTech(techId, sort = 'votes', difficulty = 'all', page = 1, limit = 100) {
    let url = `${API_URL}/questions?tech=${techId}&sort=${sort}&page=${page}&limit=${limit}`;
    if (difficulty && difficulty !== 'all') url += `&difficulty=${difficulty}`;
    const res = await fetch(url);
    return res.json();
}

export async function getQuestionById(id) {
    const res = await fetch(`${API_URL}/questions/${id}`);
    return res.json();
}

export async function searchQuestions(query) {
    const res = await fetch(`${API_URL}/questions/search/${query}`);
    return res.json();
}

export async function submitAnswer(questionId, body, postedBy) {
    const res = await fetch(`${API_URL}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, body, postedBy })
    });
    return res.json();
}

export async function likeAnswer(answerId, username) {
    const res = await fetch(`${API_URL}/answers/${answerId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    return res.json();
}

export async function unlikeAnswer(answerId, username) {
    const res = await fetch(`${API_URL}/answers/${answerId}/like`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    return res.json();
}

export async function submitQuestion(question) {
    const res = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
    });
    return res.json();
}

export async function getUserProfile(username) {
    const res = await fetch(`${API_URL}/users/${username}`);
    return res.json();
}