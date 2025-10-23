import React, { useState, useMemo } from 'react';
import { Order, Client, Vendor } from '../types';

interface ProductsProps {
  orders: Order[];
  clients: Client[];
  vendors: Vendor[];
}

interface ProcessedProduct {
  name: string;
  lastVendorUnitPrice: number;
  lastClientUnitPrice: number;
  lastOrderDate: string;
  lastClientName: string;
  lastVendorName: string;
}

type SortKey = keyof ProcessedProduct | '';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const SortableHeader: React.FC<{
    title: string;
    sortKey: SortKey;
    currentSortKey: SortKey;
    sortAsc: boolean;
    onSort: (key: SortKey) => void;
}> = ({ title, sortKey, currentSortKey, sortAsc, onSort }) => {
    const isActive = currentSortKey === sortKey;
    const icon = isActive ? (sortAsc ? '▲' : '▼') : '';
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => onSort(sortKey)}>
            <div className="flex items-center">
                <span>{title}</span>
                <span className="ml-2 w-4">{icon}</span>
            </div>
        </th>
    );
};

const Products: React.FC<ProductsProps> = ({ orders, clients, vendors }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Sorting state for Client Table
    const [clientSortKey, setClientSortKey] = useState<SortKey>('name');
    const [clientSortAsc, setClientSortAsc] = useState(true);

    // Sorting state for Vendor Table
    const [vendorSortKey, setVendorSortKey] = useState<SortKey>('name');
    const [vendorSortAsc, setVendorSortAsc] = useState(true);

    const processedProducts = useMemo(() => {
        const productsMap = new Map<string, Order[]>();
        orders.forEach(order => {
            const productOrders = productsMap.get(order.productName) || [];
            productsMap.set(order.productName, [...productOrders, order]);
        });

        const products: ProcessedProduct[] = [];
        productsMap.forEach((productOrders, productName) => {
            const sortedByDate = [...productOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            const latestOrder = sortedByDate[0];
            
            const clientName = clients.find(c => c.id === latestOrder.clientId)?.name || 'N/A';
            const vendorName = vendors.find(v => v.id === latestOrder.vendorId)?.name || 'N/A';

            products.push({
                name: productName,
                lastVendorUnitPrice: latestOrder.vendorUnitPrice,
                lastClientUnitPrice: latestOrder.clientUnitPrice,
                lastOrderDate: latestOrder.orderDate,
                lastClientName: clientName,
                lastVendorName: vendorName,
            });
        });

        return products;
    }, [orders, clients, vendors]);

    const sortData = (data: ProcessedProduct[], key: SortKey, asc: boolean) => {
        if (!key) return data;
        return [...data].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (typeof valA === 'string' && typeof valB === 'string') {
                return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return asc ? valA - valB : valB - valA;
            }
            return 0;
        });
    };

    const filteredProducts = useMemo(() => 
        processedProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lastClientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lastVendorName.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [processedProducts, searchTerm]
    );

    const clientProducts = useMemo(() => sortData(filteredProducts, clientSortKey, clientSortAsc), [filteredProducts, clientSortKey, clientSortAsc]);
    const vendorProducts = useMemo(() => sortData(filteredProducts, vendorSortKey, vendorSortAsc), [filteredProducts, vendorSortKey, vendorSortAsc]);

    const handleClientSort = (key: SortKey) => {
        if (clientSortKey === key) setClientSortAsc(!clientSortAsc);
        else { setClientSortKey(key); setClientSortAsc(true); }
    };
    
    const handleVendorSort = (key: SortKey) => {
        if (vendorSortKey === key) setVendorSortAsc(!vendorSortAsc);
        else { setVendorSortKey(key); setVendorSortAsc(true); }
    };

    const ProductTable: React.FC<{
        title: string;
        products: ProcessedProduct[];
        priceColumnTitle: string;
        priceKey: 'lastClientUnitPrice' | 'lastVendorUnitPrice';
        nameColumnTitle: string;
        nameKey: 'lastClientName' | 'lastVendorName';
        sortKey: SortKey;
        sortAsc: boolean;
        onSort: (key: SortKey) => void;
    }> = ({ title, products, priceColumnTitle, priceKey, nameColumnTitle, nameKey, sortKey, sortAsc, onSort }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800 p-6">{title}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader title="Nama Produk" sortKey="name" currentSortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                            <SortableHeader title={nameColumnTitle} sortKey={nameKey} currentSortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                            <SortableHeader title={priceColumnTitle} sortKey={priceKey} currentSortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                            <SortableHeader title="Transaksi Terakhir" sortKey="lastOrderDate" currentSortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product.name} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product[nameKey]}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product[priceKey])}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(product.lastOrderDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center p-8 text-gray-500">
                                    {searchTerm ? 'Data tidak ditemukan.' : 'Tidak ada data produk.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Referensi Harga Produk</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari produk/client/vendor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <ProductTable 
                title="Riwayat Harga Jual (Client)"
                products={clientProducts}
                priceColumnTitle="Harga Satuan Jual Terakhir"
                priceKey="lastClientUnitPrice"
                nameColumnTitle="Client"
                nameKey="lastClientName"
                sortKey={clientSortKey}
                sortAsc={clientSortAsc}
                onSort={handleClientSort}
            />

            <ProductTable 
                title="Riwayat Harga Beli (Vendor)"
                products={vendorProducts}
                priceColumnTitle="Harga Satuan Beli Terakhir"
                priceKey="lastVendorUnitPrice"
                nameColumnTitle="Vendor"
                nameKey="lastVendorName"
                sortKey={vendorSortKey}
                sortAsc={vendorSortAsc}
                onSort={handleVendorSort}
            />
        </div>
    );
};

export default Products;
