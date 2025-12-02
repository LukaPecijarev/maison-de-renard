import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import useProducts from '../hooks/useProducts';
import categoryRepository from '../repository/categoryRepository';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam ? parseInt(categoryParam) : null);
    const [categoryData, setCategoryData] = useState(null);

    // Update selected category when URL changes
    useEffect(() => {
        setSelectedCategory(categoryParam ? parseInt(categoryParam) : null);

        // Fetch category details
        if (categoryParam) {
            categoryRepository.findById(categoryParam)
                .then(response => setCategoryData(response.data))
                .catch(error => console.error('Error fetching category:', error));
        }
    }, [categoryParam]);

    const { products, loading } = useProducts(selectedCategory);

    // Get category-specific video
    const getCategoryVideo = () => {
        if (!categoryData) return null;

        const categoryName = categoryData.name;
        if (categoryName === 'Men') return '/ManVideo.mp4';
        if (categoryName === 'Women') return '/WomenVideo.mp4';
        if (categoryName === 'Gifts') return '/GiftsVideo.mp4';
        return null;
    };

    // Component for image with hover effect (same as HomePage)
    const ImageWithHover = ({ product, onClick }) => {
        const [isHovered, setIsHovered] = useState(false);

        // Parse imageUrl - should be in format: "url1,url2" or just "url1"
        const images = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()) : [];
        const defaultImage = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500';
        const hoverImage = images[1] || defaultImage; // Use second image if available, otherwise use default

        // Format price in euros
        const formattedPrice = `€${product.price.toFixed(0)}`;

        return (
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <Box
                    component="img"
                    src={isHovered ? hoverImage : defaultImage}
                    alt={product.name}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all 0.6s ease',
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        display: 'block',
                        filter: 'brightness(0.98) contrast(1.02)',
                        mixBlendMode: 'multiply',
                    }}
                />

                {/* Shopping Bag Icon */}
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'transparent',
                        width: 36,
                        height: 36,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/cart');
                    }}
                >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
                </IconButton>

                {/* Price Popup - Shows on Hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.4s ease',
                        backgroundColor: '#f5ebe0',
                        padding: '8px 20px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        pointerEvents: 'none',
                        minWidth: '140px',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            color: 'rgba(44, 44, 44, 0.7)',
                            letterSpacing: '0.05em',
                            mb: 0.3,
                            textTransform: 'uppercase',
                        }}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#2c2c2c',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {formattedPrice}
                    </Typography>
                </Box>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
                {/* Category Section */}
                <Box sx={{ mb: 6 }}>
                    {/* Category Title */}
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 2,
                        }}
                    >
                        {categoryData?.name || 'Products'}
                    </Typography>

                    {/* Category Description */}
                    {categoryData?.description && (
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                maxWidth: 800,
                                mx: 'auto',
                                mb: 5,
                                lineHeight: 1.8,
                                color: '#666',
                                fontSize: '0.95rem',
                            }}
                        >
                            {categoryData.description}
                        </Typography>
                    )}

                    {/* Products Grid - 4 columns like HomePage */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 3,
                            mb: 6,
                        }}
                    >
                        {products.slice(0, 4).map((product) => (
                            <ImageWithHover
                                key={product.id}
                                product={product}
                                onClick={() => navigate(`/products/${product.id}`)}
                            />
                        ))}
                    </Box>

                    {/* Mid-Section Video - Vertical (after first 4 products) */}
                    {products.length > 4 && getCategoryVideo() && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '80vh',
                                mb: 6,
                                overflow: 'hidden',
                                backgroundColor: '#f5f1e8',
                            }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '60%',
                                    height: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={getCategoryVideo()} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    )}

                    {/* Remaining Products Grid (products 5-12) */}
                    {products.length > 4 && (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                gap: 3,
                            }}
                        >
                            {products.slice(4).map((product) => (
                                <ImageWithHover
                                    key={product.id}
                                    product={product}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            ))}
                        </Box>
                    )}

                    {/* No products message */}
                    {products.length === 0 && (
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: '#666',
                                mt: 8,
                            }}
                        >
                            No products found in this category
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default ProductsPage;