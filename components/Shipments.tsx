// Fix: Create the Shipments component.
import React, { useState } from 'react';
import { Order, Client, OrderStatus, Shipment } from '../types';
import Modal from './Modal';

interface ShipmentsProps {
  shipments: Shipment[];
  orders: Order[];
  clients: Client[];
  onAddShipment: (shipment: Omit<Shipment, 'id' | 'shipmentDate'>) => void;
  onTrackShipment: (shipmentId: string) => Promise<void>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const AddShipmentForm: React.FC<{
    orders: Order[];
    onAddShipment: ShipmentsProps['onAddShipment'];
    onClose: () => void;
}> = ({ orders, onAddShipment, onClose }) => {
    const [courier, setCourier] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [cost, setCost] = useState(0);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

    const availableOrders = orders.filter(o => o.status === OrderStatus.PRODUKSI || o.status === OrderStatus.PENDING);

    const handleOrderSelect = (orderId: string) => {
        setSelectedOrderIds(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!courier || cost <= 0 || selectedOrderIds.length === 0) {
            alert('Harap isi semua data: kurir, biaya, dan pilih minimal satu order.');
            return;
        }
        onAddShipment({ courier, trackingNumber, cost, orderIds: selectedOrderIds });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Buat Pengiriman Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jasa Kirim</label>
                    <input type="text" value={courier} onChange={e => setCourier(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">No. Resi (Opsional)</label>
                    <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Biaya Pengiriman</label>
                    <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" required min="1"/>
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Order untuk Dikirim</label>
                 <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                    {availableOrders.length > 0 ? availableOrders.map(order => (
                        <div key={order.id} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                            <input 
                                type="checkbox"
                                id={`order-${order.id}`}
                                checked={selectedOrderIds.includes(order.id)}
                                onChange={() => handleOrderSelect(order.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`order-${order.id}`} className="ml-3 text-sm text-gray-700">
                                <span className="font-medium">{order.productName}</span> ({order.id.toUpperCase()})
                            </label>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 text-center py-4">Tidak ada order yang siap dikirim.</p>
                    )}
                 </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Buat Pengiriman</button>
            </div>
        </form>
    );
};


const Shipments: React.FC<ShipmentsProps> = ({ shipments, orders, clients, onAddShipment, onTrackShipment }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [trackingId, setTrackingId] = useState<string | null>(null);

    const handleTrackClick = async (shipmentId: string) => {
        setTrackingId(shipmentId);
        await onTrackShipment(shipmentId);
        setTrackingId(null);
    };

    const getOrderDetails = (orderId: string) => {
        return orders.find(o => o.id === orderId);
    }

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Pengiriman</h1>
                <button onClick={() => setModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
                    + Tambah Pengiriman
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurir & Resi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Terkait</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biaya Kirim</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Terakhir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shipments.length > 0 ? shipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(shipment.shipmentDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{shipment.courier}</div>
                                        <div className="text-sm text-gray-500 font-mono">{shipment.trackingNumber || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            {shipment.orderIds.map(orderId => {
                                                const order = getOrderDetails(orderId);
                                                return order ? <li key={orderId}>{order.productName} ({orderId.toUpperCase()})</li> : null;
                                            })}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{formatCurrency(shipment.cost)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {shipment.latestStatus || <span className="text-gray-400 italic">Belum dilacak</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleTrackClick(shipment.id)} 
                                            disabled={!shipment.trackingNumber || trackingId === shipment.id}
                                            className="disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {trackingId === shipment.id ? 'Melacak...' : 'Lacak'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">
                                        Belum ada data pengiriman.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <AddShipmentForm orders={orders} onAddShipment={onAddShipment} onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Shipments;