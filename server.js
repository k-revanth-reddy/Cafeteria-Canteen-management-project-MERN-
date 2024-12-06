const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const User = require('./User');
const FoodItem = require('./FoodItem');
const Order = require('./Order');
const Owner = require('./Owners');

const app = express();
app.use(express.json());
app.use(cors());

const DATABASE_URL = "mongodb://127.0.0.1:27017/canteenDB";

// Connect to MongoDB without deprecated options
mongoose.connect(DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Registration
app.post('/studentregister', async (req, res) => {
  const { name, email, password, phNo, type } = req.body;

  // Validate the type field
  if (!['Hostel Student', 'Day Scholar'].includes(type)) {
    return res.status(400).json({ error: 'Invalid user type. Must be "Hostel Student" or "Day Scholar".' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({ name, email, password: hashedPassword, phNo, type });

    // Save the user to the database
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});


app.post('/ownerregister', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const owner = new Owner({ name, email, password: hashedPassword });
  await owner.save();
  res.json({ message: 'Owner registered successfully' });
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', userId: user._id });
});

app.post('/ownerlogin', async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email });

  if (!owner) return res.status(400).json({ success: false, message: 'Owner not found' });

  const isValid = await bcrypt.compare(password, owner.password);

  if (!isValid) return res.status(400).json({ success: false, message: 'Invalid credentials' });

  res.json({ success: true, message: 'Login successful', ownerId: owner._id });
});

// Add Food Item (Only Owners can add items)
// Add Food Item (Only Owners can add items)
app.post('/items', async (req, res) => {
  const { title, description, price, foodType, createdBy, menu, available, imageUrl } = req.body;

  // Validate input
  if (!title || !description || !price || !foodType || !menu || !createdBy || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required, including imageUrl' });
  }

  if (!['Veg', 'Non-Veg'].includes(foodType)) {
    return res.status(400).json({ message: 'Invalid food type' });
  }

  if (!['breakfast', 'lunch', 'snack', 'dinner'].includes(menu)) {
    return res.status(400).json({ message: 'Invalid menu type' });
  }

  // Check if the createdBy ID is valid
  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    return res.status(400).json({ message: 'Invalid owner ID format' });
  }

  try {
    // Check if the creator is a valid owner
    const owner = await Owner.findById(createdBy);
    if (!owner) {
      return res.status(403).json({ message: 'Only owners can add food items' });
    }

    // Create a new food item
    const item = new FoodItem({ title, description, price, foodType, menu, available, createdBy, imageUrl });
    await item.save();

    res.status(201).json({ message: 'Food item added successfully', foodItem: item });
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).json({ message: 'Failed to add food item' });
  }
});



// Get All Food Items
app.get('/items', async (req, res) => {
  const { menu } = req.query; // Extract 'menu' query parameter from the request
  try {
    const filter = menu ? { menu } : {}; // If 'menu' is provided, filter by it
    const items = await FoodItem.find(filter);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Orders with Populated Data (Food Item and User)
app.get('/fetchorders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('item', 'title price')  // Populate the item (Food Item) details
      .populate('orderedBy', 'name email');  // Populate the orderedBy (User) details

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Place Order
app.post('/order', async (req, res) => {
  const { itemId, quantity, orderedBy } = req.body;

  // Ensure itemId and orderedBy are valid ObjectIds
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid item ID format' });
  }

  if (!mongoose.Types.ObjectId.isValid(orderedBy)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    // Fetch the food item and check if it exists
    const foodItem = await FoodItem.findById(itemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Calculate the total order price
    const orderPrice = foodItem.price * quantity;

    // Check if the user exists
    const user = await User.findById(orderedBy);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Create the new order
    const order = new Order({
      item: itemId,
      orderedBy,
      quantity,
      orderPrice,
      itemTitle: foodItem.title,
    });

    // Save the order
    await order.save();

    // Update the order count for the food item
    await FoodItem.findByIdAndUpdate(itemId, { $inc: { orderCount: quantity } });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// Get Previous Orders for a User


// Accept Order (Optional - you may keep it for later)
app.put('/orders/:orderId/accept', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Accepted'; // Change status to Accepted
    await order.save();

    res.json({ message: 'Order accepted successfully' });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Failed to accept order' });
  }
});

// Reject Order
app.put('/orders/:orderId/reject', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Rejected'; // Change status to Rejected
    await order.save();

    res.json({ message: 'Order rejected successfully' });
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Failed to reject order' });
  }
});

// Mark Order as Delivered
app.put('/orders/:orderId/deliver', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Delivered'; // Change status to Delivered
    await order.save();

    res.json({ message: 'Order delivered successfully' });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ message: 'Failed to mark order as delivered' });
  }
});

// Fetch Orders for a User
app.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const orders = await Order.find({ orderedBy: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/owneritems', async (req, res) => {
  const { ownerId } = req.query; // Extract 'ownerId' query parameter from the request

  if (!ownerId) {
    return res.status(400).json({ message: 'Owner ID is required' });
  }

  try {
    // Find food items where the 'createdBy' field matches the provided ownerId
    const items = await FoodItem.find({ createdBy: ownerId });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No food items found for this owner' });
    }

    res.json(items);
  } catch (error) {
    console.error('Error fetching owner items:', error);
    res.status(500).json({ message: 'Failed to fetch food items' });
  }
});


// Edit Food Item (Only Owners can edit items)
app.put('/items/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { title, description, price, foodType, menu, available } = req.body;

  // Validate input
  if (!title || !description || !price || !foodType || !menu) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['Veg', 'Non-Veg'].includes(foodType)) {
    return res.status(400).json({ message: 'Invalid food type' });
  }

  if (!['breakfast', 'lunch', 'snack', 'dinner'].includes(menu)) {
    return res.status(400).json({ message: 'Invalid menu type' });
  }

  try {
    // Find the food item by ID
    const item = await FoodItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Check if the current user is the owner (using createdBy field)
    if (item.createdBy.toString() !== req.body.createdBy) {
      return res.status(403).json({ message: 'You are not authorized to edit this item' });
    }

    // Update the food item
    item.title = title;
    item.description = description;
    item.price = price;
    item.foodType = foodType;
    item.menu = menu;
    item.available = available;

    // Save the updated food item
    await item.save();

    res.json({ message: 'Food item updated successfully', foodItem: item });
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ message: 'Failed to update food item' });
  }
});


// Delete Food Item (Only Owners can delete items)
app.delete('/items/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    // Find the food item by ID
    const item = await FoodItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Check if the current user is the owner
    if (item.createdBy.toString() !== req.body.createdBy) {
      return res.status(403).json({ message: 'You are not authorized to delete this item' });
    }

    // Delete the food item using deleteOne
    await item.deleteOne();

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Failed to delete food item' });
  }
});






// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
