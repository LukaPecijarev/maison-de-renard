import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';

const CartPage = () => {
    const { order, loading, confirmOrder, fetchPendingOrder } = useOrder();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleRemoveItem = async (productId) => {
        // We'll implement this in the hook
        try {
            // Call remove from cart API
            await fetch(`http://localhost:8080/api/products/${productId}/remove-from-cart`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchPendingOrder(); // Refresh cart
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = async () => {
        if (window.confirm('Confirm your order?')) {
            try {
                await confirmOrder();
                alert('Order confirmed successfully!');
                navigate('/orders');
            } catch (error) {
                alert('Failed to confirm order');
            }
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    const cartItems = order?.products || [];
    const isEmpty = cartItems.length === 0;

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h3" component="h1">
                    Shopping Cart
                </Typography>
            </Box>

            {isEmpty ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                        sx={{ mt: 3 }}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
                    {/* Cart Items */}
                    <Box>
                        {cartItems.map((item) => (
                            <Card key={item.id} sx={{ display: 'flex', mb: 2, position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 150, objectFit: 'cover' }}
                                    image={item.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                />
                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {item.description}
                                    </Typography>
                                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" color="primary">
                                            ${item.price.toFixed(2)}
                                        </Typography>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemoveItem(item.id)}
                                            aria-label="remove from cart"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {/* Order Summary */}
                    <Box>
                        <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
                            <Typography variant="h5" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">
                                        Items ({cartItems.length})
                                    </Typography>
                                    <Typography>
                                        ${total.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">
                                        Shipping
                                    </Typography>
                                    <Typography color="success.main">
                                        FREE
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">
                                    Total
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    ${total.toFixed(2)}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleCheckout}
                                sx={{ mb: 2 }}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/products')}
                            >
                                Continue Shopping
                            </Button>
                        </Card>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default CartPage;