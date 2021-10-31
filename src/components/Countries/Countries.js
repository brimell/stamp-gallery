import React from 'react';
import './imageGallery.scss'
import ImageGallery from 'react-image-gallery';
import $ from 'jquery';

class Panels {


  constructor() {
    var self = this;
    this.URL_PATH = "https://www.rimell.cc/stampAlbum/php/";
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    // this.model = new StampData();

    this.backQueue = [];

    // $('#back').on('click', function (e) {
    //   console.log("back queue length="+self.backQueue.length);
    //   var backRender = self.backQueue.pop();
    //   if (backRender)
    //     backRender();
    //   if (self.backQueue.length==0)
    //     $(this).css("display","none");
    // });
    
    $('#countyListOption').on('click', function () {self.getKnownCountries()});
  }
  
  compareByFaceValue( a, b ) {
    if ( a.FaceValue < b.FaceValue ){
      return -1;
    }
    if ( a.FaceValue > b.FaceValue ){
      return 1;
    }
    return 0;
  }

  

  clickOnStamp(self, stampRegionId, pageid) {
    var albumRegion = self.model.getDataForRegionId(stampRegionId);
    var matchingStampId = albumRegion.stampid;

     if (matchingStampId === 0)
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
    $('.flag_item').on('click', function (e) {
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
    $( ".series" ).on('click', function (e) {
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
    $('.stampImage').on('click', function (e) {
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
  return (
  )
}

export default StampGallery