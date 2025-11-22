import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Package, TrendingUp, LogOut, Plus, Trash2, Filter, 
  Star, MapPin, CheckCircle, AlertCircle, User, ArrowRight, Truck, X, 
  ThumbsUp, ThumbsDown, MessageSquare, Leaf, CreditCard, Banknote, 
  Smartphone, Loader, ShieldCheck, Moon, Sun, Menu, ChevronRight, 
  Heart, Share2, MoreHorizontal, ChevronLeft, Building2, Store, Edit3
} from 'lucide-react';

// --- CONFIGURATION ---
const APP_NAME = "Live MART";

// ============================================================================
//                       1. MOCK DATABASE (The Backend Data)
// ============================================================================

const DB = {
  users: [
    { username: 'customer', password: '123', role: 'customer', name: 'Rahul Sharma', email: 'rahul@example.com', address: '123, Green Park, New Delhi', orders: [] },
    { username: 'retailer', password: '123', role: 'retailer', name: 'City Supermart', email: 'city@mart.com', address: 'Shop 4, MG Road, Bangalore', orders: [] },
    { username: 'wholesaler', password: '123', role: 'wholesaler', name: 'Global Supplies', email: 'global@supply.com', address: 'Warehouse 9, Industrial Area, Mumbai', orders: [] },
  ],
  // Products Customers buy from Retailers
  retailerInventory: [
    { id: 1, name: "Royal Basmati Rice - Premium Aged", price: 150, mrp: 200, stock: 500, category: "Grains", region: "Punjab", isLocal: true, rating: 4.5, reviews: 128, description: "Experience the aroma of authentic Punjab Basmati. Aged for 2 years.", colors: ["Standard"], images: ["https://placehold.co/600x600/e2e8f0/1e293b?text=Basmati+Rice"] },
    { id: 2, name: "Assam Gold Tea - Strong Blend", price: 480, mrp: 600, stock: 120, category: "Beverages", region: "Assam", isLocal: true, rating: 4.8, reviews: 856, description: "Direct from the gardens of Assam. Strong, malty flavor.", colors: ["Standard"], images: ["https://placehold.co/600x600/e2e8f0/1e293b?text=Assam+Tea"] },
    { id: 3, name: "Handcrafted Ceramic Vase", price: 1200, mrp: 1800, stock: 15, category: "Decor", region: "Rajasthan", isLocal: true, rating: 4.2, reviews: 45, description: "Exquisite handcrafted ceramic vase from Jaipur artisans.", colors: ["Blue", "White"], images: ["https://placehold.co/600x600/e2e8f0/1e293b?text=Vase"] },
  ],
  // Products Retailers buy from Wholesalers (B2B)
  wholesaleCatalog: [
    { id: 101, wholesaler: "Global Supplies", name: "Bulk Basmati Rice (50kg)", price: 4500, stock: 100, region: "Punjab", category: "Grains" },
    { id: 102, wholesaler: "Global Supplies", name: "Assam Tea Chest (20kg)", price: 6000, stock: 50, region: "Assam", category: "Beverages" },
    { id: 103, wholesaler: "Desi Spices Co.", name: "Kashmiri Chilli Powder (10kg)", price: 2500, stock: 200, region: "Kashmir", category: "Spices" },
  ],
  orders: [], // Customer Orders
  b2bOrders: [] // Retailer -> Wholesaler Orders
};

// ============================================================================
//                       2. FAKE API LAYER (Integration Point)
//       * REPLACE THE BODY OF THESE FUNCTIONS TO CONNECT YOUR REAL BACKEND *
// ============================================================================

const api = {
  login: async (role, username, password) => {
    // TODO: Replace with fetch('/api/login', { method: 'POST', ... })
    return new Promise((resolve, reject) => {
      const user = DB.users.find(u => u.role === role && (u.username === username || u.name === username) && u.password === password);
      if (user) resolve(user);
      else reject("Invalid credentials (try pass: 123)");
    });
  },
  
  signup: async (userData) => {
    // TODO: Replace with fetch('/api/signup', { method: 'POST', ... })
    return new Promise((resolve) => {
      DB.users.push(userData);
      resolve(userData);
    });
  },
  
  fetchRetailerInventory: async () => {
    // TODO: Replace with fetch('/api/products')
    return [...DB.retailerInventory];
  },

  fetchWholesaleCatalog: async () => {
    // TODO: Replace with fetch('/api/wholesale/products')
    return [...DB.wholesaleCatalog];
  },

  placeCustomerOrder: async (order) => {
    // TODO: Replace with fetch('/api/orders', { method: 'POST' ... })
    DB.orders.push(order);
    return order;
  },

  placeB2BOrder: async (order) => {
    // TODO: Replace with fetch('/api/b2b/orders', { method: 'POST' ... })
    DB.b2bOrders.push(order);
    return order;
  },

  // Used by Wholesaler to manage their own catalog
  addWholesaleProduct: async (product) => {
    const newProduct = { ...product, id: Date.now() };
    DB.wholesaleCatalog.push(newProduct);
    return newProduct;
  },

  deleteWholesaleProduct: async (id) => {
    DB.wholesaleCatalog = DB.wholesaleCatalog.filter(p => p.id !== id);
    return id;
  }
};

// ============================================================================
//                       3. MAIN APP CONTROLLER
// ============================================================================

export default function App() {
  // --- GLOBAL STATE ---
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('login'); 
  
  // --- DATA STATE (Synced with "Backend") ---
  const [retailerInventory, setRetailerInventory] = useState([]);
  const [wholesaleCatalog, setWholesaleCatalog] = useState([]);
  const [b2bOrders, setB2bOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  
  // --- LOCAL UI STATE ---
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Simulate initial data fetch
    api.fetchRetailerInventory().then(setRetailerInventory);
    api.fetchWholesaleCatalog().then(setWholesaleCatalog);
    
    // Apply theme
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- HANDLERS ---
  const handleLogin = async (role, username, password) => {
    try {
      const loggedInUser = await api.login(role, username, password);
      setUser(loggedInUser);
      setView(role === 'customer' ? 'home' : 'dashboard');
    } catch (err) {
      alert(err);
    }
  };

  const handleSignup = async (userData) => {
    await api.signup(userData);
    setUser(userData);
    setView(userData.role === 'customer' ? 'home' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setView('login');
  };

  // --- RENDERER ---
  const renderView = () => {
    switch(view) {
      case 'login': return <LoginScreen onLogin={handleLogin} switchToSignup={() => setView('signup')} />;
      case 'signup': return <SignupScreen onSignup={handleSignup} switchToLogin={() => setView('login')} />;
      
      // CUSTOMER VIEWS
      case 'home': return <CustomerHome inventory={retailerInventory} setView={setView} setSelectedProduct={setSelectedProduct} addToCart={addToCart} user={user} />;
      case 'product': return <ProductDetails product={selectedProduct} addToCart={addToCart} setView={setView} />;
      case 'cart': return <CartPage cart={cart} setCart={setCart} setView={setView} />;
      case 'checkout': return <CheckoutGateway cart={cart} setCart={setCart} setView={setView} user={user} addOrder={(o) => setCustomerOrders([...customerOrders, o])} />;
      case 'profile': return <UserProfile user={user} orders={customerOrders} handleLogout={handleLogout} />;
      
      // DASHBOARDS
      case 'dashboard': 
        if (user.role === 'retailer') {
          return <RetailerDashboard 
            localInventory={retailerInventory} setLocalInventory={setRetailerInventory}
            wholesaleCatalog={wholesaleCatalog} 
            orders={b2bOrders} setOrders={setB2bOrders}
            handleLogout={handleLogout} user={user}
          />;
        } else {
          return <WholesalerDashboard 
            catalog={wholesaleCatalog} setCatalog={setWholesaleCatalog}
            orders={b2bOrders} setOrders={setB2bOrders}
            handleLogout={handleLogout}
          />;
        }
      default: return <LoginScreen onLogin={handleLogin} />;
    }
  };

  // Helper: Add to Cart
  const addToCart = (product, qty = 1, color = null) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedColor === color);
      if (existing) return prev.map(item => (item.id === product.id && item.selectedColor === color) ? { ...item, qty: item.qty + qty } : item);
      return [...prev, { ...product, qty, selectedColor: color || product.colors?.[0] || 'Standard' }];
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-900'}`}>
      {user && <Navbar user={user} cartCount={cart.length} setView={setView} handleLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />}
      <div className={user ? 'pt-20' : ''}>
        {renderView()}
      </div>
      {user && user.role === 'customer' && cart.length > 0 && view !== 'cart' && view !== 'checkout' && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
          <button onClick={() => setView('cart')} className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 border-4 border-white dark:border-slate-800">
            <ShoppingCart className="h-6 w-6" />
            <span className="font-bold">{cart.reduce((a,c)=>a+c.qty,0)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
//                       4. SHARED COMPONENTS
// ============================================================================

function Navbar({ user, cartCount, setView, handleLogout, darkMode, setDarkMode }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center cursor-pointer gap-3" onClick={() => setView(user.role === 'customer' ? 'home' : 'dashboard')}>
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20"><Leaf className="h-6 w-6" /></div>
          <div><h1 className="font-bold text-2xl tracking-tighter font-sans text-slate-900 dark:text-white">{APP_NAME}<span className="text-emerald-500">.</span></h1></div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400">
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
            <div onClick={() => user.role === 'customer' && setView('profile')} className="text-right hidden md:block cursor-pointer hover:opacity-80">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">{user.role}</p>
            </div>
            {user.role === 'customer' && (
              <button onClick={() => setView('cart')} className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                <ShoppingCart className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
            )}
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-500 hover:text-red-500 transition"><LogOut className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
//                       5. AUTH COMPONENTS
// ============================================================================

function LoginScreen({ onLogin, switchToSignup }) {
  const [role, setRole] = useState('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role, username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px]"></div>
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Leaf className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400">Select your role to login</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          {['customer', 'retailer', 'wholesaler'].map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${role === r ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>{r}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder={`Enter ${role} name`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="••••••" />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">Hint: Use '123'</p>
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg">Sign In as {role.toUpperCase()}</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">New to {APP_NAME}? <button onClick={switchToSignup} className="text-emerald-600 font-bold hover:underline">Create Account</button></p>
        </div>
      </div>
    </div>
  );
}

function SignupScreen({ onSignup, switchToLogin }) {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup({ ...formData, role, username: formData.name, id: Date.now(), orders: [] });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-slate-950 relative">
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">Join {APP_NAME}</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Create your account today</p>
        
        {/* Role Selection for Signup */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          {['customer', 'retailer', 'wholesaler'].map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${role === r ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>{r}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
          <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg">Sign Up as {role.toUpperCase()}</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Already have an account? <button onClick={switchToLogin} className="text-emerald-600 font-bold hover:underline">Login</button></p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//                       6. CUSTOMER VIEWS
// ============================================================================

function CustomerHome({ inventory, setView, setSelectedProduct, addToCart }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-emerald-900 text-white mb-12 shadow-2xl p-12 md:p-20">
        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Fresh Arrivals</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif text-white">Pure. Local. <br/>Delivered.</h1>
        <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">Shop Now</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map(product => (
          <div key={product.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col" onClick={() => { setSelectedProduct(product); setView('product'); }}>
            <div className="relative h-64 bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              {product.isLocal && <span className="absolute bottom-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {product.region}</span>}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">{product.category}</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 flex-1">{product.name}</h3>
              <div className="flex items-end justify-between mt-2">
                <div><span className="text-2xl font-bold text-slate-900 dark:text-white">₹{product.price}</span><span className="text-xs text-gray-400 line-through ml-2">₹{product.mrp}</span></div>
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg hover:bg-emerald-600 hover:text-white transition"><Plus className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetails({ product, addToCart, setView }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-emerald-600 mb-6 font-medium"><ChevronLeft className="h-5 w-5 mr-1" /> Back</button>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 aspect-square bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800"><img src={product.images[0]} className="w-full h-full object-contain p-4" /></div>
        <div className="lg:col-span-4 space-y-6">
          <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h1><div className="flex text-amber-400"><Star className="h-4 w-4 fill-current"/> <span className="text-slate-700 dark:text-slate-300 font-bold ml-1">{product.rating}</span></div></div>
          <div className="border-t border-b border-gray-200 dark:border-slate-800 py-4"><span className="text-4xl font-bold text-slate-900 dark:text-white">₹{product.price}</span></div>
          <div><h3 className="font-bold mb-2 text-slate-900 dark:text-white">Description</h3><p className="text-slate-600 dark:text-slate-400">{product.description}</p></div>
        </div>
        <div className="lg:col-span-3">
          <div className="border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm bg-white dark:bg-slate-900/50">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-4">₹{product.price}</div>
            <div className="space-y-3">
               <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 rounded-lg p-1"><button onClick={() => setQty(Math.max(1, qty-1))} className="p-2 text-slate-900 dark:text-white">-</button><span className="font-bold text-slate-900 dark:text-white">{qty}</span><button onClick={() => setQty(qty+1)} className="p-2 text-slate-900 dark:text-white">+</button></div>
               <button onClick={() => addToCart(product, qty)} className="w-full py-3 bg-amber-400 text-slate-900 font-bold rounded-full">Add to Cart</button>
               <button onClick={() => { addToCart(product, qty); setView('cart'); }} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-full">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, setCart, setView }) {
  const total = cart.reduce((a, c) => a + (c.price * c.qty), 0);
  if (cart.length === 0) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center"><ShoppingCart className="h-24 w-24 text-gray-200 mb-4" /><h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2><button onClick={() => setView('home')} className="mt-4 text-emerald-600 font-bold hover:underline">Start Shopping</button></div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">{cart.map((item, i) => (<div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 flex gap-4"><img src={item.images[0]} className="w-24 h-24 object-cover rounded-xl bg-gray-100" /><div className="flex-1"><h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</h3><div className="flex justify-between mt-4"><div className="font-bold text-emerald-600">Qty: {item.qty}</div><div className="font-bold text-xl text-slate-900 dark:text-white">₹{item.price * item.qty}</div></div></div></div>))}</div>
        <div className="h-fit bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-lg"><h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Order Summary</h3><div className="flex justify-between mb-6 text-gray-500"><span>Total</span><span className="text-2xl font-bold text-slate-900 dark:text-white">₹{total}</span></div><button onClick={() => setView('checkout')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg">Proceed to Buy</button></div>
      </div>
    </div>
  );
}

function CheckoutGateway({ cart, setCart, setView, user, addOrder }) {
  const [step, setStep] = useState('payment'); 
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [gatewayStatus, setGatewayStatus] = useState('init');
  const total = cart.reduce((a, c) => a + (c.price * c.qty), 0);

  const handlePayment = () => {
    if (paymentMethod === 'cod') {
      setStep('processing_cod');
      setTimeout(() => {
        addOrder({ id: Date.now(), items: cart, total: total, date: new Date().toISOString(), method: 'COD' });
        setCart([]);
        setStep('success');
      }, 2000);
      return;
    }
    setStep('gateway');
    setGatewayStatus('connecting');
    setTimeout(() => setGatewayStatus('verifying'), 1500);
    setTimeout(() => setGatewayStatus('authorizing'), 3000);
    setTimeout(() => setGatewayStatus('success'), 4500);
    setTimeout(() => {
      addOrder({ id: Date.now(), items: cart, total: total, date: new Date().toISOString(), method: 'Online' });
      setCart([]);
      setStep('success');
    }, 6000);
  };

  if (step === 'processing_cod') return <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950"><Loader className="w-16 h-16 text-emerald-600 animate-spin mb-4"/><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Placing Order...</h2></div>;
  if (step === 'gateway') return <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200"><div className="mb-6">{gatewayStatus === 'success' ? <ShieldCheck className="h-16 w-16 text-green-500 mx-auto" /> : <Loader className="h-16 w-16 text-emerald-600 mx-auto animate-spin" />}</div><h3 className="text-xl font-bold text-gray-800 mb-6">Secure Payment Gateway</h3><div className="space-y-3"><div className={`flex justify-between items-center p-3 rounded-lg ${gatewayStatus === 'connecting' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-400'}`}><span>Connecting to Bank</span>{['verifying', 'authorizing', 'success'].includes(gatewayStatus) && <CheckCircle className="h-4 w-4 text-green-500" />}</div><div className={`flex justify-between items-center p-3 rounded-lg ${gatewayStatus === 'verifying' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-400'}`}><span>Verifying Credentials</span>{['authorizing', 'success'].includes(gatewayStatus) && <CheckCircle className="h-4 w-4 text-green-500" />}</div><div className={`flex justify-between items-center p-3 rounded-lg ${gatewayStatus === 'authorizing' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-400'}`}><span>Authorizing Payment</span>{['success'].includes(gatewayStatus) && <CheckCircle className="h-4 w-4 text-green-500" />}</div></div></div></div>;
  if (step === 'success') return <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-center p-4"><CheckCircle className="w-24 h-24 text-green-500 mb-4"/><h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Placed Successfully!</h2><p className="text-gray-500 mb-8">Order placed for {user.address}</p><button onClick={() => setView('profile')} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold">Track Order</button></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-800 p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Secure Checkout (Total: ₹{total})</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[{id:'card', icon: CreditCard, label:'Card'}, {id:'upi', icon: Smartphone, label:'UPI'}, {id:'cod', icon: Banknote, label:'COD'}].map(m => (
            <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${paymentMethod === m.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}><m.icon className="h-6 w-6"/> <span className="font-bold text-sm">{m.label}</span></button>
          ))}
        </div>
        {paymentMethod === 'card' && <div className="space-y-4"><input type="text" placeholder="Card Number" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white" /><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="MM/YY" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white" /><input type="text" placeholder="CVV" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white" /></div></div>}
        {paymentMethod === 'cod' && <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl mb-4">Pay cash or UPI to the delivery agent.</div>}
        <button onClick={handlePayment} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl">{paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${total}`}</button>
      </div>
    </div>
  );
}

function UserProfile({ user, orders, handleLogout }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1><button onClick={handleLogout} className="text-red-500 font-bold">Sign Out</button></div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 mb-8"><h2 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{user.name}</h2><p className="text-slate-500 dark:text-slate-400">{user.address}</p></div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Order History</h2>
      <div className="space-y-4">
        {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : orders.map((order, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex justify-between items-center">
            <div><p className="font-bold text-slate-900 dark:text-white">Order #{order.id}</p><p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} ({order.method})</p></div>
            <div className="text-right"><p className="font-bold text-emerald-600">₹{order.total}</p><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Placed</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetailerDashboard({ localInventory, setLocalInventory, wholesaleCatalog, orders, setOrders, handleLogout, user }) {
  const [activeTab, setActiveTab] = useState('market'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });

  const placeWholesaleOrder = (item) => {
    const qty = prompt(`Enter quantity for ${item.name} (Stock: ${item.stock}):`);
    if (qty && !isNaN(qty) && parseInt(qty) > 0) {
      const order = { id: Date.now(), retailer: user.name, wholesaler: item.wholesaler, item: item.name, itemId: item.id, qty: parseInt(qty), total: item.price * parseInt(qty), status: 'Pending' };
      api.placeB2BOrder(order).then(o => { setOrders([...orders, o]); alert("Order Sent!"); });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Retailer Dashboard</h1><button onClick={handleLogout} className="flex items-center text-red-500 font-bold"><LogOut className="h-5 w-5 mr-2"/> Logout</button></div>
      <div className="flex gap-4 mb-8 overflow-x-auto">{[{ id: 'market', label: 'Wholesale Market', icon: Building2 }, { id: 'orders', label: 'My Shipments', icon: Truck }, { id: 'inventory', label: 'My Store Inventory', icon: Store }].map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-6 py-3 rounded-xl font-bold transition ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><tab.icon className="h-5 w-5 mr-2" /> {tab.label}</button>))}</div>
      
      {activeTab === 'market' && (
        <div>
          <input type="text" placeholder="Search Wholesalers..." className="w-full p-4 rounded-xl mb-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{wholesaleCatalog.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</h3><p className="text-sm text-gray-500">{item.wholesaler}</p>
              <div className="flex justify-between items-end mt-4"><div><p className="text-2xl font-bold text-emerald-600">₹{item.price}</p><p className="text-xs text-gray-400">Stock: {item.stock}</p></div><button onClick={() => placeWholesaleOrder(item)} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-sm">Order</button></div>
            </div>
          ))}</div>
        </div>
      )}
      
      {activeTab === 'orders' && <div className="space-y-4">{orders.map(o => (<div key={o.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 flex justify-between items-center"><div><h3 className="font-bold text-slate-900 dark:text-white">{o.item}</h3><span className={`text-xs font-bold px-2 py-1 rounded ${o.status==='Pending'?'bg-amber-100 text-amber-800':'bg-gray-100 text-gray-800'}`}>{o.status}</span></div>{o.status === 'Pending' && <button className="text-red-500 font-bold" onClick={() => setOrders(orders.filter(x => x.id !== o.id))}>Cancel</button>}</div>))}</div>}
      
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 h-fit">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Add to Store</h3>
            <input placeholder="Name" className="w-full mb-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-3 mb-3"><input placeholder="Price" type="number" className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} /><input placeholder="Stock" type="number" className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} /></div>
            <button onClick={() => { setLocalInventory([...localInventory, { ...newItem, id: Date.now(), images: ["https://placehold.co/300x300"] }]); setNewItem({ name: '', price: '', stock: '' }); }} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg">Add Product</button>
          </div>
          <div className="lg:col-span-2 space-y-4">{localInventory.map(item => (<div key={item.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800"><div className="flex items-center gap-4"><img src={item.images[0]} className="w-12 h-12 rounded bg-gray-200" /><div><p className="font-bold text-slate-900 dark:text-white">{item.name}</p><p className="text-xs text-gray-500">Stock: {item.stock}</p></div></div><button onClick={() => setLocalInventory(localInventory.filter(i => i.id !== item.id))} className="text-red-500 p-2"><Trash2 className="h-5 w-5"/></button></div>))}</div>
        </div>
      )}
    </div>
  );
}

function WholesalerDashboard({ catalog, setCatalog, orders, setOrders, handleLogout }) {
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', category: 'General' });

  const handleAction = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Wholesaler Dashboard</h1><button onClick={handleLogout} className="flex items-center text-red-500 font-bold"><LogOut className="h-5 w-5 mr-2"/> Logout</button></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Incoming Retailer Orders</h2>
          <div className="space-y-4">{orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between mb-2"><span className="font-bold text-slate-900 dark:text-white">{order.retailer}</span><span className={`text-xs font-bold px-2 py-1 rounded ${order.status==='Pending'?'bg-amber-100 text-amber-800':'bg-gray-100 text-gray-800'}`}>{order.status}</span></div>
              <p className="text-sm text-gray-500 mb-4">{order.item} (x{order.qty}) • ₹{order.total}</p>
              {order.status === 'Pending' && <div className="flex gap-2"><button onClick={() => handleAction(order.id, 'Approved')} className="flex-1 bg-emerald-600 text-white py-2 rounded text-xs font-bold">Approve</button><button onClick={() => handleAction(order.id, 'Declined')} className="flex-1 bg-red-100 text-red-600 py-2 rounded text-xs font-bold">Decline</button></div>}
            </div>
          ))}</div>
        </div>
        <div>
          <h2 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Manage Global Catalog</h2>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 mb-6">
             <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Add New Item</h3>
             <div className="grid grid-cols-2 gap-3 mb-3">
                <input placeholder="Name" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                <input placeholder="Category" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
                <input placeholder="Price" type="number" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                <input placeholder="Stock" type="number" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
             </div>
             <button onClick={() => { api.addWholesaleProduct(newItem).then(p => { setCatalog([...catalog, p]); setNewItem({name:'', price:'', stock:'', category:''}); }); }} className="w-full bg-emerald-600 text-white font-bold py-2 rounded">Add to Catalog</button>
          </div>
          <div className="space-y-2">{catalog.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded border border-gray-200 dark:border-slate-800">
               <div><p className="font-bold text-slate-900 dark:text-white">{item.name}</p><p className="text-xs text-gray-500">Stock: {item.stock} | ₹{item.price}</p></div>
               <button onClick={() => { api.deleteWholesaleProduct(item.id).then(() => setCatalog(catalog.filter(c => c.id !== item.id))); }} className="text-red-500"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}