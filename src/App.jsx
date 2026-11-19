import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import TrackProduct from './pages/TrackProduct';
import Dashboard from './pages/Dashboard';
import TransferOwnership from './pages/TransferOwnership';
import UpdateStatus from './pages/UpdateStatus';

function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/track" element={<TrackProduct />} />
            <Route path="/track/:id" element={<TrackProduct />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfer" element={<TransferOwnership />} />
            <Route path="/update-status" element={<UpdateStatus />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1b4b',
              color: '#fff',
              borderRadius: '0.75rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Web3Provider>
  );
}

export default App;
