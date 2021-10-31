import $ from 'jquery';
import Codes from './Codes'
import CountryCount from './CountryCount'

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
            pages.forEach (function (pageid, idx) { // page id originates here
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

export default StampData