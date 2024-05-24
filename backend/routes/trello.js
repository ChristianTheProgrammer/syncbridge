// routes/trello.js
const express = require('express');
const { getBoards, getBoardLists, getListCards } = require('../services/trelloService');
const router = express.Router();

// Route to get all Trello boards
router.get('/boards', async (req, res) => {
    try {
        const boards = await getBoards();
        res.json(boards);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get all lists in a Trello board
router.get('/boards/:boardId/lists', async (req, res) => {
    try {
        const lists = await getBoardLists(req.params.boardId);
        res.json(lists);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get all cards in a Trello list
router.get('/lists/:listId/cards', async (req, res) => {
    try {
        const cards = await getListCards(req.params.listId);
        res.json(cards);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
