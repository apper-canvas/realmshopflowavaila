import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layout Components
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

// Pages
import Home from "@/components/pages/Home";
import ProductDetail from "@/components/pages/ProductDetail";
import Cart from "@/components/pages/Cart";
import Checkout from "@/components/pages/Checkout";
import OrderConfirmation from "@/components/pages/OrderConfirmation";
import OrderHistory from "@/components/pages/OrderHistory";
import Categories from "@/components/pages/Categories";
import Search from "@/components/pages/Search";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Header />
        <main className="pt-0">
<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:categoryName" element={<Categories />} />
            <Route path="/search" element={<Search />} />
            <Route path="/deals" element={<Categories />} />
            <Route path="/new-arrivals" element={<Categories />} />
          </Routes>
        </main>
        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;