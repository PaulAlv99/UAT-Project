const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: String, required: true },
  steps: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  salesCount: { type: Number, default: 0 },
  forSale: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
