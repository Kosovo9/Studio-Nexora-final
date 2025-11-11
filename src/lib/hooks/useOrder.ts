import { useState } from 'react';
import { createOrder, createOrderCheckout, processOrder, getUserOrders, type Order } from '../services/orderService';

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (options: {
    userId: string;
    packageType: string;
    photoUploadIds: string[];
    referralCode?: string;
    paymentProvider?: 'stripe' | 'lemonsqueezy';
  }): Promise<Order | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: orderError } = await createOrder(options);
      
      if (orderError) {
        setError(orderError);
        return null;
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (orderId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { checkoutUrl, error: checkoutError } = await createOrderCheckout(orderId);
      
      if (checkoutError) {
        setError(checkoutError);
        return null;
      }

      return checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const process = async (orderId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { success, error: processError } = await processOrder(orderId);
      
      if (processError) {
        setError(processError);
        return false;
      }

      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to process order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async (userId: string): Promise<Order[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: ordersError } = await getUserOrders(userId);
      
      if (ordersError) {
        setError(ordersError);
        return [];
      }

      return data || [];
    } catch (err: any) {
      setError(err.message || 'Failed to get orders');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { create, checkout, process, getOrders, loading, error };
}

