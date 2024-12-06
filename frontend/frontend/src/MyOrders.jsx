import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdFileDownload, MdConfirmationNumber } from 'react-icons/md';
import html2canvas from 'html2canvas';

// QR Code Modal Component
const QRModal = memo(({ qrData, onClose }) => {
  if (!qrData) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="qr-code">
          <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Scan QR to Pay</h3>
          <img 
            src="/images/create.png"
            alt="Payment QR Code"
            style={{
              width: '250px',
              height: '250px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
          <div className="payment-info">
            <p className="qr-text">Please scan this QR code to complete your payment</p>
            <button 
              className="done-button"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    axios.get(`http://localhost:4000/orders/${userId}`)
      .then(response => {
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      });
  }, [navigate]);

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '12px',
      fontWeight: '500',
      fontSize: '0.875rem',
      textAlign: 'center',
      display: 'inline-block',
      minWidth: '100px',
    };

    const statusStyles = {
      'Pending': {
        backgroundColor: '#fff3cd',
        color: '#856404',
      },
      'Processing': {
        backgroundColor: '#cce5ff',
        color: '#004085',
      },
      'Completed': {
        backgroundColor: '#d4edda',
        color: '#155724',
      },
      'Cancelled': {
        backgroundColor: '#f8d7da',
        color: '#721c24',
      }
    };

    return { ...baseStyle, ...statusStyles[status] };
  };

  const downloadOrderImage = async (order) => {
    const orderPreview = document.createElement('div');
    orderPreview.style.padding = '20px';
    orderPreview.style.background = 'linear-gradient(135deg, #ffffff, #f8f9fa)';
    orderPreview.style.width = '300px';
    orderPreview.style.position = 'fixed';
    orderPreview.style.left = '-9999px';
    
    orderPreview.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0;">Campus Café</h2>
        <p style="color: #666; margin: 5px 0;">Order Receipt</p>
      </div>
      <div style="border-top: 2px dashed #ddd; border-bottom: 2px dashed #ddd; padding: 15px 0; margin: 15px 0;">
        <h3 style="color: #333; margin: 0 0 10px 0;">${order.item.title}</h3>
        <p style="color: #666; margin: 5px 0;">Order ID: ${order._id}</p>
        <p style="color: #666; margin: 5px 0;">Quantity: ${order.quantity}</p>
        <p style="color: #666; margin: 5px 0;">Total Price: ₹${order.orderPrice}</p>
        <p style="color: #666; margin: 5px 0;">Status: ${order.status}</p>
      </div>
      <div style="text-align: center; color: #666; font-size: 0.9em;">
        <p style="margin: 5px 0;">Thank you for your order!</p>
        <p style="margin: 5px 0;">Order Date: ${new Date(order.createdAt).toLocaleString()}</p>
        <p style="margin: 10px 0; color: #ff6b6b; font-weight: bold;">
          ⏰ Please collect your order within 1 hour
        </p>
      </div>
    `;

    document.body.appendChild(orderPreview);

    try {
      const canvas = await html2canvas(orderPreview, {
        scale: 2,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `order-receipt-${order._id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating order receipt:', error);
      alert('Failed to generate order receipt');
    } finally {
      document.body.removeChild(orderPreview);
    }
  };

  const getTokenStyle = (status) => {
    const baseStyle = {
      ...styles.tokenContainer,
    };

    const statusColors = {
      'Pending': {
        background: 'linear-gradient(135deg, #FFA726, #FF7043)',
      },
      'Accepted': {
        background: 'linear-gradient(135deg, #66BB6A, #43A047)',
      },
      'Delivered': {
        background: 'linear-gradient(135deg, #42A5F5, #1E88E5)',
      },
      'Processing': {
        background: 'linear-gradient(135deg, #AB47BC, #8E24AA)',
      },
    };

    return {
      ...baseStyle,
      background: statusColors[status]?.background || baseStyle.background,
    };
  };

  return (
    <div style={styles.mainContainer}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.navTitle}>My Orders</h1>
          <button
            onClick={() => navigate('/')}
            style={styles.navButton}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.contentContainer}>
        {isLoading ? (
          <div style={styles.loadingContainer}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyContainer}>
            <h3 style={styles.emptyText}>No orders found</h3>
            <button
              onClick={() => navigate('/')}
              style={styles.returnButton}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Browse Items
            </button>
          </div>
        ) : (
          <>
            <div style={styles.messageContainer}>
              <p style={styles.warningMessage}>
                ⚠️ Note: Orders must be received within one hour of placing. Orders not collected within this time will be automatically cancelled.
              </p>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Date/Time</th>
                    <th style={styles.tableHeader}>Item</th>
                    <th style={styles.tableHeader}>Quantity</th>
                    <th style={styles.tableHeader}>Total Price</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Token</th>
                    <th style={styles.tableHeader}>Payment</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <div style={styles.dateTimeContainer}>
                          <div style={styles.date}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div style={styles.time}>
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>{order.itemTitle}</td>
                      <td style={styles.tableCell}>{order.quantity}</td>
                      <td style={styles.tableCell}>
                        <span style={styles.price}>₹{order.orderPrice}</span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={getStatusStyle(order.status)}>
                          {order.status}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={getTokenStyle(order.status)}>
                          <MdConfirmationNumber size={20} />
                          <span style={styles.tokenText}>
                            {order._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        {order.status === 'Accepted' && (
                          <button
                            onClick={() => setSelectedQR("/images/create.png")}
                            className="paymentButton"
                          >
                            Show Payment QR
                          </button>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          style={styles.downloadButton}
                          onClick={() => downloadOrderImage({
                            _id: order._id,
                            item: {
                              title: order.itemTitle,
                              price: order.orderPrice / order.quantity
                            },
                            quantity: order.quantity,
                            status: order.status,
                            paymentStatus: order.paymentStatus || 'Pending',
                            createdAt: order.createdAt || new Date(),
                            orderPrice: order.orderPrice
                          })}
                        >
                          <MdFileDownload size={20} />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <QRModal 
          qrData={selectedQR} 
          onClose={() => setSelectedQR(null)} 
        />
      )}
    </div>
  );
}

const styles = {
  mainContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4dabf7 0%, #6c63ff 100%)',
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
  },
  tableHeader: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#4a5568',
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f7fafc',
    },
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#4a5568',
  },
  price: {
    fontWeight: '600',
    color: '#2d3748',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
    color: 'white',
    fontSize: '1.2rem',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  emptyText: {
    color: '#4a5568',
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
  },
  returnButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #4dabf7 0%, #6c63ff 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  paymentButton: {
    padding: '8px 16px',
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  downloadButton: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(45deg, #00C853, #69F0AE)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 200, 83, 0.3)',
    },
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tokenContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.8rem',
    background: 'linear-gradient(135deg, #FF9D6C, #FF6B6B)',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    width: 'fit-content',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
    },
  },
  
  tokenText: {
    letterSpacing: '1px',
    fontFamily: 'monospace',
    fontSize: '1.1rem',
  },
  messageContainer: {
    background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(255, 167, 38, 0.2)',
  },
  
  warningMessage: {
    color: '#E65100',
    fontSize: '1rem',
    margin: 0,
    textAlign: 'center',
    fontWeight: '500',
  },
  dateTimeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  date: {
    fontWeight: '500',
    color: '#2d3748',
  },
  time: {
    fontSize: '0.875rem',
    color: '#718096',
  },
};

// Add this CSS to your stylesheet
const cssToAdd = `
.qr-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.qr-modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  position: relative;
  max-width: 90%;
  width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px 10px;
  border-radius: 50%;
  line-height: 1;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.qr-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.payment-info {
  text-align: center;
  margin-top: 1rem;
}

.qr-text {
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0.5rem 0;
}

.done-button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.done-button:hover {
  background: #5a52e0;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.paymentButton {
  padding: 8px 16px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.paymentButton:hover {
  background: #5a52e0;
  transform: translateY(-2px);
}

.paymentButton:disabled {
  background: #ccc;
  cursor: not-allowed;
}
`;

// Create a style element and add it to the document head
const style = document.createElement('style');
style.textContent = cssToAdd;
document.head.appendChild(style);

export default MyOrders;
