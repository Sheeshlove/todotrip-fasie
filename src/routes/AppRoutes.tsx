
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Import Pages
import Home from "../pages/Home";
import Dating from "../pages/Dating";
import Partners from "../pages/Partners";
import PartnerDetails from "../pages/PartnerDetails";
import CreateProfile from "../pages/CreateProfile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Contact from "../pages/Contact";
import ProfilePage from "../pages/ProfilePage";
import AiTrip from "../pages/AiTrip";
import NotFound from "../pages/NotFound";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/partners/:id" element={<PartnerDetails />} />
          <Route 
            path="/dating" 
            element={
              <ProtectedRoute>
                <Dating />
              </ProtectedRoute>
            } 
          />
          <Route path="/ai-trip" element={<AiTrip />} />
          <Route 
            path="/create-profile" 
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requiredAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requiredAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unauthorized" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
