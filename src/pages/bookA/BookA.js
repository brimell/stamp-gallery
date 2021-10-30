import React from "react";
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

const BookA = () => {
  return (
    <Row>
      <Col className="pr-grid-col" xs={12} lg={8}>
        <Row className="gutter mb-4">
          <Col className="mb-4 mb-md-0" xs={12} md={6}>
            <Widget className="widget-p-md">
              <div className="d-flex justify-content-between">
                <div className="headline-3 d-flex align-items-center">
                  Book A
                </div>
              </div>
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
  );
};

export default BookA;