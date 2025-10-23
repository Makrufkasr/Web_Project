// Fix: Create the Reports component.
import React, { useState, useMemo } from 'react';
import { Order, Shipment } from '../types';

interface ReportsProps {
  orders: Order[];
  shipments: Shipment[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const StatCard: React.FC<{ title: string; value: string; description?: string }> = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
);

const Reports: React.FC<ReportsProps> = ({ orders, shipments }) => {
    const [selectedYear, setSelectedYear] = useState<string>('all');

    const availableYears = useMemo(() => {
        const years = new Set(orders.map(order => new Date(order.orderDate).getFullYear().toString()));
        return ['all', ...Array.from(years).sort((a, b) => Number(b) - Number(a))];
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (selectedYear === 'all') {
            return orders;
        }
        return orders.filter(order => new Date(order.orderDate).getFullYear().toString() === selectedYear);
    }, [orders, selectedYear]);

    const getShipmentCostForOrder = (orderId: string): number => {
        const shipment = shipments.find(s => s.orderIds.includes(orderId));
        if (shipment && shipment.orderIds.length > 0) {
            return shipment.cost / shipment.orderIds.length;
        }
        return 0;
    }

    const reportData = filteredOrders.reduce((acc, order) => {
        const additionalCosts = order.additionalCosts.reduce((aSum, a) => aSum + a.amount, 0);
        const shipmentCost = getShipmentCostForOrder(order.id);
        const totalCost = order.vendorCost + additionalCosts + shipmentCost;
        const profit = order.clientPrice - totalCost;

        acc.totalRevenue += order.clientPrice;
        acc.totalCost += totalCost;
        acc.totalProfit += profit;
        
        return acc;
    }, { totalRevenue: 0, totalCost: 0, totalProfit: 0 });

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Laporan & Analitik</h1>
                <div className="flex items-center">
                    <label htmlFor="year-filter" className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">Filter Tahun:</label>
                    <select
                        id="year-filter"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>
                                {year === 'all' ? 'Semua Tahun' : year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Pendapatan" 
                    value={formatCurrency(reportData.totalRevenue)}
                    description="Total nilai dari semua order."
                />
                <StatCard 
                    title="Total Biaya Keseluruhan" 
                    value={formatCurrency(reportData.totalCost)}
                    description="Termasuk biaya vendor, tambahan, dan pengiriman."
                />
                 <StatCard 
                    title="Laba Bersih" 
                    value={formatCurrency(reportData.totalProfit)}
                    description="Pendapatan dikurangi semua biaya."
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Rincian Profitabilitas per Produk ({selectedYear === 'all' ? 'Semua Tahun' : selectedYear})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Produk</th>
                                <th className="p-4 font-semibold text-gray-600">Pendapatan</th>
                                <th className="p-4 font-semibold text-gray-600">Total Biaya</th>
                                <th className="p-4 font-semibold text-gray-600">Laba Bersih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? filteredOrders.map(order => {
                                const additionalCosts = order.additionalCosts.reduce((aSum, a) => aSum + a.amount, 0);
                                const shipmentCost = getShipmentCostForOrder(order.id);
                                const totalCost = order.vendorCost + additionalCosts + shipmentCost;
                                const profit = order.clientPrice - totalCost;

                                return (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{order.productName}</td>
                                        <td className="p-4">{formatCurrency(order.clientPrice)}</td>
                                        <td className="p-4 text-red-600">{formatCurrency(totalCost)}</td>
                                        <td className={`p-4 font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(profit)}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-500">
                                        Tidak ada data untuk tahun yang dipilih.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;