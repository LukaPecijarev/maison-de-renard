import { useCallback, useEffect, useState } from 'react';
import orderRepository from '../repository/orderRepository';
import useAuth from './useAuth';

const useOrder = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();


    console.log('🛒 CartPage - order:', order);
    console.log('🛒 CartPage - loading:', loading);
    console.log('🛒 CartPage - cartItems:', order?.products);

    const fetchPendingOrder = useCallback(() => {
        if (!isAuthenticated()) {
            setOrder(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        orderRepository
            .findPending()
            .then((response) => {
                console.log('📦 Cart data:', response.data);
                setOrder(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order:', error);
                setOrder(null);
                setLoading(false);
            });
    }, [isAuthenticated]);

    const confirmOrder = useCallback(() => {
        orderRepository
            .confirmPendingOrder()
            .then(() => {
                fetchPendingOrder();
            })
            .catch((error) => console.error('Error confirming order:', error));
    }, [fetchPendingOrder]);

    const cancelOrder = useCallback(() => {
        orderRepository
            .cancelPendingOrder()
            .then(() => {
                fetchPendingOrder();
            })
            .catch((error) => console.error('Error cancelling order:', error));
    }, [fetchPendingOrder]);

    useEffect(() => {
        fetchPendingOrder();
    }, [fetchPendingOrder]);

    return {
        order,
        loading,
        confirmOrder,
        cancelOrder,
        fetchPendingOrder,
    };
};

export default useOrder;