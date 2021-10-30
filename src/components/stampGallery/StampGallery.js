import React, { useState } from "react";
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


function lazyLoadingCheck() {
  if (localStorage.getItem('lazy_loading') === true) {
    return true
  } else {
    localStorage.setItem('lazy_loading', false)
    return false
  }
}

class Codes {
  constructor(codeStr) {
    this.codes = new Map();
    
    this.SG = "Sg";

    const self = this;
    var codeList = codeStr.split(",");

    codeList.forEach(function (val, idx) {
      var codeTuple = val.split(":");
      if (codeTuple.length ==2)
        self.codes.set(codeTuple[0].trim(),codeTuple[1].trim());
      else
        console.log("unknown code:"+val + ": in code str="+codeStr);
    });

  }

  getCode(codeType) {
    return this.codes.get(codeType);
  }

  getStanleyGibbonsCode() {
    var code = this.codes.get(this.SG);
    return code;
  }

}

class CountryCount {
  constructor(country, country_id) {
    this.id = country_id;
    this.name = country;
    this.value = 0;
    // this.fill =am4core.color("#FF0000")
  }
  incrementCount() {
    this.value = this.value + 1;
  }
}

class StampData {
  constructor() {
    this.stampsData = new Map();
    this.stampsByPage = new Map();   // Map of arrays, one per page
    this.albumRegions = new Map();
    this.albumRegionsByCountryId = new Map();
    this.albumPages = new Map();
    this.pagesList = [];
    this.currentPage = 1;
    this.stampsCount = [];
    this.URL_PATH = "https://www.rimell.cc/stampAlbum/php/";
    // Order important. Get stamps first, then album pages, which are enriched with Stamp data.
    this.getStampsCount();
    this.getStamps();
    
  }

  getStampsByCountry () {
    const output = new Map();
    this.stampsData.forEach(function (el, idx) {
      if (el.iso_id != null && el.Public_Note !== "") {
        var countryRecord = output.get(el.iso_id);
        if (countryRecord == null) {
          countryRecord = new CountryCount(el.Country, el.iso_id);
          output.set(el.iso_id, countryRecord);
        }
        countryRecord.incrementCount();
      }
    });
    return [...output.values()];
  }
  countUnmatchedStampsOnPage (pageid) {
    const  regionsOnPage = this.albumPages.get(pageid);
    var countTotal = 0;
    var countUnmatched = 0;
    if (regionsOnPage) {
      regionsOnPage.forEach (function (regionData, idx) {
        countTotal++;
        if (regionData.stampid === 0)
          countUnmatched++;
      });
    }
    return [countUnmatched, countTotal];
  }

  countMatchesInSeries(seriesName, countryId) {
    var count = 0;
    this.stampsData.forEach(function (el, idx) {
      if (el.Series === seriesName && el.country_id === countryId && el.Public_Note.length > 0)
        count++;
    });
    return count;
  }

  getDataForRegionId(albumPageRegionId) {
    var retVal = this.albumRegions.get(albumPageRegionId);
    return retVal;
  }
  getStampForStampId(stampid) {
    var retVal = this.stampsData.get(stampid);
    return retVal;
  }
 
  getAlbumRegionsForPage(pageid) {
    return this.albumPages.get(pageid);
  }
  getListOfRegionsByCountry(countryid) {
    return this.albumRegionsByCountryId.get(countryid);
  }
  // getStampsPage(pageid) {
  //   return this.stampsByPage.get(pageid);
  // }

  // canMoveRight() {
  //   return this.currentPage < this.pagesList.length;
  // }

  // canMoveLeft() {
  //     return this.currentPage > 0;
  // }

  // getCurrentPage() {
  //     return this.pagesList[this.currentPage];
  // }
  
  // getNextTitle() {
  //   var nextImgTitle = "";
  //   if (this.currentPage  < this.pagesList.length+3) {
  //     nextImgTitle = this.pagesList[this.currentPage +3 ];
  //     this.currentPage++;
  //   } else if (this.currentPage  === this.pagesList.length) {
  //     nextImgTitle = this.pagesList[0];
  //     this.currentPage = 0;
  //   } else {
  //     nextImgTitle = this.pagesList[1];
  //     this.currentPage = 1;
  //   }
  //   return nextImgTitle;
  // }

  // getPrevTitle() {
  //   var nextImgTitle = "";
  //   if (this.currentPage > 2) {
  //     nextImgTitle = this.pagesList[this.currentPage -3];
  //     this.currentPage--;
  //   } else {
  //     nextImgTitle = "A1";
  //     this.currentPage--;
  //   }
  //   return nextImgTitle;
  // }
  getStampsCount() {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'getStampsCount.php',
      async: true,
      success: function (data) {
        self.stampsCount = data;
      }
    });
  }

  getStamps() {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'getStamps.php',
      async: false,
      success: function (data) {
        data.forEach(function (val,idx) {

          val.codes = new Codes(val.Catalog_Codes);
          val.regions = [];
          if (val.Public_Note.split(",").length > 1) {
            //Data glitch. Only use first bit of data.
            val.Public_Note = val.Public_Note.split(",")[0];
            val.Quantity = val.Quantity.split(",")[0];
            val.stamps_condition = val.stamps_condition.split(",")[0];
          }
          self.stampsData.set(val.ID, val);
          // Convert something that looks like "[A3 A5]"  to an array like ["A3","A5"]
          //console.log(val.Public_Note);
          const pagesStr = val.Public_Note.substring(1,val.Public_Note.length-1);
         // console.log(val.Public_Note + "->"+pagesStr);
          let pages = pagesStr.split(" ");
          pages.forEach (function (pageid, idx) {
            var pageStamps = self.stampsByPage.get(pageid);
            if (pageStamps == null) {
              pageStamps = [];
              self.stampsByPage.set(pageid, pageStamps);
            }
            pageStamps.push(val);
          });
        });

        self.getAllAlbumPages();
      }
    });
  }

  getAllAlbumPages() {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'getAllAlbumPages.php',
      async: false,
      success: function (data) {
        data.forEach(function (val,idx) {
          if (val.stampid > 0) {
            var stampRecord = self.getStampForStampId(val.stampid);
            val.stampRecord = stampRecord; // link to parent
            

            if (stampRecord != null) {
              stampRecord.regions.push(val); // link to children
              var countryStampList = self.albumRegionsByCountryId.get(val.stampRecord.country_id);
              if (countryStampList == null) {
                countryStampList = [];
                self.albumRegionsByCountryId.set(val.stampRecord.countryid, countryStampList);
              }
              countryStampList.push(val);
            }
          }
          
          self.albumRegions.set(val.albumPageRegionId, val);


          var albumPageArray = self.albumPages.get(val.pageid);
          if (albumPageArray == null) {
            albumPageArray = [];
            self.albumPages.set(val.pageid, albumPageArray);
          }
          albumPageArray.push(val);
        });
      }
    });
  }

}

class Panels {


  constructor() {
    var self = this;
    this.URL_PATH = "https://www.rimell.cc/stampAlbum/php/";
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.model = new StampData();

    this.backQueue = [];

    // $('#back').click(function (e) {
    //   console.log("back queue length="+self.backQueue.length);
    //   var backRender = self.backQueue.pop();
    //   if (backRender)
    //     backRender();
    //   if (self.backQueue.length==0)
    //     $(this).css("display","none");
    // });
    
  }

  renderStampPanel(self, albumPageRegionId, stampid, pageid) { // info panel
    $('#propertiesBody').empty();
    $('#propertiesBody').css('overflow-y','auto');
    $('#propertiesBody').append('<table id="metadata"></table>');
    $('#changeSelection').click(function (e) {
      self.renderFindStampPanel(albumPageRegionId, pageid);
    });
    var val = self.model.getDataForRegionId(albumPageRegionId).stampRecord;
    //self.stampsData.forEach(function (val, i) {
      if (val != null) {

        $('#metadata').append('<tr><th>ID</th><td>' + val.ID + '</td></tr>');
        var flag_icon = val.flag_image;
        var style = 'background-image: url(https://www.rimell.cc/stampAlbum/flags/' + flag_icon + ');';
        if (flag_icon == null) 
          flag_icon = "32px_question_mark.png";
        else if (flag_icon == 'flags32y.png') {
          style = style + " background-position: "+val.image_x+"px " + val.image_y+"px;\"";
        }
        $('#metadata').append('<tr><th>Country</th><td><span class="flag_icon" style="' + style + '"></span>' + val.Country + '</td></tr>');
        $('#metadata').append('<tr><th>Name</th><td>' + val.stamp_name + '</td></tr>');
        $('#metadata').append('<tr><th>Description</th><td style="white-space: pre-line">' + this.convertMarkup(val.Description) + '</td></tr>');
        $('#metadata').append('<tr><th>Series</th><td>' + val.Series + '</td></tr>');
        $('#metadata').append('<tr><th>Catalog Codes</th><td>SG : ' +  val.codes.getStanleyGibbonsCode() + '</td></tr>');
        $('#metadata').append('<tr><th>Issued On</th><td>' + val.Issued_on + '</td></tr>');
        $('#metadata').append('<tr><th>Expiry Date</th><td>' + val.Expiry_date + '</td></tr>');
        $('#metadata').append('<tr><th>Width</th><td>' + val.Width + '</td></tr>');
        $('#metadata').append('<tr><th>Height</th><td>' + val.Height + '</td></tr>');
        $('#metadata').append('<tr><th>Paper</th><td>' + val.Paper + '</td></tr>');
        $('#metadata').append('<tr><th>Watermark</th><td>' + val.Watermark + '</td></tr>');
        $('#metadata').append('<tr><th>Colours</th><td>' + val.Colors + '</td></tr>');
        $('#metadata').append('<tr><th>Face Value</th><td>' + val.FaceValue + ' ' + val.Currency+ '</td></tr>');
        $('#metadata').append('<tr><th>Locations</th><td>' + val.Public_Note + '</td></tr>');
        $('#metadata').append('<tr><th>Link</th><td><a target="stamptab" href="' + val.Link + '">' + val.Link + '</a></td></tr>');
        
        var checkboxVal = $('#fetchColnectImages')[0].checked;
        if (checkboxVal) {
          $.ajax({
            dataType: "json",
            type: "GET",
            url: self.URL_PATH + 'getStampImageURL.php?stamppage=' + encodeURI(val.Link),
            async: true,
            success: function (data) {
              $('#metadata').append('<tr><th>source Image</th><td><img src="' + data.seconddata + '"/></td></tr>');
            }
          });
        }
     
        var regionData = self.model.getDataForRegionId(albumPageRegionId);
       
          
         $('#metadata').append('<tr><th>My Image</th><td class="stampImageHolder"></td></tr>');
         self.renderMyStamp($('.stampImageHolder'), regionData, pageid);
         $('.propertiesPanel').css ('display','inline-block');
     }

  }

  renderNotMyStamp ( holder, stamp, message = "") {
    const targetImageWidth = 400;
    const targetImageHeight = 200;
    holder.append('<div><div id="'+stamp.ID+'" class="stampImage" style="display:block; width:'+targetImageWidth+'px; height:'+targetImageHeight+'px; background-repeat: no-repeat; background-image: url(img/none-stamps.jpg)">'+message+':'+stamp.stamp_name+':'+stamp.FaceValue+'</div></div>');
    
  }
  renderMyStamp(holder, regionData, pageid) {
    // Take the width from the CSS, so it varies between desktop and mobile device.
    var csswidth = $('.targetImageWidth').css('width');
    console.log('css width='+csswidth.substring(0,csswidth.length-2));
    const targetImageWidth = parseInt(csswidth.substring(0,csswidth.length-2));
    var myX = parseInt(regionData.x1);
    var myMaxX = parseInt(regionData.x1);
    if (myX > parseInt(regionData.x2)) 
      myX = parseInt(regionData.x2);
    else
      myMaxX = parseInt(regionData.x2);

    if (parseInt(regionData.x3) >0) {
      if (myX > parseInt(regionData.x3)) 
        myX = parseInt(regionData.x3);
      if (myMaxX < parseInt(regionData.x3)) 
        myMaxX = parseInt(regionData.x3);
    }
    if (parseInt(regionData.x4) >0) {
      if (myX > parseInt(regionData.x4)) 
        myX = parseInt(regionData.x4);
      if (myMaxX < parseInt(regionData.x4)) 
        myMaxX = parseInt(regionData.x4);
    }

    var myY = parseInt(regionData.y1);
    var myMaxY = parseInt(regionData.y1);
    if (myY > parseInt(regionData.y2)) 
      myY = parseInt(regionData.y2);
    else
      myMaxY = parseInt(regionData.y2);
    if (parseInt(regionData.y3) >0) {
      if (myY > parseInt(regionData.y3)) myY = parseInt(regionData.y3);
      if (myMaxY < parseInt(regionData.y3)) myMaxY = parseInt(regionData.y3);
    }
    if (parseInt(regionData.y4) >0) {
      if (myY > parseInt(regionData.y4)) myY = parseInt(regionData.y4);
      if (myMaxY < parseInt(regionData.y4)) myMaxY = parseInt(regionData.y4);
    }

      var width = myMaxX - myX;
      width = width * Math.sign(width);
      const widthRatio = targetImageWidth / width;
      
      var height = myMaxY - myY;
      height = height * Math.sign(height);

      const stampRatio =  height/ width;
      const targetImageHeight= Math.round(targetImageWidth * stampRatio);



      const targetAlpha = Math.round(myX * widthRatio);
      const targetBeta = Math.round(myY * widthRatio);

      const originalWidth = regionData.imgWidth;
      const backgroundSize = Math.round(originalWidth * widthRatio);


      holder.append('<div><div id="'+regionData.albumPageRegionId+'" class="stampImage" style="display:block; width:'+targetImageWidth+'px; height:'+targetImageHeight+'px; background-size: ' +backgroundSize + 'px; background-position: -'+targetAlpha+'px -'+targetBeta+'px; background-repeat: no-repeat; background-image: url(img/' + pageid + '.jpg)"></div><div>'+pageid+'</div></div>');
    
  }
 
  clickOnStamp(self, stampRegionId, pageid) {
    var albumRegion = self.model.getDataForRegionId(stampRegionId);
    var matchingStampId = albumRegion.stampid;

     if (matchingStampId == 0)
        self.renderFindStampPanel(stampRegionId,pageid);
     else
        self.renderStampPanel(self, stampRegionId, matchingStampId, albumRegion.pageid);
   
  }

  
  renderCountryList (data) {
    var self = this;
    $('.swiper').css("display","none");
    $('.propertiesPanel').css("display","none");
    $('.countryList').empty();
    const TARGET_FLAG_SIZE = 60;
    const SOURCE_FLAG_SIZE = 32;
    const imgRatio = TARGET_FLAG_SIZE/SOURCE_FLAG_SIZE;
    const backgroundSize = 640 * imgRatio;
    data.forEach ((element, i) => {
      var style = 'background-image: url(https://www.rimell.cc/stampAlbum/flags/' + element.flag_image + ');';
      if (element.flag_image == 'flags32y.png') {
        style = style + " background-position: "+(parseInt(element.image_x)*imgRatio)+"px " + (parseInt(element.image_y)*imgRatio)+"px; background-size: "+backgroundSize+"px; ";
      }
      var stampCount = self.model.stampsCount[element.country];
      $('.countryList').append(`<div class="country"><div class="flag_item" id="${element.id}" draggable="false" style="${style}"></div><div>${element.country} (${element.count} / ${stampCount})</div></div>`);
    });
    $('.flag_item').click(function (e) {
      //var data = self.model.getListOfRegionsByCountry(e.target.id)
      self.backQueue.push(function() {
        self.renderCountryList(data);
      });
      self.getSeriesByCountry(e.target.id);
      //self.renderStampList(data);
    })
    $('.countryList').css("display","flex");
  }

  renderSeriesList (data) {
    var self = this;
    
    $('.swiper').css("display","none");
    $('.propertiesPanel').css("display","none");
    $('#back').css("display","inline-block");


    $('.countryList').empty();
    var labelText = '<div id="sliderLabel">' + 
  '<label for="dateRange">Date Range:</label>'+
  '<input type="text" id="dateRange" readonly style="border:0; color:#f6931f; font-weight:bold;">'+
  '</div>';

    $('.countryList').append(labelText+'<div id="slider-range"></div><div id="seriesList"></div>');

   
    var minYear = 2000;
    var lastCountryId = "";
    data.forEach ((el, i) => {
      if (el.Series.length >0) {
        lastCountryId = el.countryid;
        if (minYear > parseInt(el.min_year) && parseInt(el.min_year) > 1830)
           minYear = parseInt(el.min_year);
        
        var myStampsCount = self.model.countMatchesInSeries(el.Series, el.countryid);
        var styleClass = "";
        if (myStampsCount >0)
          styleClass = "gotSomeStamps";
        if (myStampsCount == el.count) 
          styleClass = "gotAllStamps";
         $('#seriesList').append(`<div id="${el.Series}" class="series ${styleClass}" data-minyear="${el.min_year}" data-maxyear="${el.max_year}" data-countryid="${el.countryid}">${el.Series} (${el.count})</div>`);
      }
    });
    $('#seriesList').append(`<div id="ALL" class="series" data-minyear="2021" data-maxyear="1830" data-countryid="${lastCountryId}">ALL</div>`);
    $( ".series" ).click(function (e) {
      const seriesName = $(this).attr("id");
      const countryId = $(this).attr("data-countryid");

      self.backQueue.push(function() {
        self.renderSeriesList(data);
      });

    $.ajax({
          dataType: "json",
          type: "GET",
          url: self.URL_PATH + 'getStamps.php?countryid='+countryId+(seriesName!='ALL'?'&seriesName='+encodeURIComponent(seriesName):''),
          async: false,
          success: function (data) {
            self.renderStampList(data);
          }

        });
    });

    $( "#slider-range" ).slider({
      range: true,
      min: minYear,
      max: 2020,
      values: [ minYear, 1960 ],
      slide: function( event, ui ) {
        
        $( "#dateRange" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        $('.series').each(function (idx) {
          var issuedminyear =parseInt($(this).attr('data-minyear'));
          var issuedmaxyear =parseInt($(this).attr('data-maxyear'));
        
          if (issuedminyear < ui.values[ 0 ] || issuedmaxyear > ui.values[ 1 ] ) 
            $(this).css('display','none');
          else
            $(this).css('display','inherit');
        });
        
       // console.log("move complete:"+ui.values.join());
      }
    });
    $( "#dateRange" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );

    $('.countryList').css("display","inherit");
  }

  renderStampList (data) {
    var self = this;
    $('.swiper').css("display","none");
    $('.propertiesPanel').css("display","none");
    $('.countryList').empty();

    data.forEach ((stamp, idx) => {
      var modelStamp = self.model.getStampForStampId(stamp.ID);
      if (modelStamp) {
        // known stamp but do we have any regions?
        if (modelStamp.regions.length >0) {
          modelStamp.regions.forEach (function (regionData, rIdx) {
            self.renderMyStamp($('.countryList'), regionData, regionData.pageid);
          });
        } else {
          self.renderNotMyStamp($('.countryList'), stamp, 'Not yet linked to page '+stamp.Public_Note+'<br>');
        }
      } else {
        self.renderNotMyStamp($('.countryList'), stamp);
      }
    
      

    });
    $('.stampImage').click(function (e) {
      e.preventDefault();
      self.clickOnStamp(self, e.target.id);
    });
    $('.countryList').css("display","flex");
  }

  getKnownCountries() {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'getKnownCountries.php',
      async: true,
      success: function (data) {
        self.renderCountryList(data);
      }
    });

  }

  getSeriesByCountry(countryid) {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'getSeriesForCountry.php?countryid='+countryid,
      async: true,
      success: function (data) {
        self.renderSeriesList(data);
      }
    });

  }

  getAlbumStampsByCountry(countryid) {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'getAlbumStampsByCountry.php?countryid='+countryid,
      async: true,
      success: function (data) {
        self.renderSeriesList(data);
      }
    });

  }

  updateStampForRegion(pageid, regionId, stampId) {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: self.URL_PATH + 'setRegionStamp.php?pageid=' + pageid + '&regionid=' + regionId + '&stampid=' + stampId,
      async: false,
      success: function (data) {
        var stampRecord = self.model.getStampForStampId(stampId);
        var regionData = self.model.getDataForRegionId(regionId);
        regionData.stampid = stampId;
        regionData.stampRecord = stampRecord;
      }
    });

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
              <div className="d-flex widget-p-24">
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
  )
}

export default StampGallery