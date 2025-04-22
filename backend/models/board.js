import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  labels: {
    type: Array,
    default: [],
  },
  date: {
    type: String,
    default: '',
  },
  tasks: {
    type: Array,
    default: [],
  },
});

const BoardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  boards: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      cards: [CardSchema],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('board', BoardSchema);