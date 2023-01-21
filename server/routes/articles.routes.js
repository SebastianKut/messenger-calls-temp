module.exports = (app) => {
  const articlesController = require('../controllers/article.controller');

  const router = require('express').Router();

  // Create a new Article /api/articles/
  router.post('/', articlesController.create);

  // Retrieve a single Article with id /api/articles/:id
  router.get('/:id', articlesController.findOne);

  // Update a Article with id
  router.put('/:id', articlesController.update);

  // Delete a Article with id
  router.delete('/:id', articlesController.delete);

  // Define route to this router
  app.use('/api/articles', router);
};
