// services/trelloService.js
const Trello = require('node-trello');

const trello = new Trello('your-api-key', 'your-oauth-token');

const getBoards = async () => {
    return new Promise((resolve, reject) => {
        trello.get('/1/members/me/boards', (err, boards) => {
            if (err) reject(err);
            resolve(boards);
        });
    });
};

const getBoardLists = async (boardId) => {
    return new Promise((resolve, reject) => {
        trello.get(`/1/boards/${boardId}/lists`, (err, lists) => {
            if (err) reject(err);
            resolve(lists);
        });
    });
};

const getListCards = async (listId) => {
    return new Promise((resolve, reject) => {
        trello.get(`/1/lists/${listId}/cards`, (err, cards) => {
            if (err) reject(err);
            resolve(cards);
        });
    });
};

module.exports = {
    getBoards,
    getBoardLists,
    getListCards,
};
