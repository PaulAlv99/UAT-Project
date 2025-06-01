const User = require('../models/userModel');
const Message = require('../models/Message');
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        credits: user.credits,
        bought: user.bought,
        sold: user.sold,
        profileImage: user.profileImage,
        _id: user._id,
      },
    });
  } catch (err) {
    console.error("Error in /me:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, newPassword, profileImage } = req.body;
  const userId = req.user._id;

  if (!username && !newPassword && !profileImage) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) {
      const existing = await User.findOne({ name: username, _id: { $ne: userId } });
      if (existing) return res.status(409).json({ message: 'Username already taken' });
      user.name = username;
    }

    if (newPassword) {
      user.password = newPassword; // will be hashed by .pre('save')
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save(); // triggers pre-save
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }) // exclude current user
      .select('username _id profileImage');

    res.json({ users, user: { _id: req.user._id } }); // also return own ID for socket
  } catch (err) {
    console.error('Failed to get users:', err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

exports.getMessagesWithUser = async (req, res) => {
  const userId1 = req.user._id.toString();
  const userId2 = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ]
    }).sort({ timestamp: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};





