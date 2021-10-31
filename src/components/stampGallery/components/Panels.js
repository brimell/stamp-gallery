import $ from 'jquery';
import sd from "../../../pages/dashboard/Dashboard.module.scss";
import StampData from './StampData'


class Panels { // does rendering for most things


    constructor() {
      // var self = this;
      this.URL_PATH = "https://www.rimell.cc/stampAlbum/php/";
      this.x1 = 0;
      this.x2 = 0;
      this.y1 = 0;
      this.y2 = 0;
  
      this.model = new StampData();
  
      this.backQueue = [];
  
      // $('#back').on('click', function (e) {
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
      $('#changeSelection').on('click', function (e) {
        self.renderFindStampPanel(albumPageRegionId, pageid);
      });
      var val = self.model.getDataForRegionId(albumPageRegionId).stampRecord;
      //self.stampsData.forEach(function (val, i) {
        if (val != null) {
  
          $('#metadata').append('<tr><th>ID</th><td>' + val.ID + '</td></tr>'); // metadata is added in line 303
          var flag_icon = val.flag_image;
          var style = 'background-image: url(https://www.rimell.cc/stampAlbum/flags/' + flag_icon + ');';
          if (flag_icon == null) 
            flag_icon = "32px_question_mark.png";
          else if (flag_icon === 'flags32y.png') {
            style = style + " background-position: "+val.image_x+"px " + val.image_y+"px;\"";
          }
          $('#metadata').append('<tr><th>Country</th><td><span class="flag_icon" style="' + style + '"></span>' + val.Country + '</td></tr>');
          $('#metadata').append('<tr><th>Name</th><td>' + val.stamp_name + '</td></tr>');
          $('#metadata').append('<tr><th>Description</th><td style="white-space: pre-line">' + val.Description + '</td></tr>');
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
           self.renderMyStamp($('.stampImageHolder'), regionData, pageid); // stampImageHolder gets added in this js ^^^
          //  $('.propertiesPanel').css ('display','inline-block');
       }
  
    }
  
    renderNotMyStamp ( holder, stamp, message = "") {
      const targetImageWidth = 400;
      const targetImageHeight = 200;
      holder.append('<div><div id="'+stamp.ID+'" class="stampImage" style="display:block; width:'+targetImageWidth+'px; height:'+targetImageHeight+'px; background-repeat: no-repeat; background-image: url(img/none-stamps.jpg)">'+message+':'+stamp.stamp_name+':'+stamp.FaceValue+'</div></div>');
      
    }
    renderMyStamp(holder, regionData, pageid) { // does everything for the holder (display of stamp on properties panel)
      // Take the width from the CSS, so it varies between desktop and mobile device.
      var csswidth = "400px"
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
  
  
        holder.append('<div><div id="'+regionData.albumPageRegionId+'" class="stampImage" style="display:block; width:'+targetImageWidth+'px; height:'+targetImageHeight+'px; background-size: ' +backgroundSize + 'px; background-position: -'+targetAlpha+'px -'+targetBeta+'px; background-repeat: no-repeat; background-image: url(https://rimell.cc/stampAlbum/img/' + pageid + '.jpg)"></div><div>'+pageid+'</div></div>');
      
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
      $('.countryList').empty();
      const TARGET_FLAG_SIZE = 60;
      const SOURCE_FLAG_SIZE = 32;
      const imgRatio = TARGET_FLAG_SIZE/SOURCE_FLAG_SIZE;
      const backgroundSize = 640 * imgRatio;
      data.forEach ((element, i) => {
        var style = 'background-image: url(https://www.rimell.cc/stampAlbum/flags/' + element.flag_image + ');';
        if (element.flag_image === 'flags32y.png') {
          style = style + " background-position: "+(parseInt(element.image_x)*imgRatio)+"px " + (parseInt(element.image_y)*imgRatio)+"px; background-size: "+backgroundSize+"px; ";
        }
        var stampCount = self.model.stampsCount[element.country];
        $('.countryList').append(`<div class="country d-flex"><div class="flag_item ${sd.image}" id="${element.id}" draggable="false" style="${style}"></div><div class="${sd.userInfo}" ><p class="headline-3" >${element.country}</p><p class="body-3 muted" >(${element.count} / ${stampCount})</p></div>`);
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
      
      // $('#back').css("display","inline-block");
  
  
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
          if (myStampsCount === el.count) 
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
            url: self.URL_PATH + 'getStamps.php?countryid='+countryId+(seriesName!=='ALL'?'&seriesName='+encodeURIComponent(seriesName):''),
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
      $('.stampImage').on('click',function (e) {
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

  export default Panels