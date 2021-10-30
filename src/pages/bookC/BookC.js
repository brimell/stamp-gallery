import React from "react";
import {
    Col,
    Row,
    Progress
    // Button,
    // DropdownToggle,
    // DropdownMenu,
    // DropdownItem,
    // UncontrolledDropdown
  } from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import StampGallery from "../../components/stampGallery/StampGallery"


const BookC = () => {


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
              <div className="d-flex justify-content-between widget-p-md">
                <div className="headline-3 d-flex align-items-center">
                  Panel
                </div>
              </div>
            </Widget>
          </Col>
        </Row>
      </Col>
    </Row>
    )
}

export default BookC