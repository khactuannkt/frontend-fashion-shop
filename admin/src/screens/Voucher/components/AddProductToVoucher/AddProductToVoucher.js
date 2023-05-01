import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { allProducts } from '../../../../Redux/Actions/ProductActions';
import {
  Avatar,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  ListItemAvatar,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ListCategory } from '../../../../Redux/Actions/CategoryActions';
import styles from './AddProductToVoucher.module.scss';
import { inputPropsConstants } from '../../../../constants/variants';
import AddIcon from '@mui/icons-material/Add';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function AddProductToVoucher() {
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState([]);
  const [currentProducts, setCurrentProducts] = React.useState([]);
  const [currentSelectedProducts, setCurrentSelectedProducts] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState('');
  const [filterByCategory, setFilterByCategory] = React.useState('-1');
  const lcategories = useSelector((state) => state.CategoryList);
  const { categories } = lcategories;

  const productList = useSelector((state) => state.productList);
  const { loading } = productList;
  const listProductAfterFilter = currentProducts.filter(
    (value) =>
      value.name.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()) &&
      (value.category._id === filterByCategory || filterByCategory === '-1'),
  );

  const leftChecked = intersection(checked, currentProducts);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setCurrentSelectedProducts(currentSelectedProducts.concat(leftChecked));
    setCurrentProducts(not(currentProducts, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleDeleteSelectedProduct = (product) => {
    setCurrentProducts(currentProducts.concat([product]));
    setCurrentSelectedProducts(not(currentSelectedProducts, [product]));
  };

  const fetchAllProduct = {
    success: (products) => {
      setCurrentProducts(products);
    },
  };

  const handleChangeSearch = (e) => {
    if (checked.length > 0) {
      setChecked([]);
    }
    setSearchKey(e.target.value);
  };

  const handleChangeCategory = (e) => {
    setFilterByCategory(e.target.value);
    if (checked.length > 0) {
      setChecked([]);
    }
  };

  React.useEffect(() => {
    dispatch(allProducts(fetchAllProduct));
    dispatch(ListCategory());
  }, [dispatch]);

  const listProducts = (title, items) => (
    <Card className={styles.products}>
      <CardHeader
        className={styles.productsHeader}
        avatar={
          <div className={styles.productsHeaderFilter}>
            <TextField
              className={styles.searchProducts}
              label="Tìm kiếm sản phẩm"
              size={inputPropsConstants.smallSize}
              variant={inputPropsConstants.variantOutLine}
              value={searchKey}
              onChange={handleChangeSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <i className="fas fa-search" />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              className={styles.searchProducts}
              size={inputPropsConstants.smallSize}
              placeholder="Chọn thể loại"
              value={filterByCategory}
              onChange={handleChangeCategory}
            >
              <MenuItem value="-1">Tất cả thể loại</MenuItem>
              {categories.map((category) => (
                <MenuItem value={category?._id}>{category?.name || ''}</MenuItem>
              ))}
            </Select>
          </div>
        }
      />
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        action={
          <Button
            variant="outlined"
            size="medium"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
            startIcon={<AddIcon />}
          >
            Thêm
          </Button>
        }
        subheader={`${numberOfChecked(items)}/${items.length} đã chọn`}
      />
      <Divider />
      {loading ? <LinearProgress /> : null}
      <List
        sx={{
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar alt={value.name} src={value?.images?.[0]} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={value?.name || 'Tên sản phẩm'} />
              <ListItemText id={labelId} primary={value?.category?.name || 'Thể loại sản phẩm'} />
              <ListItemText id={labelId} primary={value?.price + ' VNĐ' || 'Giá sản phẩm'} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const selectedProducts = (title, items) => (
    <Card className={styles.products}>
      <CardHeader title={title} subheader={`${items.length} đã chọn`} />
      <Divider />
      <List
        sx={{
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button>
              <ListItemAvatar>
                <Avatar alt={value.name} src={value?.images?.[0]} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={value?.name || 'Tên sản phẩm'} />
              <ListItemText id={labelId} primary={value?.category?.name || 'Thể loại sản phẩm'} />
              <ListItemText id={labelId} primary={value?.price + ' VNĐ' || 'Giá sản phẩm'} />
              <ListItemIcon>
                <Button onClick={() => handleDeleteSelectedProduct(value)}>
                  <i className="fas fa-trash-alt color-red" />
                </Button>
              </ListItemIcon>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid className={styles.container} container spacing={2} justifyContent="center" alignItems="center">
      <Grid className={styles.productsWrapper} item>
        {listProducts('Danh sách sản phẩm', listProductAfterFilter)}
      </Grid>
      <Grid className={styles.productsWrapper} item>
        {selectedProducts('Danh sách sản phẩm áp dụng', currentSelectedProducts)}
      </Grid>
    </Grid>
  );
}
