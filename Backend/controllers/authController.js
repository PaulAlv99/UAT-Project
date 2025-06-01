
const jwt  = require('jsonwebtoken');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');


const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  const { name, email, password, preference, recoveryPhrase, profileImage} = req.body;
  if (!name || !email || !password || !preference || !recoveryPhrase || !profileImage ) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const newUser = new User({ name, email, password, preference, recoveryPhrase, profileImage });
    await newUser.save();

    const defaultRecipes = [
          {
            name: "Spaghetti Bolognese",
            ingredients: "Pasta, beef, tomato sauce",
            steps: "Boil pasta. Cook beef. Mix with sauce.",
            price: 10,
            image: "https://www.maggi.ph/sites/default/files/styles/home_stage_944_531/public/srh_recipes/ec9fce823d23bbb054d52aea1981fc0c.jpg?h=28121b77&itok=Yn44BV-T",
            owner: newUser._id,
            buyers: [],
            salesCount: 0,
            forSale: false,
            createdAt: new Date()
          },
          {
            name: "Avocado Toast",
            ingredients: "Bread, avocado, lemon",
            steps: "Toast bread. Mash avocado. Spread and serve.",
            price: 5,
            image: "https://www.spendwithpennies.com/wp-content/uploads/2022/09/Avocado-Toast-SpendWithPennies-1.jpg",
            owner: newUser._id,
            buyers: [],
            salesCount: 0,
            forSale: false,
            createdAt: new Date()
          }
        ];

    await Recipe.insertMany(defaultRecipes);
    console.log("✅ New user and default recipes created:", newUser._id);

    return res.status(201).json({ success: true, message: "User registered successfully." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = createToken(user);
    console.log("Login successful for user:", user._id);
    return res.json({ success: true, message: "Login successful.", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.recoverPassword = async (req, res) => {
  const { email, recoveryPhrase } = req.body;

  if (!email || !recoveryPhrase) {
    return res.status(400).json({ success: false, message: "Email and recovery phrase are required." });
  }

  try {
    const user = await User.findOne({ email, recoveryPhrase });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or recovery phrase incorrect." });
    }

    return res.status(200).json({ success: true, message: "Recovery validated. You may now reset your password." });
  } catch (err) {
    console.error("RecoverPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("ResetPassword error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

