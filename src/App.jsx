import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SideMenu from './components/layout/SideMenu';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import SellerDashboard from './pages/SellerDashboard';
import BuyerProfile from './pages/BuyerProfile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex">
            <SideMenu />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-grow p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/buyer-profile" element={<BuyerProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
