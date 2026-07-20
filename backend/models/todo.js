const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true,
    },
    description: {
            type : String,
            required : true
        },
    textBol : {
        type: Boolean,
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;