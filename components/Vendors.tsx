import React, { useState } from 'react';
import { Vendor, Order } from '../types';
import Modal from './Modal';

interface VendorsProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
  orders: Order[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const AddVendorForm: React.FC<{ onAddVendor: VendorsProps['onAddVendor'], onClose: () => void }> = ({ onAddVendor, onClose }) => {
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [contact, setContact] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !specialty || !contact) return;
        onAddVendor({ name, specialty, contact });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Tambah Vendor Baru</h3>
            <div className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Vendor" className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="Spesialisasi" className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Kontak (No. HP/Email)" className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Simpan Vendor</button>
            </div>
        </form>
    );
};

const Vendors: React.FC<VendorsProps> = ({ vendors, onAddVendor, orders }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Vendor</h1>
                <button onClick={() => setModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
                    + Tambah Vendor
                </button>
            </div>

             <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tagihan ke Vendor</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kekurangan Bayar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendors.map((vendor) => {
                            const vendorOrders = orders.filter(o => o.vendorId === vendor.id);
                            const totalCost = vendorOrders.reduce((sum, o) => {
                                const additionalCosts = o.additionalCosts.reduce((aSum, a) => aSum + a.amount, 0);
                                return sum + o.vendorCost + additionalCosts;
                            }, 0);
                            const totalPaid = vendorOrders.reduce((sum, o) => sum + o.vendorPayments.reduce((pSum, p) => pSum + p.amount, 0), 0);
                            const totalOwed = totalCost - totalPaid;

                            return (
                                <tr key={vendor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.specialty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(totalCost)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${totalOwed > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {totalOwed > 0 ? formatCurrency(totalOwed) : 'Lunas'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <AddVendorForm onAddVendor={onAddVendor} onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Vendors;