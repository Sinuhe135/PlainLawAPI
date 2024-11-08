const Joi = require('joi');

module.exports = (summary) =>
{
    const schema = Joi.object({
        site: Joi.string().min(3).max(50).trim().required(), 
        content: Joi.array().items(Joi.string().min(3).max(350).trim().required()).required(), 
        notes: Joi.string().min(3).max(255).trim()
    });

    return schema.validate(summary);
}