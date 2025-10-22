const Joi = require('joi');

const schemas = {
  // User validation schemas
  user: {
    create: Joi.object({
      document: Joi.string().required(),
      fullName: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().required(),
      gender: Joi.string().valid('M', 'F', 'O').required(),
      birthDate: Joi.date().required(),
    }),
    
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      platform: Joi.string().valid('web', 'mobile').required(),
    }),
    
    refreshToken: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
  
  // Event validation schemas
  event: {
    create: Joi.object({
      title: Joi.string().min(3).max(200).required(),
      description: Joi.string().min(10).max(1000).required(),
      category: Joi.string().required(),
      date: Joi.date().iso().required(),
      hour: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      routes: Joi.array().items(Joi.string()).default([]),
    }),
    
    update: Joi.object({
      title: Joi.string().min(3).max(200),
      description: Joi.string().min(10).max(1000),
      category: Joi.string(),
      date: Joi.date().iso(),
      hour: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      routes: Joi.array().items(Joi.string()),
    }).min(1), // At least one field must be provided
    
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  
  // Category validation schemas
  category: {
    create: Joi.object({
      name: Joi.string().min(2).max(50).required(),
      description: Joi.string().max(200),
    }),
  },
  
  // User update validation schemas
  userUpdate: {
    update: Joi.object({
      fullName: Joi.string().min(2).max(100),
      phone: Joi.string(),
      gender: Joi.string().valid('M', 'F', 'O'),
      birthDate: Joi.date(),
      role: Joi.string().valid('USUARIO', 'COORDINADOR', 'ADMIN'),
    }).min(1), // At least one field must be provided
  },
};

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    throw new Error(`Validation failed: ${details.map(d => d.message).join(', ')}`);
  }
  
  return value;
};

module.exports = {
  schemas,
  validate,
};
