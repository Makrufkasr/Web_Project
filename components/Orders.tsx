// Fix: Create the Orders component.
import React, { useState, useEffect } from 'react';
import { Order, Client, Vendor, OrderStatus, Payment, Shipment } from '../types';
import Modal from './Modal';

interface OrdersProps {
  orders: Order[];
  clients: Client[];
  vendors: Vendor[];
  shipments: Shipment[];
  onAddOrder: (order: Omit<Order, 'id'>) => void;
  onUpdateOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PRODUKSI: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.SHIPPING: return 'bg-blue-100 text-blue-800';
        case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
        case OrderStatus.PENDING: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const OrderForm: React.FC<{ 
    clients: Client[];
    vendors: Vendor[];
    onAddOrder: OrdersProps['onAddOrder'];
    onUpdateOrder: OrdersProps['onUpdateOrder'];
    orderToEdit: Order | null;
    onClose: () => void;
}> = ({ clients, vendors, onAddOrder, onUpdateOrder, orderToEdit, onClose }) => {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [clientId, setClientId] = useState(clients[0]?.id || '');
    const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
    const [clientUnitPrice, setClientUnitPrice] = useState(0);
    const [vendorUnitPrice, setVendorUnitPrice] = useState(0);
    const [vendorDueDate, setVendorDueDate] = useState('');

    useEffect(() => {
        if (orderToEdit) {
            setProductName(orderToEdit.productName);
            setQuantity(orderToEdit.quantity);
            setClientId(orderToEdit.clientId);
            setVendorId(orderToEdit.vendorId);
            setClientUnitPrice(orderToEdit.clientUnitPrice);
            setVendorUnitPrice(orderToEdit.vendorUnitPrice);
            setVendorDueDate(orderToEdit.vendorDueDate);
        } else {
            // Reset for add mode
            setProductName('');
            setQuantity(1);
            setClientId(clients[0]?.id || '');
            setVendorId(vendors[0]?.id || '');
            setClientUnitPrice(0);
            setVendorUnitPrice(0);
            setVendorDueDate('');
        }
    }, [orderToEdit, clients, vendors]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!productName || !clientId || !vendorId || !vendorDueDate || quantity <= 0 || clientUnitPrice <= 0 || vendorUnitPrice <= 0) {
            alert('Please fill all required fields correctly.');
            return;
        };

        if (orderToEdit) {
             const updatedOrder: Order = {
                ...orderToEdit,
                productName,
                quantity,
                clientId,
                vendorId,
                vendorDueDate,
                clientUnitPrice,
                clientPrice: clientUnitPrice * quantity,
                vendorUnitPrice,
                vendorCost: vendorUnitPrice * quantity,
            };
            onUpdateOrder(updatedOrder);
        } else {
            const newOrder: Omit<Order, 'id'> = {
                productName,
                quantity,
                clientId,
                vendorId,
                orderDate: new Date().toISOString().split('T')[0],
                vendorDueDate,
                status: OrderStatus.PENDING,
                clientUnitPrice,
                clientPrice: clientUnitPrice * quantity,
                vendorUnitPrice,
                vendorCost: vendorUnitPrice * quantity,
                clientPayments: [],
                vendorPayments: [],
                additionalCosts: [],
            };
            onAddOrder(newOrder);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{orderToEdit ? 'Edit Order' : 'Tambah Order Baru'}</h3>
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nama Produk</label>
                <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Jumlah</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required min="1" />
                </div>
                 <div>
                    <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
                    <select id="client" value={clientId} onChange={e => setClientId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                        <option value="" disabled>Pilih Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Vendor</label>
                    <select id="vendor" value={vendorId} onChange={e => setVendorId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                        <option value="" disabled>Pilih Vendor</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="vendorDueDate" className="block text-sm font-medium text-gray-700">Estimasi Penyelesaian</label>
                    <input type="date" id="vendorDueDate" value={vendorDueDate} onChange={e => setVendorDueDate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="clientPrice" className="block text-sm font-medium text-gray-700">Harga Jual Satuan</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">Rp</span>
                        </div>
                        <input type="number" id="clientPrice" value={clientUnitPrice} onChange={e => setClientUnitPrice(Number(e.target.value))} className="w-full border-gray-300 rounded-md p-2 pl-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required min="0"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="vendorCost" className="block text-sm font-medium text-gray-700">Harga Beli Satuan</label>
                     <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">Rp</span>
                        </div>
                        <input type="number" id="vendorCost" value={vendorUnitPrice} onChange={e => setVendorUnitPrice(Number(e.target.value))} className="w-full border-gray-300 rounded-md p-2 pl-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required min="0"/>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Simpan Order</button>
            </div>
        </form>
    );
}

const Orders: React.FC<OrdersProps> = ({ orders, clients, vendors, shipments, onAddOrder, onUpdateOrder, onUpdateStatus }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

    const isModalOpen = isAddModalOpen || !!orderToEdit;

    const handleCloseModal = () => {
        setAddModalOpen(false);
        setOrderToEdit(null);
    };

    const handleEditClick = (order: Order) => {
        setOrderToEdit(order);
    };

    const getShipmentCostForOrder = (orderId: string): number => {
        const shipment = shipments.find(s => s.orderIds.includes(orderId));
        if (shipment && shipment.orderIds.length > 0) {
            return shipment.cost / shipment.orderIds.length;
        }
        return 0;
    }

  return (
    <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Order</h1>
            <button onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
                + Tambah Order
            </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Estimasi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pengerjaan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Bersih</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => {
                            const clientName = clients.find(c => c.id === order.clientId)?.name || 'N/A';
                            const totalAdditionalCosts = order.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);
                            const shipmentCost = getShipmentCostForOrder(order.id);
                            const totalCost = order.vendorCost + totalAdditionalCosts + shipmentCost;
                            const netProfit = order.clientPrice - totalCost;

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const dueDate = new Date(order.vendorDueDate);
                            
                            const isRelevantStatus = order.status === OrderStatus.PRODUKSI || order.status === OrderStatus.PENDING;
                            let productionStatusElem = <span className="text-gray-500">-</span>;

                            if (isRelevantStatus) {
                                const diffTime = dueDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                const showNotification = diffDays >= 0 && diffDays <= 3;

                                if (diffDays < 0) {
                                    productionStatusElem = <span className="text-red-600 font-semibold">Overtime</span>;
                                } else {
                                    productionStatusElem = (
                                        <div className="flex items-center">
                                            <span className="text-green-600 font-semibold">On Track</span>
                                            {showNotification && (
                                                <span title={`Batas waktu dalam ${diffDays} hari`} className="ml-2 text-yellow-500 animate-pulse">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    );
                                }
                            }

                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{order.productName}</div><div className="text-sm text-gray-500">{order.quantity} pcs</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{order.id.toUpperCase()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{new Date(order.vendorDueDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                            className={`p-1 text-xs leading-5 font-semibold rounded-full border-none focus:ring-0 appearance-none ${getStatusColor(order.status)}`}
                                        >
                                            <option value={OrderStatus.PENDING}>Pending</option>
                                            <option value={OrderStatus.PRODUKSI}>Produksi</option>
                                            <option value={OrderStatus.SHIPPING}>Shipping</option>
                                            <option value={OrderStatus.DELIVERED}>Delivered</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {productionStatusElem}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(netProfit)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleEditClick(order)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <OrderForm 
                clients={clients} 
                vendors={vendors} 
                onAddOrder={onAddOrder}
                onUpdateOrder={onUpdateOrder}
                orderToEdit={orderToEdit}
                onClose={handleCloseModal} 
            />
        </Modal>
    </div>
  );
};

export default Orders;