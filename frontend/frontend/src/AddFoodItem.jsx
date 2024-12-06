import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './AddFoodItem.css';

const AddFoodItem = () => {
  const location = useLocation();
  const ownerId = location.state?.ownerId;

  const [foodItem, setFoodItem] = useState({
    title: '',
    description: '',
    price: '',
    available: true,
    foodType: 'Veg', // Default value
    menu: 'breakfast', // Default value for menu
    imageUrl: '', // New field for image URL
    createdBy: ownerId,
  });
  const [message, setMessage] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFoodItem({ ...foodItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...foodItem, createdBy: ownerId };
      console.log('Payload being sent:', payload);

      const response = await axios.post('http://localhost:4000/items', payload);

      setMessage(response.data.message);
      setFoodItem({
        title: '',
        description: '',
        price: '',
        available: true,
        foodType: 'Veg',
        menu: 'breakfast',
        imageUrl: '', // Reset the image URL field
        createdBy: ownerId,
      });
    } catch (error) {
      console.error('Error adding food item:', error);
      setMessage('Failed to add food item');
    }
  };

  return (
    <div className="add-item-container">
      <div className="form-card">
        <h2 className="form-title">Add New Food Item</h2>

        {message && <div className="form-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={foodItem.title}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={foodItem.description}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={foodItem.price}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={foodItem.imageUrl}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="foodType">Food Type</label>
            <select
              id="foodType"
              name="foodType"
              value={foodItem.foodType}
              onChange={handleFormChange}
              required
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="menu">Menu</label>
            <select
              id="menu"
              name="menu"
              value={foodItem.menu}
              onChange={handleFormChange}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snack">Snack</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={foodItem.available}
              onChange={(e) =>
                setFoodItem({ ...foodItem, available: e.target.checked })
              }
            />
            <label htmlFor="available">Available</label>
          </div>
          <button type="submit" className="submit-button">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodItem;
