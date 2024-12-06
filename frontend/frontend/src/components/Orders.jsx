import React, { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from your API
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      let data = await response.json();
      
      // Add formatted date and time to each order
      data = data.map(order => ({
        ...order,
        formattedDateTime: new Date(order.createdAt).toLocaleString()
      }));

      // Sort orders by date (newest first)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="orders-container">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Order #{order.id}</h3>
            <span className="order-date">{order.formattedDateTime}</span>
          </div>
          {/* Rest of your order details */}
        </div>
      ))}
    </div>
  );
}

export default Orders; 