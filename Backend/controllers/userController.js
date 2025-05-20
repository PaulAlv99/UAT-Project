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
        _id: user._id,
      },
    });
  } catch (err) {
    console.error("Error in /me:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
