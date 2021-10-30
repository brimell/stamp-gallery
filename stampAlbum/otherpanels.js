
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

    $('#back').click(function (e) {
      console.log("back queue length="+self.backQueue.length);
      var backRender = self.backQueue.pop();
      if (backRender)
        backRender();
      if (self.backQueue.length==0)
        $(this).css("display","none");
    });
    
    $('#countyListOption').click(function () {self.getKnownCountries()});

    /*
    $('#albumA').click(function () {
      $('.countryList').css("display","none");
      $('.outer').css("display","inline");
      self.initalRenderContainer("A1")});
    $('#albumB').click(function () {
        $('.countryList').css("display","none");
        $('.outer').css("display","inline");
        self.initalRenderContainer("B1")});

        */
   $('#globe').click(function () {
    $('.swiper').css("display","none");
    $('.propertiesPanel').css("display","none");
     $('.countryList').empty();
     $('.countryList').css("display","inherit");
     am4core.useTheme(am4themes_animated);

      var map = am4core.create("mainPanel", am4maps.MapChart);
      map.geodata = am4geodata_worldLow;
      map.projection = new am4maps.projections.Orthographic();
      map.zoomControl = new am4maps.ZoomControl();
      map.panBehavior = "rotateLongLat";
      var grid = map.series.push(new am4maps.GraticuleSeries());
      grid.toBack();
      // Create map polygon series
      var polygonSeries = map.series.push(new am4maps.MapPolygonSeries());

      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true;

      var labelSeries = map.series.push(new am4maps.MapImageSeries());
      var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
      labelTemplate.horizontalCenter = "middle";
      labelTemplate.verticalCenter = "middle";
      labelTemplate.fontSize = 10;
      labelTemplate.nonScaling = true;
      labelTemplate.interactionsEnabled = false;

      var countryList = "";
      map.geodata.features.forEach(function(val, idx) {
        var countryid = val.properties.id;
        var countryname = val.properties.name;
        countryList += "'"+countryid + "','" + countryname + "'\n";
       
      });
      console.log(countryList);
     // map.geodataSource.url = "https://www.rimell.cc/stampAlbum/js/ext/amcharts4/geodata/world_1914.geojson";
     const countryData = self.model.getStampsByCountry();
     polygonSeries.data = countryData;
     polygonSeries.heatRules.push({
      "property": "fill",
      "target": polygonSeries.mapPolygons.template,
      "min": am4core.color("#ffffff"),
      "max": am4core.color("#AAAA00"),
      "logarithmic": true
    });
     /*
     polygonSeries.events.on("inited", function () {
      polygonSeries.mapPolygons.each(function (polygon) {
        var label = labelSeries.mapImages.create();
        var state = polygon.dataItem.dataContext.name;
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        label.children.getIndex(0).text = state;
      });
    });
*/
// Configure series
      var polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      //polygonTemplate.fill = am4core.color("#74B266");
      polygonTemplate.tooltipText = "{name}: {value}";
      // Create hover state and set alternative fill color
      var hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#367B25");
      //polygonTemplate.propertyFields.fill = "fill";
      // limits vertical rotation
      map.adapter.add("deltaLatitude", function(delatLatitude){
          return am4core.math.fitToRange(delatLatitude, -90, 90);
      });
      polygonTemplate.events.on("hit", function(ev) {
        
        // get object info
        console.log(ev.target.dataItem.dataContext.id);
      });

    });

   

    $('#propertiesClose').click(function (e) {
      $('.propertiesPanel').css ('display','none');
    });





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

  renderFindStampPanel(albumPageRegionId, pageid) {
    const self = this;
    $('#propertiesBody').empty();
    var stampsData = this.model.getStampsPage(pageid);

    stampsData.sort(this.compareByFaceValue);
    
    var regionData = this.model.getDataForRegionId(albumPageRegionId);
    $('#propertiesBody').append('<div class="nonescrollable"></div>');

   // $('#metadata').append('<tr><th>My Image</th><td class="stampImageHolder"></td></tr>');
    self.renderMyStamp($('.nonescrollable'), regionData, pageid);
    $('.nonescrollable').append('<div class="facevalues"></div>');
    var facevaluesuniques = [];
    $('#propertiesBody').append('<div class="scrollable"><ul id="possibles"></ul></div>');
    stampsData.forEach(function (val, i) {
      $('#possibles').append('<li id="' + val.ID + '" data-value="'+val.FaceValue+'"><a class="matchStampLink" href="#" id="' + val.ID + '">' + val.FaceValue+ ':'+val.Colors + ':' + val.Country + ':' + val.stamp_name + '</a></li>');
      if (facevaluesuniques[val.FaceValue]){

      } else {
        facevaluesuniques[val.FaceValue]=val.FaceValue;
        $('.facevalues').append('<span id="'+val.FaceValue+'" class="facevalue">'+val.FaceValue+'</div>');
      }
    });
   
    $('.facevalue').click(function (e) {
      var clickedFaceValue = e.target.id;
      $('li').each(function(idx) {
        if ($(this).data('value') != clickedFaceValue) {
          $(this).css('display','none');
        } else {
          $(this).css('display','inherit');
        }
      });
    });

    $('.matchStampLink').click(function (e) {
     // alert("link selected=" + e.target.id);
      self.updateStampForRegion(pageid, albumPageRegionId, e.target.id);
      //this.renderImageMapForPage(this.pagesList[this.currentPage]);
      //self.getAlbumData(self.pagesList[self.currentPage]);
      self.renderStampPanel(self, albumPageRegionId, e.target.id,pageid);
    });
    $('.propertiesPanel').css ('display','inline-block');
  }

  convertMarkup (input) {
    if (input)
      return input.replace(/\[b\]/g,"<b>").replace(/\[\/b\]/g,"</b>");
    else
      return "";
  }
  renderStampPanel(self, albumPageRegionId, stampid, pageid) {
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
    data.forEach ((el, i) => {
      var style = 'background-image: url(https://www.rimell.cc/stampAlbum/flags/' + el.flag_image + ');';
      if (el.flag_image == 'flags32y.png') {
        style = style + " background-position: "+(parseInt(el.image_x)*imgRatio)+"px " + (parseInt(el.image_y)*imgRatio)+"px; background-size: "+backgroundSize+"px; ";
      }
      var stampCount = self.model.stampsCount[el.country];
      $('.countryList').append(`<div class="country"><div class="flag_item" id="${el.id}" draggable="false" style="${style}"></div><div>${el.country} (${el.count} / ${stampCount})</div></div>`);
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
