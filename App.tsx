// Fix: Create the main App component with state management and view rendering.
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Clients from './components/Clients';
import Vendors from './components/Vendors';
import Products from './components/Products';
import Reports from './components/Reports';
import Shipments from './components/Shipments';
import LoginPage from './components/LoginPage';
import { Order, Client, Vendor, OrderStatus, Shipment } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data directly in the component for simplicity
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'Toko Sejahtera', contact: '081234567890' },
    { id: 'c2', name: 'Boutique Glamour', contact: 'boutique@glamour.com' },
    { id: 'c3', name: 'Distro Keren', contact: '085678901234' },
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'v1', name: 'Konveksi Maju Jaya', specialty: 'Kaos & Sablon', contact: '081122334455' },
    { id: 'v2', name: 'Penjahit Halus', specialty: 'Kemeja & Celana Bahan', contact: 'penjahit@halus.com' },
    { id: 'v3', name: 'Pabrik Benang Indah', specialty: 'Bahan Kain', contact: '087788990011' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'o1', productName: 'Kaos Polos Hitam', quantity: 100, clientId: 'c1', vendorId: 'v1', orderDate: '2023-10-01', vendorDueDate: '2023-10-10', status: OrderStatus.DELIVERED,
      clientUnitPrice: 75000, clientPrice: 7500000, vendorUnitPrice: 45000, vendorCost: 4500000,
      clientPayments: [{ id: 'cp1', date: '2023-10-05', amount: 7500000 }],
      vendorPayments: [{ id: 'vp1', date: '2023-10-02', amount: 2000000 }, { id: 'vp2', date: '2023-10-10', amount: 2500000 }],
      additionalCosts: [],
      shipmentId: 's1',
    },
    {
      id: 'o2', productName: 'Kemeja Flanel Kotak', quantity: 50, clientId: 'c2', vendorId: 'v2', orderDate: '2023-10-15', vendorDueDate: '2023-10-25', status: OrderStatus.PRODUKSI,
      clientUnitPrice: 150000, clientPrice: 7500000, vendorUnitPrice: 90000, vendorCost: 4500000,
      clientPayments: [{ id: 'cp2', date: '2023-10-16', amount: 4000000 }],
      vendorPayments: [{ id: 'vp3', date: '2023-10-16', amount: 2000000 }],
      additionalCosts: [{ id: 'ac1', description: 'Kancing Khusus', amount: 250000 }],
    },
    {
      id: 'o3', productName: 'Celana Chino Cream', quantity: 75, clientId: 'c3', vendorId: 'v2', orderDate: '2023-10-20', vendorDueDate: '2023-10-28', status: OrderStatus.SHIPPING,
      clientUnitPrice: 180000, clientPrice: 13500000, vendorUnitPrice: 110000, vendorCost: 8250000,
      clientPayments: [{ id: 'cp3', date: '2023-10-21', amount: 10000000 }],
      vendorPayments: [{ id: 'vp4', date: '2023-10-22', amount: 8250000 }],
      additionalCosts: [],
      shipmentId: 's1',
    },
    {
        id: 'o4', productName: 'Kaos Sablon Komunitas', quantity: 120, clientId: 'c3', vendorId: 'v1', orderDate: '2023-11-01', vendorDueDate: '2023-11-15', status: OrderStatus.PRODUKSI,
        clientUnitPrice: 85000, clientPrice: 10200000, vendorUnitPrice: 50000, vendorCost: 6000000,
        clientPayments: [{ id: 'cp4', date: '2023-11-01', amount: 5000000 }],
        vendorPayments: [{ id: 'vp5', date: '2023-11-02', amount: 3000000 }],
        additionalCosts: [{ id: 'ac2', description: 'Biaya Desain', amount: 500000 }],
    },
  ]);

  const [shipments, setShipments] = useState<Shipment[]>([
    { id: 's1', courier: 'JNE Express', trackingNumber: 'JN0012345678', cost: 250000, orderIds: ['o1', 'o3'], shipmentDate: '2023-10-21', latestStatus: 'Telah diterima oleh Budi' }
  ]);

  const handleLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(handleLogout, 10 * 60 * 1000); // 10 minutes
    };

    const userActivityEvents = [
      'mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'
    ];

    // Add event listeners to reset the timer on user activity
    userActivityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start the timer
    resetTimer();

    // Cleanup function to remove event listeners and clear the timer
    return () => {
      clearTimeout(inactivityTimer);
      userActivityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);


  const handleAddClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: `c${clients.length + 1}` };
    setClients(prev => [...prev, newClient]);
  };

  const handleAddVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor = { ...vendor, id: `v${vendors.length + 1}` };
    setVendors(prev => [...prev, newVendor]);
  };

  const handleAddOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: `o${orders.length + 1}` };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };
  
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddShipment = (shipmentData: Omit<Shipment, 'id' | 'shipmentDate'>) => {
    const newShipment = { ...shipmentData, id: `s${shipments.length + 1}`, shipmentDate: new Date().toISOString().split('T')[0] };
    setShipments(prev => [newShipment, ...prev]);

    // Update status of orders in the shipment
    setOrders(prevOrders => prevOrders.map(o => {
        if (shipmentData.orderIds.includes(o.id)) {
            return { ...o, status: OrderStatus.SHIPPING, shipmentId: newShipment.id };
        }
        return o;
    }));
  };

  const handleTrackShipment = async (shipmentId: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockStatuses = [
      "Paket sedang dalam perjalanan ke pusat sortir.",
      "Telah tiba di hub kota tujuan.",
      "Kurir sedang mengantar paket ke alamat Anda.",
      "Pengiriman gagal, alamat tidak ditemukan.",
      "Paket telah berhasil diantar."
    ];
    
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    setShipments(prev => 
      prev.map(shipment => 
        shipment.id === shipmentId 
          ? { ...shipment, latestStatus: `${randomStatus} (${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})` } 
          : shipment
      )
    );
  };


  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard orders={orders} clients={clients} vendors={vendors} />;
      case 'Orders':
        return <Orders orders={orders} clients={clients} vendors={vendors} onAddOrder={handleAddOrder} onUpdateOrder={handleUpdateOrder} onUpdateStatus={handleUpdateOrderStatus} shipments={shipments} />;
      case 'Clients':
        return <Clients clients={clients} onAddClient={handleAddClient} orders={orders} />;
      case 'Vendors':
        return <Vendors vendors={vendors} onAddVendor={handleAddVendor} orders={orders} />;
      case 'Produk':
        return <Products orders={orders} clients={clients} vendors={vendors} />;
      case 'Reports':
        return <Reports orders={orders} shipments={shipments} />;
      case 'Shipment':
        return <Shipments shipments={shipments} onAddShipment={handleAddShipment} orders={orders} clients={clients} onTrackShipment={handleTrackShipment} />;
      default:
        return <Dashboard orders={orders} clients={clients} vendors={vendors} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen md:flex bg-gray-100 font-sans">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none focus:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800">{currentView}</h1>
          <div className="w-6"></div> {/* Spacer to balance title */}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;