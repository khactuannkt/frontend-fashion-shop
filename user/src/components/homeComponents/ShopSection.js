import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useDispatch, useSelector } from 'react-redux';
import { listProduct } from '../../Redux/Actions/productActions';
import Message from '../LoadingError/Error';
import { listCart } from '../../Redux/Actions/cartActions';
import FilterSection from './FilterSection';
import { Button, Skeleton } from '@mui/material';
import './styles.scss';
import Pagination from './pagination';
const LoadingEachProduct = () => {
    return (
        <div className="loading-each-product" style={{ margin: '15px 7.9px' }}>
            <Skeleton variant="rectangular" width={'100%'} height={209} />
            <Skeleton />
            <Skeleton />
            <Skeleton width="60%" />
        </div>
    );
};
const ShopSection = (props) => {
    const dispatch = useDispatch();
    const { keyword, pageNumber = 1, queryCategory } = props;
    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;
    const [rating, setRating] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [category, setCategory] = useState(queryCategory);
    const [maxPrice, setMaxPrice] = useState('');
    const [priceOrder, setPriceOrder] = useState('');
    let SkeletonOption = window.innerWidth > 540 ? [1, 2, 3, 4, 5, 6] : [1];
    useEffect(() => {
        if (category != queryCategory) setCategory(queryCategory);
    }, [queryCategory]);
    useEffect(() => {
        dispatch(listProduct({ category, keyword, pageNumber, rating, minPrice, maxPrice, priceOrder }));
    }, [dispatch, category, keyword, rating, minPrice, maxPrice, priceOrder, pageNumber]);

    return (
        <>
            <div className="shop-section-container">
                <div className="section">
                    <div className="row">
                        {keyword || category ? (
                            <FilterSection
                                setRating={setRating}
                                setMinPrice={setMinPrice}
                                setMaxPrice={setMaxPrice}
                                setCategory={setCategory}
                                rating={rating}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                categoryCurrent={category}
                                keyword={keyword}
                            ></FilterSection>
                        ) : null}
                        <div
                            style={{ paddingLeft: 0, paddingRight: 0 }}
                            className={` ${keyword || category ? 'col-lg-10' : 'col-lg-12'} col-md-9 article`}
                        >
                            <div className=" row">
                                {loading ? (
                                    <>
                                        <div style={{ display: 'flex', width: '100%' }} className="col-lg-12">
                                            {SkeletonOption.map(() => (
                                                <LoadingEachProduct />
                                            ))}
                                        </div>
                                    </>
                                ) : error ? (
                                    <Message variant="alert-danger">{error}</Message>
                                ) : (
                                    <>
                                        {!loading &&
                                            (products?.length === 0 || !products ? (
                                                <div
                                                    className="col-lg-12 col-md-6 col-sm-6 d-flex align-content-center justify-center flex-column"
                                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <div className="position-relative">
                                                        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png" />
                                                        <div
                                                            className="position-absolute"
                                                            style={{ bottom: '15px', right: '50px' }}
                                                        >
                                                            NOT FOUND PRODUCT
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {(keyword || category) && products && products?.length > 2 && (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'left',
                                                                marginBottom: '10px',
                                                                marginRight: '20px',
                                                            }}
                                                            className="filter-custom-wrap"
                                                        >
                                                            <span>Sort by</span>
                                                            <Button
                                                                onClick={(e) => {
                                                                    setPriceOrder(e.target.value);
                                                                }}
                                                                type="ghost"
                                                            >
                                                                Newest
                                                            </Button>
                                                            <div
                                                                className=""
                                                                style={{ cursor: 'pointer', zIndex: '2' }}
                                                            >
                                                                <select
                                                                    tabIndex={-2}
                                                                    className="form-select"
                                                                    value={priceOrder}
                                                                    style={{ cursor: 'pointer', zIndex: '10' }}
                                                                    onChange={(e) => {
                                                                        setPriceOrder(e.target.value);
                                                                    }}
                                                                >
                                                                    <option>Price</option>
                                                                    <option value="asc">
                                                                        Prices gradually increase
                                                                    </option>
                                                                    <option value="desc">Price descending</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!keyword && !category ? (
                                                        <div className="row divider-custom">
                                                            <span>Sản phẩm hôm nay</span>
                                                        </div>
                                                    ) : null}
                                                    {products?.map((product) => (
                                                        <div
                                                            className="col-lg-2 col-md-6 col-sm-6 product-card-wrap"
                                                            key={product._id}
                                                        >
                                                            <div className="border-product product-card-item">
                                                                <Link to={`/product/${product._id}`}>
                                                                    <div className="product-card-item-img-wrap">
                                                                        <img
                                                                            src={product?.images?.[0]}
                                                                            alt={product.name}
                                                                        />
                                                                    </div>
                                                                </Link>

                                                                <div className="shoptext">
                                                                    <p>
                                                                        <Link to={`/product/${product._id}`}>
                                                                            {product.name}
                                                                        </Link>
                                                                    </p>

                                                                    <Rating
                                                                        value={product.rating}
                                                                        text={`${product.numReviews} reviews`}
                                                                    />
                                                                    <h3>${product.price.toFixed(2)}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ))}
                                    </>
                                )}

                                {/* Pagination */}

                                <div className="row d-flex justify-content-center" style={{ paddingTop: '18px' }}>
                                    {keyword || category ? (
                                        <Pagination
                                            pages={pages}
                                            page={page}
                                            // category={category ? category : ''}
                                            keyword={keyword ? keyword : ''}
                                            category={category || ''}
                                        />
                                    ) : (
                                        !props?.todayProducts && (
                                            <Link to={'today-product'} style={{ width: '30%' }}>
                                                <Button
                                                    variant="outlined"
                                                    style={{
                                                        borderColor: 'var(--default-background-color)',
                                                        width: '100%',
                                                        color: 'var(--default-background-color)',
                                                        minWidth: '150px',
                                                    }}
                                                >
                                                    Xem thêm
                                                </Button>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopSection;
