const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { checkAndUnblockUser } = require("../controllers/userController");

const generateToken = (user) => {
    return jwt.sign({
      id: user._id,
      role: user.role,
      restaurantId: user.restaurantId
    }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
};

// User Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, address, location, status, restaurantId } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

      // Validate restaurantId for staff
      if (role === 'restaurant-staff' && !restaurantId) {
        return res.status(400).json({ message: "Restaurant selection is required for staff" });
      }

        const newUser = new User({
          name,
          email,
          password,
          role,
          address,
          location,
          status,
          restaurantId: role === 'restaurant-staff' ? restaurantId : undefined
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
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

        await checkAndUnblockUser(user._id);

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is blocked. Please try again later." });
        }

        const token = generateToken(user);
        res.json({
            token,
            role: user.role,
            id: user._id,
            restaurantId: user.restaurantId,
            name: user.name
        });
    } catch (error) {
        console.error("Login error:", error); // This will show the actual error
        res.status(500).json({
            success: false,
            error: error.message // Send actual error message
        });
    }
};
exports.verifyToken = async (req, res) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({message: "Unauthorized"});

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Remove 'Bearer '

        await checkAndUnblockUser(decoded.userId);

        res.json({user: decoded}); // Send the user data
    } catch (error) {
        res.status(401).json({message: "Invalid token"});
    }
};
