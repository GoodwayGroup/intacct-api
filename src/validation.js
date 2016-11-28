import * as Joi from 'joi';

export default {
    pagesize: Joi.number().min(1).max(1000),
    fields: Joi.array().items(Joi.number()).single(),
    query: Joi.string().default(''),

    intacctConstructor: Joi.object().keys({
        auth: Joi.object().keys({
            senderId: Joi.string().required(),
            senderPassword: Joi.string().required(),
            sessionId: Joi.string(),
            userId: Joi.string(),
            companyId: Joi.string(),
            password: Joi.string()
        }).xor('sessionId', 'userId').with('userId', 'companyId', 'password'),
        controlId: Joi.string().optional(),
        uniqueId: Joi.boolean().default(false),
        dtdVersion: Joi.string().valid(['2.1', '3.0']).default('3.0'),
        timeout: Joi.number().min(10).default(5000)
    })
};
