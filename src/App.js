import React from 'react';
import './App.css';
import { Navbar , Footer } from './pages/layout';
import { Home } from './pages/home';
import { Product } from './pages/product';
import { BrowserRouter, Routes , Route } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
     <Navbar />
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Product" element={<Product />} />
      
     </Routes>
     
    
    <Footer />
    </BrowserRouter>
   
    </>
  );
}

export default App;
