import {useState, useEffect} from 'react';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Modal from './Modal/Modal';
import LoadMore from './Button/Button';
import LoaderSpiner from './Loader/Loader';
import toast from 'react-hot-toast';
import api from 'services/api';
import { mapper } from 'helpers/mapper';

export default function App() {
  const [{ pictureName }, setPictureName] = useState('');
  const [pictureData, setPictureData] = useState('');
  const [pictureModal, setPictureModal] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState('');
  const [IsLoadingMore, setIsLoadingMore] = useState(false);
  
  useEffect(() => {
    // первый рендер с пустой строкой пропускается не делаем фетч
    if (!pictureName) {
      return;
    }

    setStatus('pending');

    api
      .fetchPicture(pictureName, page)
      .then(res => {
        if (res.data.hits.length === 0) {
          toast.error('There is no picture for that name');
          setStatus(null);
          setIsLoadingMore(false);
          return;
          // змінити статус
        }

setPictureData(state => [...state, ...mapper(res.data.hits)]);
        setStatus('resolved');

        const lengthData = (page - 1) * 12 + res.data.hits.length;

        if (lengthData >= res.data.totalHits) {
          setIsLoadingMore(false);
        } else {
          setIsLoadingMore(true);
        }
      })
      .catch(error => console.log(error));
  }, [page, pictureName]);

const handleFormSubmit = pictureName => {
    // перезапись на новые 12 картинок при вводе новой строки валидной
    setPage(1);
  setPictureName({ pictureName });
  setPictureData('');
  setIsLoadingMore(false)
  };

  // функция загрузки новых 12 картинок
  const loadMore = () => {
    setPage(page => page + 1)
  };

  const pictureModalClick = picture => {
      setPictureModal(picture)
  };

  // 1-МОДАЛКА)метод для закрытия модалки-пик
  const closeModal = () => {
    setPictureModal('')
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      {pictureData.length > 0 && (
        <ImageGallery
          pictureData={pictureData}
          onClick={pictureModalClick}
        ></ImageGallery>
      )}
      {status === 'pending' && <LoaderSpiner />}
      {IsLoadingMore && <LoadMore onClick={loadMore} />}
      {pictureModal.length > 0 && (
        <Modal onClose={closeModal}>
          <img src={pictureModal} alt="" />
        </Modal>
      )}
    </div>
  );
  }
