
/**
 * @param counterSchema Counter Schema to get/set the counter.
 * @param formSchema Form Schema to insert the form data.
 * @param formBody The form data recieved from the user
 * @returns {Number} ID of the form
 */

const formFunction = async (counterSchema, formSchema, formBody) => {

    const counter = await counterSchema.findOneAndUpdate({id:'inc'},{'$inc': {"value":1}});
    let val;
    if (!counter) {
        
        await counterSchema.create({
            id:'inc',
            value:1
        });
        
        val = 1;
    
    } else {
        val = counter.value+1;
    }

    const current = new Date();

    formSchema.create({ 
        ID:val,
        Date: `${current.getDate()}-${current.getMonth()}-${current.getFullYear()}`,
        Time: `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}:${current.getMilliseconds()}`,
        UserName: formBody.name,
        Mail: formBody.mail,
        Message: formBody.message
    });

    return val;
};

module.exports = formFunction;