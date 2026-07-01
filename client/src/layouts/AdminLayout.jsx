import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ListOrdered,
  Users,
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

const AdminLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <FolderTree className="w-5 h-5" />
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ListOrdered className="w-5 h-5" />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-indigo-600 text-white rounded-lg shadow-md"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform md:transform-none md:relative transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Link to="/" className="text-xl font-black text-white tracking-tight">
              BuyNest <span className="text-indigo-400">ADMIN</span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Welcome</p>
            <p className="text-white font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-rose-950/40 hover:text-rose-400 text-left transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 md:px-12">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-slate-800">
              {menuItems.find((item) =>
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path)
              )?.name || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
              Administrator
            </span>
          </div>
        </header>
        <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
