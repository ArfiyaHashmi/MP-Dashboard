import express from 'express';
import auth from '../middleware/authMiddleware.js';
import Board from '../models/board.js';

const router = express.Router();

// @route   GET api/boards
// @desc    Get all user's boards
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let boardData = await Board.findOne({ user: req.user.id });

    if (!boardData) {
      return res.json([]);
    }

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/boards
// @desc    Update all boards for a user
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const { boards } = req.body;

    let boardData = await Board.findOne({ user: req.user.id });

    if (boardData) {
      boardData = await Board.findOneAndUpdate(
        { user: req.user.id },
        { $set: { boards: boards } },
        { new: true }
      );
    } else {
      boardData = new Board({
        user: req.user.id,
        boards: boards,
      });
      await boardData.save();
    }

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/boards
// @desc    Add a new board
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { board } = req.body;

    let boardData = await Board.findOne({ user: req.user.id });

    if (boardData) {
      boardData.boards.push(board);
      await boardData.save();
    } else {
      boardData = new Board({
        user: req.user.id,
        boards: [board],
      });
      await boardData.save();
    }

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/boards/:id
// @desc    Delete a board
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
      const board = await Board.findById(req.params.id);
  
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
  
      // Optional: Check if the current user is the owner
      if (board.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this board' });
      }
  
      await board.deleteOne();
  
      res.status(200).json({ message: 'Board deleted successfully' });
    } catch (error) {
      console.error('Delete board error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

// @route   POST api/boards/:id/cards
// @desc    Add a card to a board
// @access  Private
router.post('/:id/cards', auth, async (req, res) => {
  try {
    const { card } = req.body;

    let boardData = await Board.findOne({ user: req.user.id });

    if (!boardData) {
      return res.status(404).json({ msg: 'Boards not found' });
    }

    const boardIndex = boardData.boards.findIndex(
      (board) => board.id === req.params.id
    );

    if (boardIndex === -1) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    boardData.boards[boardIndex].cards.push(card);
    await boardData.save();

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/boards/:bid/cards/:cid
// @desc    Delete a card from a board
// @access  Private
router.delete('/:bid/cards/:cid', auth, async (req, res) => {
  try {
    let boardData = await Board.findOne({ user: req.user.id });

    if (!boardData) {
      return res.status(404).json({ msg: 'Boards not found' });
    }

    const boardIndex = boardData.boards.findIndex(
      (board) => board.id === req.params.bid
    );

    if (boardIndex === -1) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    boardData.boards[boardIndex].cards = boardData.boards[
      boardIndex
    ].cards.filter((card) => card.id !== req.params.cid);
    await boardData.save();

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/boards/:bid/cards/:cid
// @desc    Update a card
// @access  Private
router.put('/:bid/cards/:cid', auth, async (req, res) => {
  try {
    const { card } = req.body;

    let boardData = await Board.findOne({ user: req.user.id });

    if (!boardData) {
      return res.status(404).json({ msg: 'Boards not found' });
    }

    const boardIndex = boardData.boards.findIndex(
      (board) => board.id === req.params.bid
    );

    if (boardIndex === -1) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    const cardIndex = boardData.boards[boardIndex].cards.findIndex(
      (c) => c.id === req.params.cid
    );

    if (cardIndex === -1) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    boardData.boards[boardIndex].cards[cardIndex] = card;
    await boardData.save();

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/boards/drag
// @desc    Handle drag and drop of cards
// @access  Private
router.put('/drag', auth, async (req, res) => {
  try {
    const { sourceBoard, targetBoard, cardId, newPosition } = req.body;

    let boardData = await Board.findOne({ user: req.user.id });

    if (!boardData) {
      return res.status(404).json({ msg: 'Boards not found' });
    }

    const sourceBoardIndex = boardData.boards.findIndex(
      (board) => board.id === sourceBoard
    );
    if (sourceBoardIndex === -1) {
      return res.status(404).json({ msg: 'Source board not found' });
    }

    const targetBoardIndex = boardData.boards.findIndex(
      (board) => board.id === targetBoard
    );
    if (targetBoardIndex === -1) {
      return res.status(404).json({ msg: 'Target board not found' });
    }

    const cardIndex = boardData.boards[sourceBoardIndex].cards.findIndex(
      (card) => card.id === cardId
    );
    if (cardIndex === -1) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    const [movedCard] = boardData.boards[sourceBoardIndex].cards.splice(
      cardIndex,
      1
    );

    boardData.boards[targetBoardIndex].cards.splice(newPosition, 0, movedCard);

    await boardData.save();

    res.json(boardData.boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;