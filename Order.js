// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
  orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'Delivered','Accepted','Rejected'], default: 'pending' },
  orderPrice: { type: Number },
  itemTitle: { type: String },
  createdAt: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('Order', orderSchema);
