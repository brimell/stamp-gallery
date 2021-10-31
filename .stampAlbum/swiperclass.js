import Swiper from './js/ext/swiper-bundle.esm.browser.js';

class SwiperClass {


    constructor(panels) {
        this.panels = panels;
        this.model = panels.model;
        this.scaleRatio = 1;
        this.swiper = null;

        var self = this;


        $('#albumA').on('click', function () {
            $('.countryList').css("display","none");
            $('.swiper').css("display","inline-block");
            self.initalRenderContainer("A1")});
        $('#albumB').click(function () {
              $('.countryList').css("display","none");
              $('.swiper').css("display","inline-block");
              self.initalRenderContainer("B1")});
        $('#albumC').click(function () {
                $('.countryList').css("display","none");
                $('.swiper').css("display","inline-block");
                self.initalRenderContainer("C1")});
  
        $('#debug').click(function () {
                    self.openNav();
        });
        $('.closebtn').click(function () {
            self.closeNav();
    });
        
    if(window.location.hash) {
      this.initalRenderContainer(window.location.hash.substring(1, 10));

    } else {
      this.initalRenderContainer("A1");
    }

    
    
/*
        var swiper2 = new Swiper('.swiper2', {
            direction: "horizontal",
            grabCursor: true,
            preloadImages: false,
            lazy: true,
            centeredSlides: true,
            slidesPerView: 1,
            on: {
                init: function () {
                    var selectedSlide = this.wrapperEl.children[this.activeIndex];
                    var hash = selectedSlide.dataset.hash;
                    var obj = $('.swiper-slide-active > img');
                    if (obj.length > 0 && obj[0].complete)
                            self.postSlideRenderSteps(self, hash);
                    else {
                        $('.swiper-slide-active > img').one("load", function () {
                            self.postSlideRenderSteps(self, hash);
                        });
                    }

                },

            }

        });
        swiper2.on('transitionEnd ', function (e) {
            var obj = swiper2.wrapperEl;
            console.log('slide changed:' + swiper2.activeIndex);
            var selectedSlide = obj.children[swiper2.activeIndex];
            var hash = selectedSlide.dataset.hash;
            console.log('selected slide=' + hash);
            var imgLoaded = $('.swiper-slide-active > img')[0].complete;
            if (imgLoaded)
                self.postSlideRenderSteps(self, hash);
            else {
                $('.swiper-slide-active > img').one("load", function () {
                    self.postSlideRenderSteps(self, hash);
                });
            }
        });
*/
    }

    logEvent(eventTxt) {
        console.log(eventTxt);
        const logDiv = document.getElementById("log");
        logDiv.innerHTML += eventTxt + "\n";
        logDiv.scrollTop = logDiv.scrollHeight;   // keep the scrolling to the bottom
    }

    renderSlide (slide, index) {
        return "<div class=\"swiper-slide\" data-hash=\"" +slide + "\"><img src=\"img/" +slide + ".jpg\" class=\"swiper-lazy img" +slide + "\"></div>";
    }

    initalRenderContainer(pageid = "A1") {
        var self = this;
        var count = 1;
        var container = $('.swiper-wrapper');
        if (this.swiper) {
            this.swiper.destroy(true);
        };
        $('.swiper-wrapper').empty();
        this.model.pagesList = new Array();
        const book = pageid.substring(0,1);
        const page = pageid.substring(1);
        const pageIdx = parseInt(page) - 1;
        var handle = $( "#custom-handle" );
        
        handle.text(pageid);


        if (book=="A") {     
          for (var x = 1; x < 110; x++) {
           // $("#swiper1").append("<div class=\"swiper-slide\" data-hash=\"A" + x + "\"><img data-src=\"img/A" + x + ".jpg\" class=\"swiper-lazy imgA" + x + "\"> <div class=\"swiper-lazy-preloader\"></div></div>");
           // $("#swiper2").append("<div class=\"swiper-slide\" data-hash=\"A" + x + "\"><img data-src=\"img/A" + x + ".jpg\" class=\"swiper-lazy imgA" + x + "\"> <div class=\"swiper-lazy-preloader\"></div></div>");
        
            this.model.pagesList.push('A' + x);
          }
        } else if (book=="B") {     
          for (var x = 1; x < 48; x++) {
           // $("#swiper1").append("<div class=\"swiper-slide\" data-hash=\"B" + x + "\"><img data-src=\"img/B" + x + ".jpg\" class=\"swiper-lazy imgB" + x + "\"> <div class=\"swiper-lazy-preloader\"></div></div>");
          //  $("#swiper2").append("<div class=\"swiper-slide\" data-hash=\"B" + x + "\"><img data-src=\"img/B" + x + ".jpg\" class=\"swiper-lazy imgB" + x + "\"> <div class=\"swiper-lazy-preloader\"></div></div>");
        
            this.model.pagesList.push('B' + x);
          }
        }  else if (book=="C") {     
            for (var x = 1; x < 34; x++) {
             // $("#swiper1").append("<div class=\"swiper-slide\" data-hash=\"C" + x + "\"><img data-src=\"img/C" + x + ".jpg\" class=\"swiper-lazy imgC" + x + "\"> <div class=\"swiper-lazy-preloader\"></div></div>");
             // $("#swiper2").append("<div class=\"swiper-slide\" data-hash=\"C" + x + "\"><img data-src=\"img/C" + x + ".jpg\" class=\"swiper-lazy imgC" + x + "\"> <div class=\"swiper-lazy-preloader\"></div></div>");
          
              this.model.pagesList.push('C' + x);
            }
          }



        this.swiper = new Swiper('.swiper1', {
            effect: 'coverflow',
            grabCursor: false,
            virtual: {
                enabled: true,
                slides: self.model.pagesList,
                renderSlide: self.renderSlide,
                addSlidesAfter: 2,
                addSlidesBefore: 2
            },
            mousewheel: true,
            centeredSlides: true,
            keyboard: {
                enabled: true,
            },
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',

                prevEl: '.swiper-button-prev',
            },
            
            on: {
                init: function () {
                    var selectedSlide = this.wrapperEl.children[this.activeIndex];
                    var hash = selectedSlide.dataset.hash;
                   // var obj = $('.swiper-slide-active > img');
                   // if (obj.length > 0 && obj[0].complete)
                        self.postSlideRenderSteps(self, hash);
                   // else {
                    //    $('.swiper-slide-active > img').one("load", function () {
                        //    self.postSlideRenderSteps(self, hash);
                    //    });
                   // }
                },
                transitionEnd: function (e) {
                    var activeSlideData = $('.swiper-slide-active').data('hash');
                    var newPageIdx = parseInt(activeSlideData.substring(1)) - 1;
                    handle.text(activeSlideData);
                    $( ".swiper-slider").slider( "option", "value", newPageIdx );

                    self.logEvent('selected slide=' + activeSlideData);
                    //obj = $('.swiper-slide-active > img');
                    //if (obj.length > 0 && obj[0].complete)
                            self.postSlideRenderSteps(self, activeSlideData);
                    //else {
                     //   $('.swiper-slide-active > img').one("load", function () {
                    //        self.postSlideRenderSteps(self, hash);
                    //    });
                    //}
        
                }
            }
            
        });

        this.swiper.slideTo(pageIdx);

      
        $( ".swiper-slider" ).slider({
            range: false,
            min: 0,
            max: self.model.pagesList.length,
            value: pageIdx,
            slide: function( event, ui ) {
                handle.text(book + ( ui.value +1));
                self.swiper.slideTo(ui.value);
            }
          });
/*
        this.swiper.on('transitionEnd ', function (e) {
            var obj = self.swiper.wrapperEl;
            console.log('slide changed:' + self.swiper.activeIndex);
            var selectedSlide = obj.children[self.swiper.activeIndex];
            var hash = selectedSlide.dataset.hash;
            console.log('selected slide=' + hash);
            //obj = $('.swiper-slide-active > img');
            //if (obj.length > 0 && obj[0].complete)
                    self.postSlideRenderSteps(self, hash);
            //else {
             //   $('.swiper-slide-active > img').one("load", function () {
            //        self.postSlideRenderSteps(self, hash);
            //    });
            //}

        });
*/
        $(window).on('resize', function () {
            var pageid = $('.swiper-slide-active').data('hash');
            self.logEvent("resize triggered. pageid="+pageid);
            self.postSlideRenderSteps(self, pageid);
        });

 
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
        $("img").removeAttr('usemap');
        this.renderImageMapForPage(pageid);
        $('.img' + pageid).attr('usemap', "#albumpage");
        this.logEvent("Added usemap attr to img:.img"+pageid);
        
        var pageStatusData = this.model.countUnmatchedStampsOnPage(this.model.getCurrentPage());

        $('#statusData').text(pageStatusData.join("/"));
        this.logEvent(this.escapeHtml($('.swiper-slide-active').html()));
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
        
        var imageMapData = this.model.getAlbumRegionsForPage(pageid);
        $('map').remove();
        if (imageMapData) {
            const imgHeight = imageMapData[0].imgHeight;
            const newHeight = $('.img'+pageid).height();
            this.scaleRatio = newHeight / imgHeight;
            self.logEvent("renderImageMap: newHeight="+newHeight+": imgHeight="+imgHeight+": scale=" + self.scaleRatio);

            $('.outer').append('<map name="albumpage"></map>');
            const map = $('map');
            var mapItemCount = 0;
            imageMapData.forEach(function (val, i) {
                var coordStr = Math.round(val.x1 * self.scaleRatio) + "," + Math.round(val.y1 * self.scaleRatio) + "," + Math.round(val.x2 * self.scaleRatio) + "," + Math.round(val.y2 * self.scaleRatio);
                if (val.shape == "poly") {
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
                $('area').click(function (e) {
                    e.preventDefault();
                    self.logEvent("clicked on regionid=" + e.target.id);
                    self.panels.clickOnStamp(self.panels, e.target.id, pageid);
                });
           // });
        }
    }

    /* Set the width of the sidebar to 250px (show it) */
 openNav() {
    document.getElementById("mySidepanel").style.width = "300px";
  }
  
  /* Set the width of the sidebar to 0 (hide it) */
   closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  } 
}

$(function () {
    var panels = new Panels();
    var swiperClass = new SwiperClass(panels);
});
