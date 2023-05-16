import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Button, FormControl, InputLabel, MenuItem, Pagination, Select, Skeleton, Typography } from '@mui/material';

import { Message } from '@mui/icons-material';
import FilterSection from '../FilterSection/FilterSection';
import { listProduct } from '~/Redux/Actions/productActions';
import Rating from '../Rating/Rating';
import styles from './ShopSection.module.scss';
import Product from '~/components/Product/Product';
import useSearchParamsCustom from '~/hooks/useSearchParamCustom';
const LoadingEachProduct = () => {
    return (
        <div className={styles.loadingEachProduct} style={{ margin: '15px 7.9px' }}>
            <Skeleton variant="rectangular" width={'100%'} height={209} />
            <Skeleton />
            <Skeleton />
            <Skeleton width="60%" />
        </div>
    );
};
const RenderProduct = ({ children, error, loading, notfound, LoadingComponent, ErrorComponent, NotfoundComponent }) => {
    if (loading) return LoadingComponent;
    if (error) return ErrorComponent;
    if (notfound) return NotfoundComponent;
    return children;
};

const ShowFilter = ({ children, show }) => {
    if (show) return children;
    return <Fragment />;
};
const ShopSection = (props) => {
    const dispatch = useDispatch();
    const { getParamValue, replaceParams } = useSearchParamsCustom();
    const [toggleLoad, setToggleLoad] = useState(false);
    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    const minPrice = getParamValue('min') || '';
    const category = getParamValue('category') || '';
    const maxPrice = getParamValue('max') || '';
    const keyword = getParamValue('keyword') || '';
    const pageNumber = getParamValue('page') || '';
    const rating = getParamValue('rating') || '';

    const [priceOrder, setPriceOrder] = useState('');
    let SkeletonOption = window.innerWidth > 540 ? [1, 2, 3, 4, 5, 6] : [1];
    useEffect(() => {
        dispatch(listProduct({ category, keyword, pageNumber, rating, minPrice, maxPrice }));
    }, [toggleLoad]);
    return (
        <>
            <div className={styles.shopSectionContainer}>
                <div className={styles.section}>
                    <div className="row">
                        {keyword || category ? <FilterSection setToggleLoad={setToggleLoad}></FilterSection> : null}
                        <div
                            style={{ paddingLeft: 0, paddingRight: 0 }}
                            className={` ${keyword || category ? 'col-lg-10' : 'col-lg-12'} col-md-9 article`}
                        >
                            <div className=" row">
                                <RenderProduct
                                    loading={loading}
                                    error={error}
                                    notfound={products?.length === 0 || !products}
                                    LoadingComponent={
                                        <div style={{ display: 'flex', width: '100%' }} className="col-lg-12">
                                            {SkeletonOption.map(() => (
                                                <LoadingEachProduct />
                                            ))}
                                        </div>
                                    }
                                    ErrorComponent={<Message variant="alert-danger">{error}</Message>}
                                    NotfoundComponent={
                                        <div
                                            className="col-lg-12 col-md-6 col-sm-6 d-flex align-content-center justify-center flex-column"
                                            style={{ alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <div className="d-flex flex-column align-content-center">
                                                <img
                                                    alt="Không tìm thấy sản phẩm"
                                                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png"
                                                />

                                                <Typography className="text-center">Không tìm thấy sản phẩm</Typography>
                                            </div>
                                        </div>
                                    }
                                >
                                    <ShowFilter show={(keyword || category) && products && products?.length > 2}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'left',
                                                marginBottom: '10px',
                                                marginRight: '20px',
                                            }}
                                            className={styles.filterCustomWrap}
                                        >
                                            <Typography noWrap variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                                                Sắp xếp theo
                                            </Typography>
                                            <Button
                                                onClick={(e) => {
                                                    setPriceOrder(e.target.value);
                                                }}
                                                type="ghost"
                                                sx={{ mr: 1 }}
                                            >
                                                Mới nhất
                                            </Button>
                                            <div className="" style={{ cursor: 'pointer', zIndex: '2' }}>
                                                <FormControl size="small" fullWidth sx={{ minWidth: '8rem' }}>
                                                    <InputLabel id="sort-by-price-select-label">Giá</InputLabel>
                                                    <Select
                                                        labelId="sort-by-price-select-label"
                                                        id="demo-simple-select"
                                                        value={priceOrder}
                                                        label="Giá"
                                                        onChange={(e) => {
                                                            setPriceOrder(e.target.value);
                                                        }}
                                                    >
                                                        <MenuItem>Giá</MenuItem>
                                                        <MenuItem value="asc">Giá tăng dần</MenuItem>
                                                        <MenuItem value="desc">Giá giảm dần</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </ShowFilter>

                                    {!keyword && !category ? (
                                        <div className="row divider-custom">
                                            <Typography color="primary" fontWeight={600}>
                                                Sản phẩm hôm nay
                                            </Typography>
                                        </div>
                                    ) : null}

                                    {products?.map((product) => (
                                        <div
                                            className="col-lg-2 col-md-3 col-sm-6  mb-3"
                                            style={{ paddingLeft: 4, paddingRight: 4 }}
                                            key={product._id}
                                        >
                                            <Product product={product} />
                                        </div>
                                    ))}
                                </RenderProduct>

                                {/* Pagination */}

                                <div
                                    className="row d-flex justify-content-center"
                                    style={{ paddingTop: '18px', marginBottom: '16px' }}
                                >
                                    {keyword || category
                                        ? products?.length > 16 && (
                                              <Pagination
                                                  pages={pages}
                                                  page={page}
                                                  // category={category ? category : ''}
                                                  keyword={keyword ? keyword : ''}
                                                  category={category || ''}
                                              />
                                          )
                                        : products?.length > 16 && (
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
