const User = require("../database/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerController = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      role,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const allowedRoles = ["user", "owner"];
    const safeRole = allowedRoles.includes(role) ? role : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: safeRole,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        fullName: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// LOGIN
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//GetProfile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//UpdateProfile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Save a property
exports.saveProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
 
    if (user.savedProperties.includes(propertyId)) {
      return res.status(400).json({ message: "Property already saved" });
    }
 
    user.savedProperties.push(propertyId);
    await user.save();
 
    res.status(200).json({ message: "Property saved", savedProperties: user.savedProperties });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
 
// Unsave a property
exports.unsaveProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
 
    user.savedProperties = user.savedProperties.filter(
      (id) => id.toString() !== propertyId
    );
    await user.save();
 
    res.status(200).json({ message: "Property unsaved", savedProperties: user.savedProperties });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
 
// Get saved properties
exports.getSavedProperties = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("savedProperties");
    if (!user) return res.status(404).json({ message: "User not found" });
 
    res.status(200).json({ savedProperties: user.savedProperties });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};