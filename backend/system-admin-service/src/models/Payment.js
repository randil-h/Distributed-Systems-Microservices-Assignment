const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentIntent: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'succeeded', 'failed', 'refunded']
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);