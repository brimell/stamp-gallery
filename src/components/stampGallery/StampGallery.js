import React, { useState, useRef } from "react";
import './imageGallery.scss'
import ImageGallery from 'react-image-gallery';
import $ from 'jquery';
import LazyLoading from './lazyLoading/LazyLoading'
import {
  Col,
  Row,
  // Button,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown
} from "reactstrap";
import Widget from "../Widget/Widget";
import s from "./lazyLoading/LazyLoading.module.scss"
import Panels from './components/Panels'
import SwiperClass from './components/SwiperClass'

function lazyLoadingCheck() {
  if (localStorage.getItem('lazy_loading') === true) {
    return true
  } else {
    localStorage.setItem('lazy_loading', false)
    return false
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

  const task = [
    {
      id: 1,
      description: "Lazy Loading",
      time: '',
      completed: false,
    }
  ]

  const [tasks, setTasks] = useState(task);
  const toggleTask = (id) => {
      setTasks(
        tasks.map( task => {
          if (task.id === id) {
            task.completed = !task.completed;
          }
          if (task.completed === true) {
            localStorage.setItem('LazyLoading',true)
          } else {
            localStorage.setItem('LazyLoading',false)
          }
          return task;
        })
      )
    }

    $(function () {
      var panels = new Panels();
      new SwiperClass(panels);
    });
    
  return (

    
    <Row>
      <Col className="pr-grid-col" xs={12} lg={20}>
        <Row className="gutter mb-4">
          <Col className="mb-4 mb-md-0" xs={12} md={6}>
            <Widget className="widget-p-24">
            <ImageGallery items={carousel_images} showFullScreenButton={false} showIndex={true} slideDuration={100} showPlayButton={false} lazy_loading={lazyLoadingCheck()} />
            </Widget>
          </Col>
          <Col xs={12} md={6}>
            <Widget className="">
              <div id="custom-handle" style={{display: 'none'}}></div>
              <div className="widget-p-24 propertiesPanel">
                <div className="headline-3 d-flex align-items-center">
                  Panel
                </div>
                <div className={s.widgetContentBlock}>
                  <LazyLoading tasks={task} toggleTask={toggleTask}/>
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