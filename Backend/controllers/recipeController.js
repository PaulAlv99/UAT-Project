const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('owner', 'name');
    console.log(recipes);
    res.json({ success: true, recipes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMarketRecipes = async (req, res) => {
  try {
    const myId = req.user._id;

    const recipes = await Recipe.find({
      owner: { $ne: myId },
      buyers: { $not: { $elemMatch: { $eq: myId } } },
      forSale: true,
      hidden: false,
    }).populate('owner', 'name');

    res.json({ success: true, recipes });
  } catch (err) {
    console.error("getMarketRecipes error:", err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const myId = req.user._id;

    const recipes = await Recipe.find({
      $or: [
        { owner: myId },
        { buyers: myId }
      ],
      hidden: false
    }).populate('owner', 'name');

    res.json({ success: true, recipes });
  } catch (err) {
    console.error("getMyRecipes error:", err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};





exports.createRecipe = async (req, res) => {
  const { name, ingredients, steps, price, image, forSale } = req.body;
  if (!name || !ingredients || !steps || !price || !image) {
    return res.status(400).json({ success: false, message: 'All fields required.' });
  }

  try {
    const newRecipe = new Recipe({
      name,
      ingredients,
      steps,
      price,
      image,
      forSale: !!forSale, // 👈 ensure it's a boolean
      owner: req.user._id
    });

    await newRecipe.save();
    res.status(201).json({ success: true, message: 'Recipe created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.buyRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('owner');
    const buyer = await User.findById(req.user._id);
    const seller = await User.findById(recipe.owner._id);

    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found.' });
    if (recipe.owner._id.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'Cannot buy your own recipe.' });
    if (recipe.buyers.includes(buyer._id))
      return res.status(400).json({ success: false, message: 'Already purchased.' });
    if (buyer.credits < recipe.price)
      return res.status(400).json({ success: false, message: 'Not enough credits.' });

    // ✅ Initialize arrays if they don't exist
    buyer.bought = buyer.bought || [];
    seller.sold = seller.sold || [];

    // Update credits and records
    buyer.credits -= recipe.price;
    seller.credits += recipe.price;

    buyer.bought.push(recipe._id);
    seller.sold.push(recipe._id);

    recipe.buyers.push(buyer._id);
    recipe.salesCount += 1;

    await buyer.save();
    await seller.save();
    await recipe.save();

    return res.json({ success: true, message: 'Recipe purchased successfully.' });
  } catch (err) {
    console.error('Error in buyRecipe:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};



exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe)
      return res.status(404).json({ success: false, message: 'Recipe not found.' });

    if (!recipe.owner.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'Unauthorized, not the owner.' });

    recipe.hidden = true;
    await recipe.save();

    res.json({ success: true, message: 'Recipe hidden (soft-deleted).' });
  } catch (err) {
    console.error("deleteRecipe error:", err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


exports.toggleSaleStatus = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

    if (!recipe.owner.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'Unauthorized' });

    recipe.forSale = !!req.body.forSale;
    await recipe.save();

    res.json({ success: true, message: 'Sale status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const bought = await Recipe.find({ buyers: userId }).populate('owner', 'name');
    const sold = await Recipe.find({ owner: userId, salesCount: { $gt: 0 } }).populate('buyers', 'name');

    res.json({
      success: true,
      history: {
        bought,
        sold
      }
    });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

