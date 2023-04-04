const {Schema, model} = require('mongoose');

const formSchema = {
    // ID as the Unique ID
    ID:{type:Number},
    Date: {type: String},
    Time:{type: String},
    UserName: {type: String},
    Mail: {type: String},
    Message: {type: String},
}

const formModel = model('formData', new Schema(formSchema));

module.exports = formModel;