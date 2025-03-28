const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
};

// User Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Add debug logging
        console.log("Login attempt for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);
        res.json({
            token,
            role: user.role,
            id: user._id  // Add this line
        });
    } catch (error) {
        console.error("Login error:", error); // This will show the actual error
        res.status(500).json({
            success: false,
            error: error.message // Send actual error message
        });
    }
};
exports.verifyToken = (req, res) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Remove 'Bearer '
        res.json({ user: decoded }); // Send the user data
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
