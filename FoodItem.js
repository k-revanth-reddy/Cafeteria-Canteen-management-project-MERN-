const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },  
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  orderCount: { type: Number, default: 0 },
  foodType: { type: String, required: true, enum: ['Veg', 'Non-Veg'] },
  menu: { type: String, required: true, enum: ['breakfast', 'lunch', 'snack', 'dinner'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  imageUrl: { type: String, required: true } 
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
