import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const ownerId = location.state?.ownerId;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!ownerId) {
          setMessage('Owner ID is missing.');
          setIsLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:4000/owneritems?ownerId=${ownerId}`);
        setItems(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setMessage('Failed to fetch items');
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [ownerId]);

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = async () => {
    if (!editingItem.title || !editingItem.description || !editingItem.price) {
      setMessage('All fields are required');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/items/${editingItem._id}`, editingItem);
      setEditingItem(null);
      setMessage('Item updated successfully');
      setTimeout(() => setMessage(''), 3000);
      // Reload the items after update
      const response = await axios.get(`http://localhost:4000/owneritems?ownerId=${ownerId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error updating item:', error);
      setMessage('Failed to update item');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const createdBy = ownerId; // Replace with the actual ID of the user
        await axios.delete(`http://localhost:4000/items/${itemId}`, {
          data: { createdBy }, // Include createdBy in the request body
        });
        setMessage('Item deleted successfully');
        setTimeout(() => setMessage(''), 3000);
        // Remove deleted item from the state
        setItems(items.filter(item => item._id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
        setMessage('Failed to delete item');
      }
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.navTitle}>My Uploaded Items</h1>
          <button
            onClick={() => navigate('/owner-dashboard')}
            style={styles.navButton}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </nav>

      <div style={styles.contentContainer}>
        {message && (
          <div style={styles.messageAlert}>{message}</div>
        )}

        {isLoading ? (
          <div style={styles.loadingContainer}>Loading items...</div>
        ) : items.length === 0 ? (
          <div style={styles.emptyContainer}>
            <h3 style={styles.emptyText}>No items found</h3>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Title</th>
                  <th style={styles.tableHeader}>Description</th>
                  <th style={styles.tableHeader}>Price</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      {editingItem?._id === item._id ? (
                        <input
                          style={styles.input}
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                        />
                      ) : (
                        item.title
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {editingItem?._id === item._id ? (
                        <input
                          style={styles.input}
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {editingItem?._id === item._id ? (
                        <input
                          style={styles.input}
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                        />
                      ) : (
                        `$${item.price}`
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {editingItem?._id === item._id ? (
                        <div style={styles.buttonGroup}>
                          <button
                            onClick={handleUpdate}
                            style={{...styles.actionButton, ...styles.saveButton}}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            style={{...styles.actionButton, ...styles.cancelButton}}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={styles.buttonGroup}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{...styles.actionButton, ...styles.editButton}}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            style={{...styles.actionButton, ...styles.deleteButton}}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

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
  messageAlert: {
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    textAlign: 'center',
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
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#4a5568',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  editButton: {
    backgroundColor: '#4dabf7',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#40c057',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#868e96',
    color: 'white',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    fontSize: '0.875rem',
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
  },
};

export default MyItems;
