const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  preference: String,
  recoveryPhrase: String,
  profileImage: String,

  credits: { type: Number, default: 10 },
  bought: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  sold: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
