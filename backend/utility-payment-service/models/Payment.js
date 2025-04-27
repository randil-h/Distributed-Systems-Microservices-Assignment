const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    paymentIntent: {
        type: String,
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;