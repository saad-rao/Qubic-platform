import * as Joi from 'joi';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
  database: {
    uri: process.env.MONGO_URI,
  },
  // mail: {
  //   host: process.env.MAIL_HOST,
  //   port: parseInt(process.env.MAIL_PORT, 10),
  //   user: process.env.MAIL_USER,
  //   pass: process.env.MAIL_PASS,
  //   from: process.env.MAIL_FROM,
  // },
});

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  MONGO_URI: Joi.string().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
   // MAIL_HOST: Joi.string(),
  // MAIL_PORT: Joi.number(),
  // MAIL_USER: Joi.string(),
  // MAIL_PASS: Joi.string(),
  // MAIL_FROM: Joi.string(),
});