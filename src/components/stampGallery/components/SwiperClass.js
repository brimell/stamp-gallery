import $ from 'jquery';


class SwiperClass {

    constructor(panels) {
        this.panels = panels;
        this.model = panels.model;
        this.scaleRatio = 1;
        this.swiper = null;
    
        
    if(window.location.hash) {
      this.initalRenderContainer(window.location.hash.substring(1, 10).replace('/books/','').toUpperCase()+'1');
    } else {
      this.initalRenderContainer("A1");
    }
    }
    logEvent(eventTxt) {
        console.log(eventTxt);
        var logDiv = $(".navbar-dropdown");
        logDiv.append(`<button type="button" tabindex="0" role="menuitem" class="dropdown-item"><span>${eventTxt}</span></button>`)
    }

    initalRenderContainer(pageid = 'A1') {
        var self = this
        this.model.pagesList = []
        // const book = pageid.substring(0,1);
        // const page = pageid.substring(1);
        // const pageIdx = parseInt(page) - 1;
        // var handle = $( "#custom-handle" );
        // handle.text(pageid);

        sessionStorage.setItem('curr_page',pageid)
        self.postSlideRenderSteps(self, pageid);
        $(window).on('resize', function () {
            var pageid = sessionStorage.getItem('curr_page')
            self.logEvent("resize triggered. pageid="+pageid);
            self.postSlideRenderSteps(self, pageid);
        });
        $(window).on('hash', function () {
            var pageid = sessionStorage.getItem('curr_page')
            self.logEvent("resize triggered. pageid="+pageid);
            self.postSlideRenderSteps(self, pageid);
        })

 
      }

      escapeHtml(unsafe)
        {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

    postSlideRenderSteps(self, pageid) {
        $( ".image-gallery-image" ).ready(function () {
            $(".image-gallery-image").removeAttr('usemap');
            self.renderImageMapForPage(pageid);
            $('.image-gallery-image').attr('usemap', "#albumpage");
            self.logEvent("Added usemap attr to img:.img"+pageid);
          })
        
        
        // var pageStatusData = this.model.countUnmatchedStampsOnPage(this.model.getCurrentPage());
        // $('#statusData').text(pageStatusData.join("/"));
    }
    calculateImageScaleRatio() {
        const newHeight = $('.swiper-slide-active > img').height();

        //const originalHeight = $('.swiper-slide-active > img')[0].naturalHeight;
        const originalHeight = 4032;
        return newHeight / originalHeight;


    }


    renderImageMapForPage(pageid) {
        var self = this;
        //this.scaleRatio = this.calculateImageScaleRatio();
        $('.image-gallery-image').ready(function () {
        var imageMapData = self.model.getAlbumRegionsForPage(pageid);
        $('map').remove();
        if (imageMapData) {
            const imgHeight = imageMapData[0].imgHeight;
            const newHeight = $('.image-gallery-image').height();
            self.scaleRatio = newHeight / imgHeight;
            self.logEvent("renderImageMap: newHeight="+newHeight+": imgHeight="+imgHeight+": scale=" + self.scaleRatio);

            $('#root').append('<map name="albumpage"></map>');
            const map = $('map');
            var mapItemCount = 0;
            imageMapData.forEach(function (val, i) {
                var coordStr = Math.round(val.x1 * self.scaleRatio) + "," + Math.round(val.y1 * self.scaleRatio) + "," + Math.round(val.x2 * self.scaleRatio) + "," + Math.round(val.y2 * self.scaleRatio);
                if (val.shape === "poly") {
                    coordStr = coordStr + "," + Math.round(val.x3 * self.scaleRatio) + "," + Math.round(val.y3 * self.scaleRatio);
                    if (val.x4 > 0) {
                        coordStr = coordStr + "," + Math.round(val.x4 * self.scaleRatio) + "," + Math.round(val.y4 * self.scaleRatio);
                    }
                }
                map.append(`<area id="${val.albumPageRegionId}" shape="${val.shape}" coords="${coordStr}" alt="Stamp" href="javascript:void(0)">`);
                mapItemCount++;
            });
            self.logEvent("Added "+mapItemCount+" to the map. MapDataArray has length="+imageMapData.length);
           // $(function () {
                $('area').on('click', function (e) {
                    e.preventDefault();
                    self.logEvent("clicked on regionid=" + e.target.id);
                    self.panels.clickOnStamp(self.panels, e.target.id, pageid);
                });
           // });
        }
        })
        
    }

    /* Set the width of the sidebar to 250px (show it) */
//  openNav() {
//     document.getElementById("mySidepanel").style.width = "300px";
//   }
  
//   /* Set the width of the sidebar to 0 (hide it) */
//    closeNav() {
//     document.getElementById("mySidepanel").style.width = "0";
//   } 
}
export default SwiperClass