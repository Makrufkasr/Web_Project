// Fix: Create and export the necessary type definitions.
export enum OrderStatus {
  PRODUKSI = 'Produksi',
  SHIPPING = 'Shipping',
  DELIVERED = 'Delivered',
  PENDING = 'Pending',
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
}

export interface AdditionalCost {
  id: string;
  description: string;
  amount: number;
}

export interface Shipment {
  id: string;
  courier: string;
  trackingNumber: string;
  cost: number;
  orderIds: string[];
  shipmentDate: string;
  latestStatus?: string;
}

export interface Order {
  id: string;
  productName: string;
  quantity: number;
  clientId: string;
  vendorId: string;
  orderDate: string;
  vendorDueDate: string;
  status: OrderStatus;
  clientPrice: number; // total price = quantity * clientUnitPrice
  clientUnitPrice: number;
  vendorCost: number; // total cost = quantity * vendorUnitPrice
  vendorUnitPrice: number;
  clientPayments: Payment[];
  vendorPayments: Payment[];
  additionalCosts: AdditionalCost[];
  shipmentId?: string;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  contact: string;
}