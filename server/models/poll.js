var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PollSchema = new mongoose.Schema({

    question: String,
    options: [],
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date, default: new Date},
})

var Poll = mongoose.model('Poll', PollSchema);
