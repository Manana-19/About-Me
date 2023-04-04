const {Schema, model} = require('mongoose');

const counterSchema = {
    id: {
        type:String
    },
    value: {
        type:Number
    }
};

const counterModel = model('counterSchema', new Schema(counterSchema));

module.exports = counterModel;