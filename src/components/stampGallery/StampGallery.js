import React, { useState, useRef } from "react";
import './imageGallery.scss'
import '../../pages/tables/components/TaskContainer/TaskContainer.module.scss'
import ImageGallery from 'react-image-gallery';
import $ from 'jquery';
import {
  Col,
  Row,
  // Button,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown
} from "reactstrap";
import Checkbox from "@material-ui/core/Checkbox";
import Widget from "../Widget/Widget";
import Panels from './components/Panels'
import SwiperClass from './components/SwiperClass'

function lazyLoadingCheck() {
  if (localStorage.getItem('lazy_loading') === false) {
    return false
  } else {
    localStorage.setItem('lazy_loading', true)
    return true
  }
}

const StampGallery = () => {

  const carousel_images = [];
  const images = []
  var window_location = window.location.href
  var curr_book = window_location.substring(window_location.indexOf("/books/") + 1).replace('books/','').toLowerCase();
  // add all images in specified book
  
  if (curr_book === 'a') {
    for (let i = 1, len = 110; i < len; i++) { 
      images.push('https://rimell.cc/stampAlbum/img/A' + i + '.jpg')
    }
  } else if (curr_book === 'b') {
    for (let i = 1, len = 48; i < len; i++) { 
      images.push('https://rimell.cc/stampAlbum/img/B' + i + '.jpg')
    }
  } else if (curr_book === 'c') {
    for (let i = 1, len = 34; i < len; i++) { 
      images.push('https://rimell.cc/stampAlbum/img/C' + i + '.jpg')
    }
  }
  for (let i = 0, len = images.length; i < len; i++) { // format images in carousel_images format (dictionary)
    carousel_images.push({'original': images[i], 'thumbnail': images[i]})
  }

  // const task = [
  //   {
  //     id: 1,
  //     description: "Lazy Loading",
  //     time: '',
  //     completed: lazyLoadingCheck(),
  //   }
  // ]

    const [checked, setChecked] = useState();

    const handleChange = event => {
      setChecked(event.target.checked);
    };
    
    var panels = new Panels();
    $(function () {
      new SwiperClass(panels);
    });
    
    const imageGallery = useRef()
    $( ".image-gallery-image" ).ready(function () {
      console.log(imageGallery.current);
      sessionStorage.setItem('curr_page',window.location.hash.substring(1, 10).replace('/books/','').toUpperCase() + (imageGallery.current.state.currentIndex + 1))
      // imageGallery.current.slideToIndex(5)
      // imageGallery.current.props.onSlide = onSlide
    })
    const onSlide = () => {
      var swiperCall = new SwiperClass(panels)
      sessionStorage.setItem('curr_page',window.location.hash.substring(1, 10).replace('/books/','').toUpperCase() + (imageGallery.current.state.currentIndex + 1))
      var pageid = sessionStorage.getItem('curr_page')
      console.log(pageid);
      swiperCall.postSlideRenderSteps(swiperCall, pageid)
    }
    
  return (

    
    <Row>
      <Col className="pr-grid-col" xs={12} lg={20}>
        <Row className="gutter mb-4">
          <Col className="mb-4 mb-md-0" xs={12} md={6}>
            <Widget className="widget-p-24">
            <ImageGallery 
            items={carousel_images} 
            showFullScreenButton={false} 
            showIndex={true} 
            slideDuration={100} 
            showPlayButton={false} 
            lazy_loading={lazyLoadingCheck()}
            lazyLoad={lazyLoadingCheck()}
            ref={imageGallery}
            onSlide={onSlide}
             />
            </Widget>
          </Col>
          <Col xs={12} md={6}>
            <Widget className="">
              <div id="custom-handle" style={{display: 'none'}}></div>
              <div className="widget-p-24 propertiesPanel">
                <div className="headline-3 d-flex align-items-center">
                  Panel
                </div>
                <div className='widgetContentBlock'>
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "checkbox" }}
                  />
                </div>
                <form>
                  <input id="fetchColnectImages" type="checkbox" name="fetchColnectImages" value="true" />Fetch Colnect Images 
                  <input id="changeSelection" type="button" name="action" value="Select" />
                </form>
                <div id="propertiesBody">

                </div>
              </div>
            </Widget>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default StampGallery