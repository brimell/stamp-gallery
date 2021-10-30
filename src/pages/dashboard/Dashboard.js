import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Col,
  Row,
  Progress,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";

import s from "./Dashboard.module.scss";

const Dashboard = () => {
  // const [checkboxes, setCheckboxes] = useState([true, false])

  // const toggleCheckbox = (id) => {
  //   setCheckboxes(checkboxes => checkboxes
  //     .map((checkbox, index) => index === id ? !checkbox : checkbox ))
  // }

  const books = [['A','500'],['B','200'],['C','300']];
  const totalStamps = 1000
  const flags = [
    []
  ]

  return (
    <div>
      <Row>
        <Col className="pr-grid-col" xs={12} lg={8}>
          <Row className="gutter mb-4">
            <Col className="mb-4 mb-md-0" xs={12} md={6}>
            <Widget className="widget-p-md">
                <div className="d-flex justify-content-between">
                  <div className="headline-3 d-flex align-items-center">Books</div>
                </div>
                {books.map((book) =>
                  <div key={uuidv4()} className={`mt-4 ${s.widgetBlock}`}>
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        <icon className="eva eva-book-outline" alt="..." />
                        <div className="d-flex flex-column">
                          <p className="body-2">{book[0]}</p>
                          {/* <p className="body-3 muted">{book[1]}</p> */}
                        </div>
                      </div>
                      <div className="body-3 muted">{book[1]} stamps</div>
                    </div>
                  </div>
                )}
              </Widget>
            </Col>
            <Col xs={12} md={6}>
            <Widget className="">
                <div className="d-flex justify-content-between widget-p-md">
                  <div className="headline-3 d-flex align-items-center">Globe</div>
                </div>
              </Widget>
              
            </Col>
          </Row>
          <Row className="gutter mb-4">
            <Col xs={12}>
              <Widget className="widget-p-none">
              <div className="d-flex justify-content-between widget-p-md">
                  <div className="headline-3 d-flex align-items-center">Debug Console</div>
                </div>
              </Widget>
            </Col>
          </Row>
          <Row className="gutter">
            <Col className="mb-4 mb-xl-0" xs={6} sm={6} xl={3}>
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div className="d-flex mb-4">
                    {/* <img className="py-1 mr-2 img-fluid" src={heartRed} alt="..." /> */}
                    <div className="d-flex flex-column">
                      <p className="headline-3">Total Stamps</p>
                      <p className="body-2">- <span className="body-3 muted">{totalStamps}</span></p>
                    </div>
                  </div>
                  <div>
                    <Progress color="secondary-red" className={`progress-xs ${s.mutedPink}`} value="75" />
                  </div>
                </div>
              </Widget>
            </Col>
            <Col className="mb-4 mb-xl-0" xs={6} sm={6} xl={3}>
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div className="d-flex mb-4">
                    {/* <img className="py-1 mr-2 img-fluid" src={heartYellow} alt="..." /> */}
                    <div className="d-flex flex-column">
                      <p className="headline-3">Unique Stamps</p>
                      <p className="body-2">- <span className="body-3 muted">300</span></p>
                    </div>
                  </div>
                  <div>
                    <Progress color="secondary-yellow" className={`progress-xs ${s.mutedYellow}`} value="75" />
                  </div>
                </div>
              </Widget>
            </Col>
            <Col xs={6} sm={6} xl={3}>
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div className="d-flex mb-4">
                    {/* <img className="py-1 mr-2 img-fluid" src={heartTeal} alt="..." /> */}
                    <div className="d-flex flex-column">
                      <p className="headline-3">Text</p>
                      <p className="body-2">- <span className="body-3 muted">300</span></p>
                    </div>
                  </div>
                  <div>
                    <Progress color="secondary-cyan" className={`progress-xs ${s.mutedTeal}`} value="75" />
                  </div>
                </div>
              </Widget>
            </Col>
            <Col xs={6} sm={6} xl={3}>
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div className="d-flex mb-4">
                    {/* <img className="py-1 mr-2 img-fluid" src={heartViolet} alt="..." /> */}
                    <div className="d-flex flex-column">
                      <p className="headline-3">Text</p>
                      <p className="body-2">- <span className="body-3 muted">300</span></p>
                    </div>
                  </div>
                  <div>
                    <Progress color="violet" className={`progress-xs ${s.mutedViolet}`} value="75" />
                  </div>
                </div>
              </Widget>
            </Col>
          </Row>
        </Col>
        <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12} lg={4}>
          <Widget className="widget-p-lg">
          {flags.map((flag) =>
                  <div key={uuidv4()} className="d-flex">
                    <img className={s.image} src='' alt="..." />
                    <div className={s.userInfo}>
                      <p className="headline-3">name</p>
                      <p className="body-3 muted">info</p>
                    </div>
                  </div>
                )}
            
          </Widget>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard;
