const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    details: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
});

mongoose.model('ideas', IdeaSchema);
