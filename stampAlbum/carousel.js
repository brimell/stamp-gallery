
class Carousel {


  constructor(container) {
    this.carouselContainer = container;
    this.scaleRatio = 1.1;
    var self = this;
    this.URL_PATH = "https://www.rimell.cc/stampAlbum/php/";
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.model = new StampData();


image

    $(window).on('resize', function () {
      self.calculateImageScaleRatio();
    });

    $('#countyListOption').click(function () {self.getKnownCountries()});

    $('#albumA').click(function () {
      $('.countryList').css("display","none");
      $('.gallery').css("display","inline");
      self.initalRenderContainer("A1")});
    $('#albumB').click(function () {
        $('.countryList').css("display","none");
        $('.gallery').css("display","inline");
        self.initalRenderContainer("B1")});

        
        document.addEventListener('scroll', function (e) {
         
          if (document.scrollingElement.scrollLeft > window.innerWidth / 2) {
            console.log("scrolled left by" + document.scrollingElement.scrollLeft);
        
          } else if (document.scrollingElement.scrollRight > window.innerWidth / 2) {
            console.log("scrolled right by" + document.scrollingElement.scrollRight);
        
          }
        });

   $('#globe').click(function () {
    $('.gallery').css("display","none");
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
     // map.geodataSource.url = "https://www.rimell.cc/stampAlbum/js/ext/amcharts4/geodata/world_1914.geojson";

// Configure series
      var polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = am4core.color("#74B266");

      // Create hover state and set alternative fill color
      var hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#367B25");

      // limits vertical rotation
      map.adapter.add("deltaLatitude", function(delatLatitude){
          return am4core.math.fitToRange(delatLatitude, -90, 90);
      });

     
    });

   

    $('#propertiesClose').click(function (e) {
      $('.propertiesPanel').css ('display','none');
    });


    this.clearContainer();
    if(window.location.hash) {
      this.initalRenderContainer(window.location.hash.substring(1, 10));

    } else {
      this.initalRenderContainer("A1");
    }



  }

  calculateImageScaleRatio() {
    const newHeight = $('.gallery-item-3').height();
    const originalHeight = $('.gallery-item-3')[0].naturalHeight;
    this.scaleRatio = newHeight / originalHeight;
    console.log(this.scaleRatio);
  }

  clearContainer() {
    $('.gallery-container').empty();
  }


  moveRight() {
    if (this.model.canMoveRight()) {
      var nextImgTitle = this.model.getNextTitle();
      $('.gallery-container').append('<img class="gallery-item" src="img/' + nextImgTitle + '.jpg" usemap="#albumpage" data-index="' + 5 + '">');

      $('.gallery-container').children().each(function (i, el) {
        el.classList.remove('gallery-item-1');
        el.classList.remove('gallery-item-2');
        el.classList.remove('gallery-item-3');
        el.classList.remove('gallery-item-4');
        el.classList.remove('gallery-item-5');
      });

      $('.gallery-container').children().each(function (i, el) {
        if (i != 0)
          el.classList.add(`gallery-item-${i}`);
      });

      $('.gallery-container').children().first().remove();
     // this.calculateImageScaleRatio();
     this.postRenderSteps();
    }
  }
  moveLeft() {
    if (this.model.canMoveLeft()) {
      var nextImgTitle = this.model.getPrevTitle();
      $('.gallery-container').prepend('<img class="gallery-item" src="img/' + nextImgTitle + '.jpg" data-index="1">');

      $('.gallery-container').children().each(function (i, el) {
        el.classList.remove('gallery-item-1');
        el.classList.remove('gallery-item-2');
        el.classList.remove('gallery-item-3');
        el.classList.remove('gallery-item-4');
        el.classList.remove('gallery-item-5');
      });

      $('.gallery-container').children().each(function (i, el) {
        if (i != 5)
          el.classList.add(`gallery-item-${i + 1}`);
      });

      $('.gallery-container').children().last().remove();

      this.postRenderSteps();
    }
  }

  postRenderSteps() {
    $('.gallery-item').removeAttr("usemap");
    $('.gallery-item-3').attr("usemap", "#albumpage");
    /*
    $(".gallery-item").on("mousedown", function (event) {
      var x = event.pageX - this.offsetLeft;
      var y = event.pageY - this.offsetTop;
      alert("X Coordinate: " + x + " Y Coordinate: " + y);
    });
    $(".gallery-item").on("mouseup", function (event) {
      var x = event.pageX - this.offsetLeft;
      var y = event.pageY - this.offsetTop;
      alert("X Coordinate: " + x + " Y Coordinate: " + y);
    });
    */
    this.renderImageMapForPage(this.model.getCurrentPage());

    var pageStatusData = this.model.countUnmatchedStampsOnPage(this.model.getCurrentPage());
    
    $('#statusData').text(pageStatusData.join("/"));

    //this.getAlbumData(this.pagesList[this.currentPage]);
   // this.getStampsForPage(this.pagesList[this.currentPage]);
   // this.initDraw($('.gallery-item-3').get(0));
  }
  
  initalRenderContainer(pageid = "A1") {
    var count = 1;
    var container = $('.gallery-container');
    $('.gallery-container').empty();
    this.model.pagesList = new Array();
    if (pageid.substring(0,1)=="A") {     
      for (var x = 1; x < 110; x++) {
        this.model.pagesList.push('A' + x);
      }
    } else if (pageid.substring(0,1)=="B") {     
      for (var x = 1; x < 48; x++) {
        this.model.pagesList.push('B' + x);
      }
    }
    var arrayIdx = this.model.pagesList.indexOf(pageid);
    this.model.currentPage = arrayIdx;
    //alert( navigator.userAgent);
    //if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    //|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    //  container.append('<img class="gallery-item gallery-item-3" src="https://www.rimell.cc/stampAlbum/img/' + pageid + '.jpg" data-index="' + 1 + '">')
    //} else {
      for (var x = arrayIdx -2; x < this.model.pagesList.length && count < 6; x++) {
        var imgTitle = "";
        if (arrayIdx < 0)
          imgTitle = "blank";
        else
          imgTitle = this.model.pagesList[x];

        container.append('<img class="gallery-item" src="img/' + imgTitle + '.jpg" data-index="' + count + '">');
        count++;
      }
      $('.gallery-container').children().each(function (i, el) {

        el.classList.add(`gallery-item-${i + 1}`);
      });
    //}
    
    this.calculateImageScaleRatio();
    this.postRenderSteps();
  }

/*
  getStampRecordForRegionId(albumPageRegionId) {
    var retVal = null;
    var BreakException = {};
    this.imageMapData.forEach(function (el, i) {
      if (el.albumPageRegionId == albumPageRegionId)
        retVal = el;

    });
    return retVal;
  }
*/

  compareByFaceValue( a, b ) {
    if ( a.FaceValue < b.FaceValue ){
      return -1;
    }
    if ( a.FaceValue > b.FaceValue ){
      return 1;
    }
    return 0;
  }

  renderFindStampPanel(albumPageRegionId) {
    const self = this;
    $('#propertiesBody').empty();
    var stampsData = this.model.getStampsPage(self.model.getCurrentPage());

    stampsData.sort(this.compareByFaceValue);
    
    var regionData = this.model.getDataForRegionId(albumPageRegionId);
    $('#propertiesBody').append('<table id="metadata"></table>');

    $('#metadata').append('<tr><th>My Image</th><td class="stampImageHolder"></td></tr>');
    self.renderMyStamp($('.stampImageHolder'), regionData,  $('.gallery-item-3')[0].naturalWidth, self.model.getCurrentPage());

    $('#propertiesBody').append('<ul id="possibles"></ul>');
    stampsData.forEach(function (val, i) {
      $('#possibles').append('<li id="' + val.ID + '"><a class="matchStampLink" href="#" id="' + val.ID + '">' + val.FaceValue+ ':'+val.Colors + ':' + val.Country + ':' + val.stamp_name + '</a></li>');
    });
   

    $('.matchStampLink').click(function (e) {
     // alert("link selected=" + e.target.id);
      self.updateStampForRegion(self.model.getCurrentPage(), albumPageRegionId, e.target.id);
      //this.renderImageMapForPage(this.pagesList[this.currentPage]);
      //self.getAlbumData(self.pagesList[self.currentPage]);
      self.renderStampPanel(self, albumPageRegionId, e.target.id,self.model.getCurrentPage());
    });
  }

  renderStampPanel(self, albumPageRegionId, stampid, pageid) {
    $('#propertiesBody').empty();

    $('#propertiesBody').append('<table id="metadata"></table>');
    $('#changeSelection').click(function (e) {
      self.renderFindStampPanel(albumPageRegionId);
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
         self.renderMyStamp($('.stampImageHolder'), regionData,  $('.gallery-item-3')[0].naturalWidth, pageid);
         $('.propertiesPanel').css ('display','inline-block');
     }

  }

  renderNotMyStamp ( holder, stamp, message = "") {
    const targetImageWidth = 400;
    const targetImageHeight = 200;
    holder.append('<div><div id="'+stamp.ID+'" class="stampImage" style="display:block; width:'+targetImageWidth+'px; height:'+targetImageHeight+'px; background-repeat: no-repeat; background-image: url(img/none-stamps.jpg)">'+message+':'+stamp.stamp_name+':'+stamp.FaceValue+'</div></div>');
    
  }
  renderMyStamp(holder, regionData, albumPageWidth, pageid) {
    const targetImageWidth = 400;
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

      const originalWidth = albumPageWidth;
      const backgroundSize = Math.round(originalWidth * widthRatio);


      holder.append('<div><div id="'+regionData.albumPageRegionId+'" class="stampImage" style="display:block; width:'+targetImageWidth+'px; height:'+targetImageHeight+'px; background-size: ' +backgroundSize + 'px; background-position: -'+targetAlpha+'px -'+targetBeta+'px; background-repeat: no-repeat; background-image: url(img/' + pageid + '.jpg)"></div><div>'+pageid+'</div></div>');
    
  }
  /*
  initDraw(canvas) {
    var mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    function setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
            mouse.x = ev.pageX + window.pageXOffset;
            mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) { //IE
            mouse.x = ev.clientX + document.body.scrollLeft;
            mouse.y = ev.clientY + document.body.scrollTop;
        }
    };

    var element = null;    
    canvas.onmousemove = function (e) {
        setMousePosition(e);
        if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        }
    }

    canvas.onclick = function (e) {
        if (element !== null) {
            element = null;
            canvas.style.cursor = "default";
            console.log("finsihed.");
        } else {
            console.log("begun.");
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = document.createElement('div');
            element.className = 'rectangle'
            element.style.left = mouse.x + 'px';
            element.style.top = mouse.y + 'px';
            canvas.parentElement.appendChild(element)
            canvas.style.cursor = "crosshair";
        }
    }
}
*/
renderImageMapForPage(pageid) {
  var self = this;
  var imageMapData = this.model.getAlbumRegionsForPage(pageid);
  $('map').remove();
  if (imageMapData) {
    $('.gallery-container').parent().append('<map name="albumpage"></map>');
    const map = $('map');
    imageMapData.forEach(function (val, i) {
      var coordStr = Math.round(val.x1 * self.scaleRatio) + "," + Math.round(val.y1 * self.scaleRatio)+ "," + Math.round(val.x2 * self.scaleRatio)+ "," + Math.round(val.y2 * self.scaleRatio);
    if (val.shape == "poly") {
        coordStr = coordStr + "," +  Math.round(val.x3 * self.scaleRatio) + "," + Math.round(val.y3 * self.scaleRatio);
        if (val.x4 >0) {
          coordStr = coordStr + "," +  Math.round(val.x4 * self.scaleRatio) + "," + Math.round(val.y4 * self.scaleRatio);
        }
      }
      map.append(`<area id="${val.albumPageRegionId}" shape="${val.shape}" coords="${coordStr}" alt="Stamp" href="computer.htm">`);

    });

    $(function () {
      $('map[name="albumpage"] area').click(function (e) {
          e.preventDefault();
          console.log("clicked on regionid=" + e.target.id);
          self.clickOnStamp(self, e.target.id);
      });
    });
  }
}
/*
  getAlbumData(pageid) {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: 'https://www.rimell.cc/getAlbumPage.php?pageid=' + pageid,
      async: true,
      success: function (data) {
        self.imageMapData = data;
        $('map').remove();
        $('.gallery-container').parent().append('<map name="albumpage"></map>');
        const map = $('map');
        data.forEach(function (val, i) {
          var coordStr = Math.round(val.x1 * self.scaleRatio) + "," + Math.round(val.y1 * self.scaleRatio)+ "," + Math.round(val.x2 * self.scaleRatio)+ "," + Math.round(val.y2 * self.scaleRatio);
         if (val.shape == "poly") {
             coordStr = coordStr + "," +  Math.round(val.x3 * self.scaleRatio) + "," + Math.round(val.y3 * self.scaleRatio);
             if (val.x4 >0) {
              coordStr = coordStr + "," +  Math.round(val.x4 * self.scaleRatio) + "," + Math.round(val.y4 * self.scaleRatio);
             }
          }
          map.append(`<area id="${val.albumPageRegionId}" shape="${val.shape}" coords="${coordStr}" alt="Stamp" href="computer.htm">`);

        });

        $(function () {
          $('map[name="albumpage"] area').click(function (e) {
              e.preventDefault();
              console.log("clicked on regionid=" + e.target.id);
              self.clickOnStamp(self, e.target.id);
          });
      });
    }
  });
  }
*/

  clickOnStamp(self, stampRegionId) {
    var albumRegion = self.model.getDataForRegionId(stampRegionId);
    var matchingStampId = albumRegion.stampid;

     if (matchingStampId == 0)
        self.renderFindStampPanel(stampRegionId);
     else
        self.renderStampPanel(self, stampRegionId, matchingStampId, albumRegion.pageid);
   
  }

  /*
  getStampsForPage(pageid) {
    var self = this;
    $.ajax({
      dataType: "json",
      type: "GET",
      url: 'https://www.rimell.cc/getStamps.php?pageid=' + pageid,
      async: true,
      success: function (data) {
        self.stampsData = data;
      }
    });

  }
*/
  renderCountryList (data) {
    var self = this;
    $('.gallery').css("display","none");
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

      self.getSeriesByCountry(e.target.id);
      //self.renderStampList(data);
    })
    $('.countryList').css("display","flex");
  }

  renderSeriesList (data) {
    var self = this;
    
    $('.gallery').css("display","none");
    $('.countryList').empty();
    var labelText = '<div id="sliderLabel">' + 
  '<label for="dateRange">Date Range:</label>'+
  '<input type="text" id="dateRange" readonly style="border:0; color:#f6931f; font-weight:bold;">'+
  '</div>';

    $('.countryList').append(labelText+'<div id="slider-range"></div><div id="seriesList"></div>');

   
    var minYear = 2000;

    data.forEach ((el, i) => {
      if (el.Series.length >0) {
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
    $( ".series" ).click(function (e) {
      const seriesName = $(this).attr("id");
      const countryId = $(this).attr("data-countryid");

    $.ajax({
          dataType: "json",
          type: "GET",
          url: self.URL_PATH + 'getStamps.php?countryid='+countryId+'&seriesName='+encodeURIComponent(seriesName),
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
    $('.gallery').css("display","none");
    $('.countryList').empty();

    data.forEach ((stamp, idx) => {
      var modelStamp = self.model.getStampForStampId(stamp.ID);
      if (modelStamp) {
        // known stamp but do we have any regions?
        if (modelStamp.regions.length >0) {
          modelStamp.regions.forEach (function (regionData, rIdx) {
            self.renderMyStamp($('.countryList'), regionData,  $('.gallery-item-3')[0].naturalWidth, regionData.pageid);
          });
        } else {
          self.renderNotMyStamp($('.countryList'), stamp, 'Not yet linked to page');
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
/*
class Swipe {
  constructor(element) {
      this.xDown = null;
      this.yDown = null;
      this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

      this.element.addEventListener('touchstart', function(evt) {
          this.xDown = evt.touches[0].clientX;
          this.yDown = evt.touches[0].clientY;
      }.bind(this), false);

  }

  onLeft(callback) {
      this.onLeft = callback;

      return this;
  }

  onRight(callback) {
      this.onRight = callback;

      return this;
  }

  onUp(callback) {
      this.onUp = callback;

      return this;
  }

  onDown(callback) {
      this.onDown = callback;

      return this;
  }

  handleTouchMove(evt) {
      if ( ! this.xDown || ! this.yDown ) {
          return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      this.xDiff = this.xDown - xUp;
      this.yDiff = this.yDown - yUp;

      if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) { // Most significant.
          if ( this.xDiff > 0 ) {
              this.onLeft();
          } else {
              this.onRight();
          }
      } else {
          if ( this.yDiff > 0 ) {
              this.onUp();
          } else {
              this.onDown();
          }
      }

      // Reset values.
      this.xDown = null;
      this.yDown = null;
  }

  run() {
      this.element.addEventListener('touchmove', function(evt) {
          this.handleTouchMove(evt);
      }.bind(this), false);
  }
}
*/
$(function () {
  const galleryContainer = document.querySelector('.gallery-container');
 
  const exampleCarousel = new Carousel(galleryContainer);

  //var swiper = new Swipe('.gallery-container');
  //swiper.onLeft(function() {  exampleCarousel.moveRight(); });
  //swiper.onRight(function() {  exampleCarousel.moveLeft(); });
  //swiper.run();

});
