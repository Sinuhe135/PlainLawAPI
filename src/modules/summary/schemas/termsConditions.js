const Joi = require('joi');

module.exports = (summary) =>
{
    const schema = Joi.object({
        termsConditions: Joi.array().items(Joi.string().min(3).max(2500).trim().required()).required() 
    });

    return schema.validate(summary);
}