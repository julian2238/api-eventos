const { schemas, validate } = require('../validators/joiSchemas');
const { ValidationError } = require('../errors/AppError');

const validateRequest = (schemaName, schemaType = 'create') => {
  return (req, res, next) => {
    try {
      const schema = schemas[schemaName][schemaType];
      
      if (!schema) {
        throw new Error(`Schema ${schemaName}.${schemaType} not found`);
      }
      
      // Validate request body
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = validate(schema, req.body);
      }
      
      // Validate request params if schema exists
      if (req.params && Object.keys(req.params).length > 0) {
        const paramsSchema = schemas[schemaName].params;
        if (paramsSchema) {
          req.params = validate(paramsSchema, req.params);
        }
      }
      
      next();
    } catch (error) {
      next(new ValidationError(error.message));
    }
  };
};

module.exports = {
  validateRequest,
};
