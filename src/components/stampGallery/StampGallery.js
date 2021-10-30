import React, { lazy } from 'react';
import './imageGallery.scss'
import ImageGallery from 'react-image-gallery';
import $ from 'jquery';

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
    getStampsPage(pageid) {
      return this.stampsByPage.get(pageid);
    }
  
    canMoveRight() {
      return this.currentPage < this.pagesList.length;
    }

    canMoveLeft() {
        return this.currentPage > 0;
    }

    getCurrentPage() {
        return this.pagesList[this.currentPage];
    }
    
    getNextTitle() {
      var nextImgTitle = "";
      if (this.currentPage  < this.pagesList.length+3) {
        nextImgTitle = this.pagesList[this.currentPage +3 ];
        this.currentPage++;
      } else if (this.currentPage  === this.pagesList.length) {
        nextImgTitle = this.pagesList[0];
        this.currentPage = 0;
      } else {
        nextImgTitle = this.pagesList[1];
        this.currentPage = 1;
      }
      return nextImgTitle;
    }
  
    getPrevTitle() {
      var nextImgTitle = "";
      if (this.currentPage > 2) {
        nextImgTitle = this.pagesList[this.currentPage -3];
        this.currentPage--;
      } else {
        nextImgTitle = "A1";
        this.currentPage--;
      }
      return nextImgTitle;
    }
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
  
  
  
  
  for (let i = 0, len = images.length; i < len; i++) { // format images in carousel_images format (dictionary)
    carousel_images.push({'original': images[i], 'thumbnail': images[i]})
  }
  return (
    <ImageGallery items={carousel_images} showFullScreenButton={false} showIndex={true} slideDuration={100} showPlayButton={false} lazy_loading={lazyLoadingCheck()} />
  )
}

export default StampGallery