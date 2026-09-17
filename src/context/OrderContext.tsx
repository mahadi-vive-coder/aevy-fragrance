import React, { createContext, useContext, useState } from 'react';
import { DBOrder } from '../types';
import {
  createOrder as createDbOrder,
  trackOrder as trackDbOrder,
  CheckoutPayload,
  CheckoutResult
} from '../lib/shopData';

export interface CompletedOrderSummary {
  orderNumber: string;
  orderId?: string;
  customerName: string;
  phone: string;
  fullAddress: string;
  paymentMethod: string;
  total: number;
}

interface OrderContextType {
  lastCreatedOrder: CompletedOrderSummary | null;
  setLastCreatedOrder: (order: CompletedOrderSummary | null) => void;
  placeOrder: (payload: CheckoutPayload) => Promise<CheckoutResult>;
  lookupOrder: (orderNumber: string, phone: string) => Promise<DBOrder | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastCreatedOrder, setLastCreatedOrder] = useState<CompletedOrderSummary | null>(() => {
    try {
      const session = sessionStorage.getItem('aevy_last_order');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const updateLastCreatedOrder = (order: CompletedOrderSummary | null) => {
    setLastCreatedOrder(order);
    try {
      if (order) {
        sessionStorage.setItem('aevy_last_order', JSON.stringify(order));
      } else {
        sessionStorage.removeItem('aevy_last_order');
      }
    } catch {
      // Ignore sessionStorage issues
    }
  };

  const placeOrder = async (payload: CheckoutPayload): Promise<CheckoutResult> => {
    const result = await createDbOrder(payload);
    if (result.success && result.orderNumber) {
      // Calculate total from authoritative items
      const subtotal = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
      updateLastCreatedOrder({
        orderNumber: result.orderNumber,
        orderId: result.orderId,
        customerName: payload.customerName,
        phone: payload.customerPhone,
        fullAddress: `${payload.fullAddress}, ${payload.thanaUpazila}, ${payload.district}`,
        paymentMethod: payload.paymentMethod,
        total: result.total ?? subtotal,
      });
    }
    return result;
  };

  const lookupOrder = async (orderNumber: string, phone: string): Promise<DBOrder | null> => {
    return trackDbOrder(orderNumber, phone);
  };

  return (
    <OrderContext.Provider
      value={{
        lastCreatedOrder,
        setLastCreatedOrder: updateLastCreatedOrder,
        placeOrder,
        lookupOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
