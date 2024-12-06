import React, { useState, useEffect, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './OwnerDashboard.css';
import { v4 as uuidv4 } from 'uuid';

// Create a memoized QR code component
const QRCodeComponent = memo(({ value }) => {
  if (!value) {
    return null;
  }
  
  return (
    <div className="qr-code">
      <img 
        src="/images/create.png"
        alt="Payment QR Code"
        style={{
          width: '120px',
          height: '120px',
          objectFit: 'contain',
          borderRadius: '8px'
        }}
      />
      <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '0.9rem' }}>
        Payment QR Code
      </p>
    </div>
  );
});

const styles = {
  tableCell: {
    padding: '1rem',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
  },
  qrCode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  }
};

const OwnerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const ownerId = location.state?.ownerId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/fetchorders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setMessage('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  const handleAddItems = () => {
    navigate('/add-food-item', { state: { ownerId } });
  };

  const handleMyItems = () => {
    navigate('/my-items', { state: { ownerId } });
  };

  const handleAccept = async (orderId) => {
    try {
      const paymentToken = uuidv4();
      const qrCodeData = JSON.stringify({
        orderId: orderId,
        paymentToken: paymentToken,
        amount: orders.find(order => order._id === orderId)?.orderPrice || 0,
        paymentUrl: `http://localhost:4000/payment/${paymentToken}`
      });
      
      console.log('Generated QR Data:', qrCodeData);
      
      await axios.put(`http://localhost:4000/orders/${orderId}/accept`, {
        paymentToken,
        paymentStatus: 'pending',
        qrCodeData
      });
      
      setMessage('Order accepted and payment QR sent to student');
      const response = await axios.get('http://localhost:4000/fetchorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error accepting order:', error);
      setMessage('Failed to accept order');
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.put(`http://localhost:4000/orders/${orderId}/reject`);
      setMessage('Order rejected successfully');
      const response = await axios.get('http://localhost:4000/fetchorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error rejecting order:', error);
      setMessage('Failed to reject order');
    }
  };

  const handleDelivered = async (orderId) => {
    try {
      await axios.put(`http://localhost:4000/orders/${orderId}/deliver`);
      setMessage('Order delivered successfully');
      const response = await axios.get('http://localhost:4000/fetchorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      setMessage('Failed to mark order as delivered');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Owner Dashboard</h1>
        <button className="add-button" onClick={handleAddItems}>
          Add Items
        </button>
        <button className="my-items-button" onClick={handleMyItems}>
          My Items
        </button>
      </div>

      {message && (
        <div className="message-alert">
          {message}
        </div>
      )}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Token</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Ordered By</th>
              <th>Order Cost</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Payment QR</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">{order._id.slice(-6)}</td>
                  <td>{order.item?.title || 'N/A'}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderedBy?.name || 'N/A'}</td>
                  <td>{order.orderPrice}</td>
                  <td>{order.status}</td>
                  <td>
                    <div className="action-buttons">
                      {order.status === 'pending' && (
                        <>
                          <button 
                            className="accept-button"
                            onClick={() => handleAccept(order._id)}
                          >
                            Accept
                          </button>
                          <button 
                            className="reject-button"
                            onClick={() => handleReject(order._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {order.status === 'Accepted' && (
                        <button
                          className="deliver-button"
                          onClick={() => handleDelivered(order._id)}
                        >
                          Delivered
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {order.status === 'Accepted' && (
                      <QRCodeComponent 
                        value="/images/create.png"
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-message">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
