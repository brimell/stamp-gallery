import React from 'react';
import './imageGallery.scss'
import ImageGallery from 'react-image-gallery';

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/1000/600/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
];

class StampGallery extends React.Component {
  render() {
    return <ImageGallery items={images} showFullScreenButton={false} showIndex={true} slideDuration={200} />;
  }
}

export default StampGallery