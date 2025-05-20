const express = require('express');
const router = express.Router();
const passport = require('../middleware/passport');
const {
  getAllRecipes,
  createRecipe,
  buyRecipe,
  getMyRecipes,
  getMarketRecipes,
  deleteRecipe,
  toggleSaleStatus,
  getHistory
} = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.post('/', passport.authenticate('jwt', { session: false }), createRecipe);
router.get('/mine', passport.authenticate('jwt', { session: false }), getMyRecipes);
router.post('/:id/buy', passport.authenticate('jwt', { session: false }), buyRecipe);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteRecipe);
router.get('/market', passport.authenticate('jwt', { session: false }), getMarketRecipes);
router.patch('/:id/toggle-sale', passport.authenticate('jwt', { session: false }), toggleSaleStatus);
router.get('/history', passport.authenticate('jwt', { session: false }), getHistory);
module.exports = router;
