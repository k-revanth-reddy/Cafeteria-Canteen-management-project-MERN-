import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import LandingPage from './LandingPage';  // Updated component name for consistency
import OwnerDashboard from './OwnerDashboard'; // Updated component name for consistency
import StudentDashboard from './StudentDashboard'; // Added for student dashboard
import OwnerRegister from './OwnerRegister';
import OwnerLogin from './OwnerLogin';
import AddFoodItem from './AddFoodItem';
import MyOrders from './MyOrders';
import MyItems from './MyItems';
import './App.css';


function App() {
  
  return (
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner-register" element={<OwnerRegister />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/add-food-item" element={<AddFoodItem />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-items" element={<MyItems />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
