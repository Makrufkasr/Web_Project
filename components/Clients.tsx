import React, { useState } from 'react';
import { Client, Order } from '../types';
import Modal from './Modal';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  orders: Order[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const AddClientForm: React.FC<{ onAddClient: ClientsProps['onAddClient'], onClose: () => void }> = ({ onAddClient, onClose }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !contact) return;
        onAddClient({ name, contact });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Tambah Client Baru</h3>
            <div className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Client" className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Kontak (No. HP/Email)" className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Simpan Client</button>
            </div>
        </form>
    );
};

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, orders }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Client</h1>
            <button onClick={() => setModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
                + Tambah Client
            </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Transaksi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kekurangan Bayar</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => {
                        const clientOrders = orders.filter(o => o.clientId === client.id);
                        const totalTransaction = clientOrders.reduce((sum, o) => sum + o.clientPrice, 0);
                        const totalPaid = clientOrders.reduce((sum, o) => sum + o.clientPayments.reduce((pSum, p) => pSum + p.amount, 0), 0);
                        const totalOwed = totalTransaction - totalPaid;

                        return (
                            <tr key={client.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contact}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(totalTransaction)}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${totalOwed > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {totalOwed > 0 ? formatCurrency(totalOwed) : 'Lunas'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <AddClientForm onAddClient={onAddClient} onClose={() => setModalOpen(false)} />
        </Modal>
    </div>
  );
};

export default Clients;