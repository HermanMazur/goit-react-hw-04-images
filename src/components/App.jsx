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
  // state = {
  //   pictureName: '',
  //   pictureData: '',
  //   pictureModal: '',
  //   status: 'idle',
  //   page: 1,
  //   IsLoadingMore: false,
  // };

  // componentDidUpdate(prevState, prevProps) {
  //   const prevSearch = prevProps.pictureName;
  //   const nextSearch = this.state.pictureName;
  //   const prevPage = prevProps.page;
  //   const nextPage = this.state.page;
  useEffect(() => {
    if (!pictureName) {
      return;
    }
    
    setStatus('pending');
    api
      .fetchPicture(pictureName, page)
      .then(res => {
        setPictureData(state => [...state, ...mapper(res.data.hits)]);
        setStatus('resolved');
        if (res.data.hits.length === 0) {
          toast.error('There is no picture for that name');
        }
      })
      .catch(error => console.log(error));
  }, [page, pictureName]);

const handleFormSubmit = pictureName => {
    // перезапись на новые 12 картинок при вводе новой строки валидной
    setPage(1);
  setPictureName({ pictureName });
  setPictureData('');
  };

  // функция загрузки новых 12 картинок
  const loadMore = () => {
    setPage(prevState => 
      prevState.page + 1)
    setIsLoadingMore('true')
  };

  const pictureModalClick = picture => {
      setPictureModal(picture)
  };

  // 1-МОДАЛКА)метод для закрытия модалки-пик
  const closeModal = () => {
    setPictureModal('')
  };

  // скидываем страницу на 1 при новой валидной строки
  // resetPage() {
  //   this.setState({
  //     page: 1,
  //   });
  // }

  // // скидываем инпут поиска на 0
  // resetData() {
  //   this.setState({
  //     pictureData: '',
  //     IsLoadingMore: false,
  //   });
  // }

    // const { status, pictureData, pictureModal, IsLoadingMore } = this.state;
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
