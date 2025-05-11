import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                  <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
                  <Route 
                    path="profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Admin routes */}
                  <Route
                    path="admin/*"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        {/* Admin components will be added later */}
                        <div className="p-10">
                          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                          <p>Admin features coming soon</p>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                  {/* 404 route */}
                  <Route path="*" element={<div className="p-10 text-center"><h1 className="text-2xl">Page not found</h1></div>} />
                </Route>
              </Routes>
            </Router>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
