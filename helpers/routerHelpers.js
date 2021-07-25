const Joi = require ('joi')

const validatorBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        
        if (validatorResult.error){
            return res.status(400).json(validatorResult.error)
        }else {
            if(!req.value) req.value = {}
            if (!req.value['body']) req.value.body = {}

            req.value.body = validatorResult.value
            next()
        }
    }
}

const validatorParam = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({param: req.params[name]})

        if (validatorResult.error){
            return res.status(400).json(validatorResult.error)
        }else {
            if(!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}

            req.value.params[name] = req.params[name]
            console.log(req.value.params)
            next()
        }
    }
}

const Schema = {
    authSignUpSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().required().min(2),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    }),
    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    }),
    deckSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        description: Joi.string().required().min(5),
    }),
    idSchema: Joi.object().keys({
        param: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    }),
    newDeckSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        description: Joi.string().required().min(5),
        owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    }),
    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().required().min(2),
        email: Joi.string().email().required(),
    }),
    userUpdateSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email(),
    }),
    updateDeckSchema: Joi.object().keys({
        name: Joi.string().min(2),
        description: Joi.string().min(5),
        owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    }),
}

module.exports = {
    validatorParam,
    validatorBody,
    Schema
}