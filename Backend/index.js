const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser'); // ✅ FIXED
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const passport = require('./middleware/passport');

dotenv.config();
const app = express();

// Middleware
app.use(cors());

// Increase body size limit to handle base64 images
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(passport.initialize());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Connect DB and start server
connectDB().then(() => {
  app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server running on port //${process.env.PORT}`);
  });
});
