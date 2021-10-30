import React from 'react';
import './imageGallery.scss'
import ImageGallery from 'react-image-gallery';


const carousel_images = [];
const images = []

for (let i = 1, len = 109; i < len; i++) { // add all images in book A
  images.push('https://rimell.cc/stampAlbum/img/A' + i + '.jpg')
}

for (let i = 0, len = images.length; i < len; i++) { // format images in carousel_images format (dictionary)
  carousel_images.push({'original': images[i], 'thumbnail': images[i]})
}

class StampGallery extends React.Component {
  render() {
    return <ImageGallery items={carousel_images} showFullScreenButton={false} showIndex={true} slideDuration={100} showPlayButton={false} />;
  }
}

export default StampGallery