import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  Bars3Icon, 
  ShoppingCartIcon, 
  XMarkIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/products' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50 bg-white bg-opacity-90">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Dieselpower</span>
              <img
                className="h-8 w-auto"
                src="/DP-logo.png"
                alt="Dieselpower"
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-black hover:text-primary-500">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <Link to="/cart" className="text-sm font-semibold leading-6 text-black hover:text-primary-500 flex items-center">
              <ShoppingCartIcon className="h-6 w-6 mr-1" aria-hidden="true" />
              <span>Cart</span>
            </Link>
            {user ? (
              <Link to="/profile" className="text-sm font-semibold leading-6 text-black hover:text-primary-500 flex items-center">
                <UserIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                <span>{user.first_name || user.username}</span>
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-semibold leading-6 text-black hover:text-primary-500 flex items-center">
                <UserIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                <span>Log in</span>
              </Link>
            )}
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Dieselpower</span>
                <img
                  className="h-8 w-auto"
                  src="/logo-placeholder.svg"
                  alt="Dieselpower"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    to="/cart"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  {user ? (
                    <Link
                      to="/profile"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {user.first_name || user.username}
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      {/* Main content */}
      <main className="min-h-screen pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary-600">Dieselpower</h3>
              <p className="text-gray-300">
                Expert auto repair services and quality parts for all your diesel engine needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary-600">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-gray-300 hover:text-primary-500">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary-600">Contact Us</h3>
              <address className="not-italic text-gray-300">
                <p>123 Repair Street</p>
                <p>Engine Town, ET 12345</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: info@dieselpower.com</p>
              </address>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-300">© {new Date().getFullYear()} Dieselpower. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
