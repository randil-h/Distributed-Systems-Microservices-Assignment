const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["customer", "restaurant-admin", "system-admin", "delivery-personnel", "restaurant-staff"],
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: false
        },
        lng: {
            type: Number,
            required: false
        }
    },
    status: {
        type: String,
        required: false,
    },
    address: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockExpiry: {
        type: Date,
        default: null
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: function() { return this.role === 'restaurant-staff'; }
    },
    mobile: { type: String, required: false, unique: false },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
