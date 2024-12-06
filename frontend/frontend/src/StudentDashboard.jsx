import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaCoffee, FaHamburger, FaMoon, FaGraduationCap } from 'react-icons/fa';
import { MdShoppingCart, MdRestaurantMenu, MdDashboard } from 'react-icons/md';

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
    color: '#333333',
    minHeight: '100vh',
    padding: '0',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    background: 'linear-gradient(90deg, #FF416C 0%, #FF4B2B 30%, #6c63ff 70%, #5a52e0 100%)',
    padding: '1rem 2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    WebkitBackgroundClip: 'unset',
    WebkitTextFillColor: 'unset',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative',
  },
  categoryButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(108, 99, 255, 0.2)',
    cursor: 'pointer',
    color: '#333333',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(108, 99, 255, 0.2)',
      background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
    },
  },
  itemList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(108, 99, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(108, 99, 255, 0.2)',
      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
    },
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#666666',
    marginBottom: '0.5rem',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '8px',
    background: 'linear-gradient(to right, rgba(108, 99, 255, 0.1), rgba(255, 65, 108, 0.1))',
    textAlign: 'center',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  quantityButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #6c63ff, #5a52e0)',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
      background: 'linear-gradient(45deg, #5a52e0, #6c63ff)',
    },
  },
  orderButton: {
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
    color: '#ffffff',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 65, 108, 0.3)',
      background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
    },
  },
  myOrdersButton: {
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      transform: 'translateY(-2px)',
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1rem',
    borderRadius: '8px'
  },
  orderStatus: {
    padding: '0.5rem',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  },
  pendingStatus: {
    background: '#ffd700',
    color: '#000'
  },
  acceptedStatus: {
    background: '#4caf50',
    color: '#fff'
  },
  rejectedStatus: {
    background: '#f44336',
    color: '#fff'
  },
  dashboardSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  dashboardText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  studentIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
};

const CategoryIcon = ({ category }) => {
  switch (category) {
    case 'breakfast':
      return <FaCoffee />;
    case 'lunch':
      return <FaUtensils />;
    case 'snack':
      return <FaHamburger />;
    case 'dinner':
      return <FaMoon />;
    default:
      return null;
  }
};

const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const queryParam = selectedCategory && selectedCategory !== 'all' 
          ? `?menu=${selectedCategory}` 
          : '';
        const response = await axios.get(`http://localhost:4000/items${queryParam}`);
        setItems(response.data);

        const initialQuantities = {};
        response.data.forEach((item) => {
          initialQuantities[item._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  const handleQuantityChange = (itemId, action) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(1, prevQuantities[itemId] + (action === 'increment' ? 1 : -1)),
    }));
  };

  const handlePlaceOrder = async (itemId) => {
    const userId = localStorage.getItem('userId');
    const quantity = quantities[itemId];

    try {
      const response = await axios.post('http://localhost:4000/order', {
        itemId,
        quantity,
        orderedBy: userId,
        paymentStatus: 'pending',
      });

      if (response.data) {
        alert('Order placed successfully! Check My Orders for payment details.');
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const calculateTotalPrice = (item, quantity) => {
    return item.price * quantity;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>
            <FaCoffee size={28} />
            Campus Café
          </h1>
          <div style={styles.dashboardSection}>
            <div style={styles.dashboardText}>
              <div style={styles.studentIcon}>
                <FaGraduationCap size={24} />
                <span>Student</span>
              </div>
              <MdDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <button
              style={styles.myOrdersButton}
              onClick={() => navigate('/my-orders')}
            >
              <MdShoppingCart size={20} />
              My Orders
            </button>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.categoryButtons}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              ...styles.categoryButton,
              background: selectedCategory === 'all' 
                ? 'linear-gradient(45deg, #6c63ff, #5a52e0)'
                : 'linear-gradient(to right, #ffffff, #f8f9fa)',
              color: selectedCategory === 'all' ? '#ffffff' : '#333333',
              transform: selectedCategory === 'all' ? 'translateY(-2px)' : 'none',
              boxShadow: selectedCategory === 'all' 
                ? '0 4px 12px rgba(108, 99, 255, 0.3)'
                : 'none',
            }}
          >
            <MdRestaurantMenu />
            All Available Items
          </button>
          {['breakfast', 'lunch', 'snack', 'dinner'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...styles.categoryButton,
                background: selectedCategory === category 
                  ? 'linear-gradient(45deg, #6c63ff, #5a52e0)'
                  : 'linear-gradient(to right, #ffffff, #f8f9fa)',
                color: selectedCategory === category ? '#ffffff' : '#333333',
                transform: selectedCategory === category ? 'translateY(-2px)' : 'none',
                boxShadow: selectedCategory === category 
                  ? '0 4px 12px rgba(108, 99, 255, 0.3)'
                  : 'none',
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.itemList}>
          {items.map((item) => (
            <div key={item._id} style={styles.card}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={styles.cardImage}
                />
              )}
              <h2 style={styles.cardTitle}>{item.title}</h2>
              <p style={styles.cardDescription}>{item.description}</p>
              <p style={styles.price}>
                Base Price: ₹{item.price}
                <br />
                Total Price: ₹{calculateTotalPrice(item, quantities[item._id])}
              </p>

              <div style={styles.quantityControl}>
                <button
                  style={styles.quantityButton}
                  onClick={() => handleQuantityChange(item._id, 'decrement')}
                >
                  -
                </button>
                <span>{quantities[item._id]}</span>
                <button
                  style={styles.quantityButton}
                  onClick={() => handleQuantityChange(item._id, 'increment')}
                >
                  +
                </button>
              </div>

              <button
                style={styles.orderButton}
                onClick={() => handlePlaceOrder(item._id)}
              >
                Place Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
