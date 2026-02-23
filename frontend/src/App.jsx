import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ifsTheme } from './theme/ifsTheme';
import LoginScreen from './features/auth/LoginScreen';
import RegisterScreen from './features/auth/RegisterScreen';
import DashboardLayout from './components/Layout';
import PalletsView from './features/pallets/PalletsView';
import AdminPanel from './features/admin/AdminPanel';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleLogin = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAdmin = user?.role === 'Administrator' || user?.role === 0;

  return (
    <MantineProvider theme={ifsTheme} defaultColorScheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterScreen />} />
          {!user ? (
            <>
              <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
              <Route path="/" element={<PalletsView user={user} />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}