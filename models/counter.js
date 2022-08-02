const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    name: {type: String, default: "id_count"},
    current: {type:Number, default: 0} 

});

const Counter = mongoose.model('Counter', CounterSchema, "counters");
module.exports = Counter;