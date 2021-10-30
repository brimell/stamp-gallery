import React from "react";
import { v4 as uuidv4 } from "uuid";
// import $ from 'jquery';
import { Link } from "react-router-dom";

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

import s from "./Dashboard.module.scss";

const Dashboard = () => {
  // const [checkboxes, setCheckboxes] = useState([true, false])

  // const toggleCheckbox = (id) => {
  //   setCheckboxes(checkboxes => checkboxes
  //     .map((checkbox, index) => index === id ? !checkbox : checkbox ))
  // }

  const books = [['A','500','/books/a'],['B','200','/books/b'],['C','300','/books/c']];
  const totalStamps = 1000
  // let flags = []

  // const URL_PATH = "https://www.rimell.cc/stampAlbum/php/";
  // function createCountryList(data) {
  //   data.forEach ((element, i) => {
  //     // var stampCount = this.model.stampsCount[element.country];
  //     flags.push(String(element.country) + ' (' + String(element.count) + ') ');
  //   });
  //   // $('.flag_item').click(function (e) {
  //   //   //var data = self.model.getListOfRegionsByCountry(e.target.id)
  //   //   self.backQueue.push(function() {
  //   //     self.renderCountryList(data);
  //   //   });
  //   //   self.getSeriesByCountry(e.target.id);
  //   //   //self.renderStampList(data);
  //   // })
  // }

  // function getKnownCountries() {
  //   $.ajax({
  //     dataType: "json",
  //     type: "GET",
  //     url: URL_PATH + 'getKnownCountries.php',
  //     async: true,
  //     success: function (data) {
  //       createCountryList(data);
  //     }
  //   });
  // }
  // getKnownCountries()
  // console.log(flags)
  let flags = [
    "Aden (1) ",
    "Afghanistan (6) ",
    "Algeria (5) ",
    "Angola (1) ",
    "Antigua and Barbuda (4) ",
    "Argentina (29) ",
    "Ascension Island (2) ",
    "Australia (195) ",
    "Australian Antarctic Territory (AAT) (5) ",
    "Austria (27) ",
    "Bahrain (1) ",
    "Barbados (7) ",
    "Basutoland (2) ",
    "Bechuanaland Protectorate (1) ",
    "Belgian Congo (1) ",
    "Belgium (73) ",
    "Belgium, German Occupation in WWI (2) ",
    "Berlin (3) ",
    "Bermuda (16) ",
    "Bohemia and Moravia (35) ",
    "Bosnia and Herzegovina, Austro-Hungarian Admin. (1) ",
    "Brazil (26) ",
    "British East Africa (Kenya, Uganda and Tanganyika) (12) ",
    "British Guiana (11) ",
    "British Virgin Islands (3) ",
    "Bulgaria (31) ",
    "Burma (2) ",
    "Cambodia (1) ",
    "Cameroon (5) ",
    "Canada (101) ",
    "Cayman Islands (7) ",
    "Central African Republic (2) ",
    "Ceylon (23) ",
    "Chad (2) ",
    "Chile (10) ",
    "China (28) ",
    "China - Provincial Issues: Northeastern Provinces (14) ",
    "China, People's Republic (12) ",
    "China, Peoples Republic - Central Lib. Area (1) ",
    "China, Peoples Republic - East Lib. Area (6) ",
    "China, Peoples Republic - Northeast Lib. Area (2) ",
    "Cinderellas (3) ",
    "Cochin (1) ",
    "Colombia (3) ",
    "Comoros (1) ",
    "Costa Rica (4) ",
    "Cuba (28) ",
    "Cyprus (4) ",
    "Czechoslovakia (101) ",
    "Dahomey (1) ",
    "Denmark (55) ",
    "Djibouti (1) ",
    "Dominica (4) ",
    "Ecuador (1) ",
    "Egypt (13) ",
    "Estonia, German Occupation In WWII (6) ",
    "Ethiopia (5) ",
    "Falkland Islands (3) ",
    "Falkland Islands, Dependencies (8) ",
    "Fiji (3) ",
    "Finland (27) ",
    "France (236) ",
    "French Equatorial Africa (3) ",
    "French Guiana (2) ",
    "French Indochina (1) ",
    "French Oceania (2) ",
    "French Polynesia (1) ",
    "French Somaliland (Somali Coast) (20) ",
    "French Southern and Antarctic Lands (TAAF) (7) ",
    "French West Africa (10) ",
    "Gabon (1) ",
    "German Realm (80) ",
    "Germany,  Allied Occupation of Berlin (1945) (1) ",
    "Germany, American-British Occ. (Bizone) (9) ",
    "Germany, American-British-Soviet Occ. (Trizone) (20) ",
    "Germany, Democratic Republic (DDR) (68) ",
    "Germany, Federal Republic (42) ",
    "Germany, French Occupation of Rhineland-Palatinate (1) ",
    "Germany, Soviet Occupation (General Issues) (1) ",
    "Ghana (9) ",
    "Gibraltar (5) ",
    "Gilbert and Ellice Islands (3) ",
    "Gold Coast (11) ",
    "Greece (24) ",
    "Grenada (3) ",
    "Guadeloupe (1) ",
    "Guatemala (1) ",
    "Guernsey (4) ",
    "Gwalior (1) ",
    "Hong Kong (3) ",
    "Hungary (89) ",
    "Hyderabad (1) ",
    "India (103) ",
    "India, French (2) ",
    "India, Portuguese (5) ",
    "Indonesia (10) ",
    "Iran (4) ",
    "Iraq (8) ",
    "Ireland (58) ",
    "Isle of Man (3) ",
    "Israel (3) ",
    "Italy (96) ",
    "Italy, Social Republic (3) ",
    "Jamaica (10) ",
    "Japan (20) ",
    "Jersey (3) ",
    "Jordan (6) ",
    "Kelantan (1) ",
    "Kenya (34) ",
    "Kingdom of Serbs, Croats and Slovenes (1) ",
    "Laos (1) ",
    "Lebanon (2) ",
    "Leeward Islands (1) ",
    "Lithuania (1) ",
    "Luxembourg (1) ",
    "Macau (1) ",
    "Madagascar (12) ",
    "Malacca (1) ",
    "Malaya, British Military Administration (1) ",
    "Malaya, Federated Malay States (1) ",
    "Malaya, Federation of (1) ",
    "Maldives (1) ",
    "Mali (1) ",
    "Malta (33) ",
    "Manchukuo (6) ",
    "Martinique (1) ",
    "Mauritius (2) ",
    "Mexico (23) ",
    "Monaco (20) ",
    "Mongolia (1) ",
    "Montenegro (7) ",
    "Montserrat (4) ",
    "Morocco (4) ",
    "Morocco, British Post Office (5) ",
    "Mozambique (4) ",
    "Mozambique Company (3) ",
    "Netherlands (137) ",
    "Netherlands Antilles (1) ",
    "New Caledonia (1) ",
    "New Hebrides (1) ",
    "New South Wales (1) ",
    "New Zealand (46) ",
    "Nicaragua (1) ",
    "Niger (2) ",
    "Nigeria (18) ",
    "North Borneo (1) ",
    "Norway (59) ",
    "Nyasaland (1) ",
    "Pakistan (10) ",
    "Palestine - British Mandate (1) ",
    "Paraguay (3) ",
    "Penang (1) ",
    "Perak (2) ",
    "Peru (5) ",
    "Philippines (5) ",
    "Pitcairn Islands (1) ",
    "Poland (26) ",
    "Portugal (23) ",
    "Queensland (2) ",
    "Ras al Khaimah (3) ",
    "Reunion (1) ",
    "Rhodesia (1) ",
    "Rhodesia and Nyasaland (9) ",
    "Romania (57) ",
    "Ruanda-Urundi (3) ",
    "Russia (6) ",
    "Saint Kitts and Nevis (1) ",
    "Saint Lucia (1) ",
    "Saint Pierre and Miquelon (10) ",
    "San Marino (27) ",
    "Sarawak (3) ",
    "Selangor (5) ",
    "Senegal (2) ",
    "Serbia (2) ",
    "Seychelles (1) ",
    "Sierra Leone (1) ",
    "Singapore (7) ",
    "Somalia, Italian Administration (1) ",
    "Somaliland Protectorate - British Somaliland (2) ",
    "South Africa (84) ",
    "South-West Africa (1) ",
    "Southern Rhodesia (5) ",
    "Soviet Union, USSR (24) ",
    "Spain (54) ",
    "Sri Lanka (4) ",
    "Straits Settlements (2) ",
    "Sudan (7) ",
    "Sweden (31) ",
    "Switzerland (17) ",
    "Syria (1) ",
    "Thailand (11) ",
    "Timor (1) ",
    "Togo (7) ",
    "Tonga (1) ",
    "Trieste, Zone A (1) ",
    "Trinidad and Tobago (6) ",
    "Tristan da Cunha (5) ",
    "Tunisia (2) ",
    "Turkey (10) ",
    "Turks and Caicos Islands (1) ",
    "United Kingdom of Great Britain & Northern Ireland (2834) ",
    "United Kingdom: Northern Ireland Regional Issues (4) ",
    "United Kingdom: Scotland Regional Issues (18) ",
    "United Kingdom: Wales Regional Issues (9) ",
    "United States of America (128) ",
    "Uruguay (3) ",
    "Vatican City (2) ",
    "Venezuela (2) ",
    "Vietnam (1) ",
    "Western Australia (1) ",
    "Yemen, Arab Republic (5) ",
    "Yugoslavia (18) ",
    "Yugoslavia, Issues for Istria and Slovene Coast (1) ",
    "Zaire (1) ",
    "Zanzibar (5) "
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
                  <Link to={'/books/'+ book[0]}>
                  <div key={uuidv4()} className={`mt-4 ${s.widgetBlock}`}>
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        <div className="eva eva-book-outline" alt="..." />
                        <div className="d-flex flex-column">
                          <p className="body-2">{book[0]}</p>
                          {/* <p className="body-3 muted">{book[1]}</p> */}
                        </div>
                      </div>
                      <div className="body-3 muted">{book[1]} stamps</div>
                    </div>
                  </div>
                  </Link>
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
          <div className="d-flex justify-content-between" style={{marginBottom: "30px"}}>
            <div className="headline-3 d-flex align-items-center">Country</div>
          </div>
          <div className={s.countryContainer}>
          {flags.map((flag) =>
                  <div key={uuidv4()} className="d-flex">
                    <img className={s.image} src='' alt="" />
                    <div className={s.userInfo}>
                      <p className="headline-3">{flag}</p>
                      <p className="body-3 muted"></p>
                    </div>
                  </div>
                )}
          </div>
          
            
          </Widget>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard;
