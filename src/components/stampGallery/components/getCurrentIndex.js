import React, {useRef} from "react";
import ImageGallery from 'react-image-gallery';

export default function ImageGalleryFunc(images) {

    const refImg = useRef(null)

    const renderCustomControls = () => <span>refImg.current.getCurrentIndex()</span>

    return (
         <ImageGallery
          ref={refImg}
          renderCustomControls={renderCustomControls}
          items={images}
        />
    )
  }
