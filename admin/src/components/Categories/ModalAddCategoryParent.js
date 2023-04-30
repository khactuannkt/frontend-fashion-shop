import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { Button, Card, CardActions, CardHeader, TextField, Tooltip, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { inputPropsConstants } from '../../constants/variants';
import { renderError } from '../../utils/errorMessage';
import styles from './Categories.module.scss';
import { useDispatch } from 'react-redux';
import { AddCategory } from '../../Redux/Actions/CategoryActions';
import { ToastObject } from '../LoadingError/ToastObject';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export default function ModalAddCategoryParent({ isOpenModal, handleOpenModal }) {
  const dispatch = useDispatch();
  const [isLoadingAddCategory, setIsLoadingAddCategory] = React.useState(false);
  const [image, setImage] = React.useState();

  const { reset, control, watch, getValues, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      parent: '',
      description: '',
      children: [],
      level: 1,
    },
  });

  const handleAddCategoryChild = () => {
    const currentCategoryChildren = getValues('children');
    setValue('children', [...currentCategoryChildren, { _id: currentCategoryChildren.length }]);
  };
  const handleDeleteCategoryChild = (indexToDelete) => {
    const currentCategoryChildren = getValues('children');
    setValue(
      'children',
      currentCategoryChildren.filter((category, index) => category && index !== indexToDelete),
    );
  };
  const handleClose = () => {
    handleOpenModal(false);
  };
  const createCategoryStatus = {
    success: () => {
      toast.success('Tạo thể loại thành công', ToastObject);
      handleOpenModal(false);
      reset();
    },
    error: (message) => {
      toast.error(message || 'Có lỗi trong quá trình tạo', ToastObject);
    },
    finally: () => {
      setIsLoadingAddCategory(false);
    },
  };
  const handleSubmitAddCategory = async (data) => {
    setIsLoadingAddCategory(true);
    if (image) {
      await convertFileToBase64(image)
        .then((base64String) => {
          dispatch(
            AddCategory({
              category: {
                ...data,
                image: base64String,
              },
              createCategoryStatus,
            }),
          );
        })
        .catch(() => {
          toast.error('Có lỗi trong quá trình xử lý ảnh vui lòng chọn ảnh khác hoặc tải lại', ToastObject);
        });
    } else {
      dispatch(
        AddCategory({
          category: {
            ...data,
            image:
              'https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&psig=AOvVaw0HwuKBHYyQFXJElgig-E5x&ust=1682958113837000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKiE5tWB0v4CFQAAAAAdAAAAABAE',
          },
          createCategoryStatus,
        }),
      );
    }
  };

  const imageReview = image ? window.URL.createObjectURL(image) : '';
  return (
    <div>
      <Modal
        open={isOpenModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={style}>
          <Typography noWrap={true} variant="h5" gutterBottom>
            Thêm thể loại
          </Typography>

          <form onSubmit={handleSubmit(handleSubmitAddCategory)} className={styles.formWrapper}>
            <Card className={styles.categoryInformation}>
              <Typography level="h4" fontSize="m" className={styles.titleModal} sx={{ mb: 0.5 }}>
                Thông tin cơ bản
              </Typography>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TextField
                    className={styles.formItem}
                    focused={!!fieldState.error}
                    color={fieldState.error ? 'error' : 'info'}
                    label="Tên thể loại"
                    {...field}
                    variant={inputPropsConstants.variantOutLine}
                    size={inputPropsConstants.smallSize}
                    helperText={renderError([
                      { error: fieldState?.error?.type === 'required', message: 'Bạn chưa nhập trường này' },
                    ])}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TextField
                    className={styles.formItem}
                    focused={!!fieldState.error}
                    color={fieldState.error ? 'error' : 'info'}
                    label="Mô tả về thể loại"
                    {...field}
                    variant={inputPropsConstants.variantOutLine}
                    size={inputPropsConstants.smallSize}
                    helperText={renderError([
                      { error: fieldState?.error?.type === 'required', message: 'Bạn chưa nhập trường này' },
                    ])}
                    multiline
                    rows={2}
                  />
                )}
              />
              <Card className={styles.wrapperUpload}>
                <div className={styles.uploadHeader}>
                  <label className={styles.labelImage}>Thêm ảnh</label>
                  {image ? (
                    <Button onClick={() => setImage('')} variant="text">
                      Xóa ảnh
                    </Button>
                  ) : null}
                </div>
                <input
                  onChange={(e) => {
                    setImage(e.target.files?.[0]);
                  }}
                  className={styles.image}
                  id="image"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                />
                {image ? (
                  <img className={styles.imageReview} src={imageReview} alt="Hình ảnh" />
                ) : (
                  <label className={styles.uploadBodyLabel} for="image">
                    <Card className={styles.uploadBody}>
                      <div className={styles.wrapImageIcon}>
                        <div className={styles.iconPicture}>
                          <ImageIcon color="primary" />
                        </div>
                        <span className={styles.iconSpan}>Kéo thả hình tại đây</span>
                      </div>
                    </Card>
                  </label>
                )}
              </Card>
            </Card>

            <Card className={`${styles.categoryInformation} ${styles.subCategories}`} sx={{ overflow: 'auto' }}>
              <div className={styles.subCategoriesHeader}>
                <Typography level="h5" fontSize="xl" className={styles.titleModal} sx={{ mb: 0.5 }}>
                  Thể loại con
                </Typography>
                <Tooltip title="Thêm thể loại con">
                  <Button variant="text" onClick={handleAddCategoryChild}>
                    <i className="fas fa-plus-circle" />
                  </Button>
                </Tooltip>
              </div>
              {watch('children').map((category, index) => (
                <Card key={category?._id} className={styles.categoryInformation}>
                  <CardHeader
                    title={
                      <Typography level="h5" fontSize="xl" className={styles.titleModal} sx={{ mb: 0.5 }}>
                        {`Thể loại con thứ ${index + 1}`}
                      </Typography>
                    }
                    action={<i onClick={() => handleDeleteCategoryChild(index)} className="fas fa-trash-alt" />}
                  />

                  <Controller
                    name={`children.${index}.name`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <TextField
                        className={styles.formItem}
                        focused={!!fieldState.error}
                        color={fieldState.error ? 'error' : 'info'}
                        label="Tên thể loại"
                        {...field}
                        variant={inputPropsConstants.variantOutLine}
                        size={inputPropsConstants.smallSize}
                        helperText={renderError([
                          { error: fieldState?.error?.type === 'required', message: 'Bạn chưa nhập trường này' },
                        ])}
                      />
                    )}
                  />

                  <Controller
                    name={`children.${index}.description`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <TextField
                        className={styles.formItem}
                        focused={!!fieldState.error}
                        color={fieldState.error ? 'error' : 'info'}
                        label="Mô tả về thể loại"
                        {...field}
                        variant={inputPropsConstants.variantOutLine}
                        size={inputPropsConstants.smallSize}
                        helperText={renderError([
                          { error: fieldState?.error?.type === 'required', message: 'Bạn chưa nhập trường này' },
                        ])}
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Card>
              ))}
            </Card>

            <CardActions className={styles.actionWrapper}>
              <Button variant={inputPropsConstants.variantOutLine} size="small" onClick={handleClose}>
                Hủy
              </Button>
              <LoadingButton
                loading={isLoadingAddCategory}
                type="submit"
                variant={inputPropsConstants.variantContained}
                size="small"
              >
                Tạo
              </LoadingButton>
            </CardActions>
          </form>
        </Card>
      </Modal>
    </div>
  );
}
