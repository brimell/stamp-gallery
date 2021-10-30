import React, { useState } from "react";
import {
  Col,
  Row,
  // Button,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import StampGallery from "../../components/stampGallery/StampGallery"
import LazyLoading from "../../components/stampGallery/lazyLoading/LazyLoading"
import s from "../../components/stampGallery/lazyLoading/LazyLoading.module.scss"

const task = [
    {
      id: 1,
      description: "Create An Image",
      time: "9 AM",
      completed: false,
    },
    {
      id: 2,
      description: "Team Design Miting",
      time: "11 AM",
      completed: false,
    },
    {
      id: 3,
      description: "Create An Image",
      time: "2.30 PM",
      completed: false,
    },
    {
      id: 4,
      description: "Interview With John Hamm",
      time: "4 PM",
      completed: false,
    },
  ]
const BookA = () => {
    const [tasks, setTasks] = useState(task);
    const toggleTask = (id) => {
        setTasks(
          tasks.map( task => {
            if (task.id === id) {
              task.completed = !task.completed;
            }
            return task;
          })
        )
      }

  return (
    <Row>
      <Col className="pr-grid-col" xs={12} lg={20}>
        <Row className="gutter mb-4">
          <Col className="mb-4 mb-md-0" xs={12} md={6}>
            <Widget className="widget-p-md">
            <StampGallery />
              
            </Widget>
          </Col>
          <Col xs={12} md={6}>
            <Widget className="">
              <div className="d-flex widget-p-md">
                <div className="headline-3 d-flex align-items-center">
                  Panel
                </div>
                <div className={s.widgetContentBlock}>
                  <LazyLoading tasks={task} toggleTask={toggleTask}/>
                </div>
                
              </div>
            </Widget>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default BookA;