import React from 'react';
import { Order, Client, Vendor, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
  clients: Client[];
  vendors: Vendor[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const OwedAmount: React.FC<{amount: number}> = ({ amount }) => {
    if (amount <= 0) {
        return <span className="font-medium text-green-600">Lunas</span>;
    }
    return <span className="font-medium text-red-600">{formatCurrency(amount)}</span>;
};

const Dashboard: React.FC<DashboardProps> = ({ orders, clients, vendors }) => {
    const totalClientOwed = orders.reduce((acc, order) => {
        const totalPaid = order.clientPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
        return acc + (order.clientPrice - totalPaid);
    }, 0);

    const totalVendorOwed = orders.reduce((acc, order) => {
        const totalPaid = order.vendorPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
        const totalAdditionalCosts = order.additionalCosts.reduce((cAcc, c) => cAcc + c.amount, 0);
        return acc + (order.vendorCost + totalAdditionalCosts - totalPaid);
    }, 0);

    const unfinishedOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED);
    const unfinishedProductsCount = unfinishedOrders.length;
    const unfinishedClientsCount = new Set(unfinishedOrders.map(o => o.clientId)).size;
    const unfinishedVendorsCount = new Set(unfinishedOrders.map(o => o.vendorId)).size;
    const ordersInProduction = orders.filter(o => o.status === OrderStatus.PRODUKSI).length;
    
    const IconBox = (d:string) => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg>;

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Kekurangan Bayar Client" value={formatCurrency(totalClientOwed)} icon={IconBox("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01")} color="bg-red-500" />
            <StatCard title="Kekurangan Bayar ke Vendor" value={formatCurrency(totalVendorOwed)} icon={IconBox("M13 17h8m-8-8h8m-8 4h8m-9 4v-4m0 0h-2a2 2 0 01-2-2V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V17a2 2 0 01-2 2h-3.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 016 13.586V7m0 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5")} color="bg-orange-500" />
            <StatCard title="Produk Belum Selesai" value={unfinishedProductsCount.toString()} icon={IconBox("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z")} color="bg-purple-500" />
            <StatCard title="Client Belum Selesai" value={unfinishedClientsCount.toString()} icon={IconBox("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z")} color="bg-teal-500" />
            <StatCard title="Vendor Belum Selesai" value={unfinishedVendorsCount.toString()} icon={IconBox("M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z")} color="bg-indigo-500" />
            <StatCard title="Order Dalam Produksi" value={ordersInProduction.toString()} icon={IconBox("M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4")} color="bg-blue-500" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Order Terbaru</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-600">Produk</th>
                            <th className="p-4 font-semibold text-gray-600">Client</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Harga Client</th>
                            <th className="p-4 font-semibold text-gray-600">Sisa Tagihan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map(order => {
                             const clientName = clients.find(c => c.id === order.clientId)?.name || 'N/A';
                             const totalPaid = order.clientPayments.reduce((acc, p) => acc + p.amount, 0);
                             const remaining = order.clientPrice - totalPaid;
                            return (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{order.productName}</td>
                                <td className="p-4">{clientName}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === OrderStatus.PRODUKSI ? 'bg-yellow-100 text-yellow-800' : order.status === OrderStatus.SHIPPING ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{order.status}</span></td>
                                <td className="p-4">{formatCurrency(order.clientPrice)}</td>
                                <td className="p-4"><OwedAmount amount={remaining} /></td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;