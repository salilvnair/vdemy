$(document).ready(()=>{
    $('#slides').superslides({
        animation: 'fade',
        play: 5000,
        pagination: false
    });

    var typed = new Typed(".typed",{
        strings: [
            "Udemy Look Alike",
            "Offline video player",
            "v2.0.0 is out now",
            "with features like",
            "New config tab",
            "Course preview tiles with %",
            "Support for offline course thumbnail and author image"],
        typeSpeed: 70,
        loop: true,
        startDelay:1000,
        showCursor: false 
    });

    $('.owl-carousel').owlCarousel({
        loop:true,
        responsive:{
            0:{
                items:1
            },
            480:{
                items:2
            },
            768:{
                items:3
            },
            938:{
                items:4
            }
        }
    })

    var skillsTopOffset = $(".skill__section").offset().top;
    var statsTopOffset = $(".stats__section").offset().top;   
    var countUpFired = false; 
    $(window).scroll(()=>{
        if(window.pageYOffset > skillsTopOffset - $(window).height() + 200){
            $(() => {
                $('.chart').easyPieChart({
                    easing: 'easeInOut',
                    barColor: '#fff',
                    trackColor: false,
                    scaleColor: false,
                    lineWidth: 4,
                    size: 152,
                    onStep: function (from,to,percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    }
                });
            });
        }
        if(!countUpFired && window.pageYOffset > statsTopOffset - $(window).height() + 200){
            fetch('https://api.github.com/repos/salilvnair/vdemy/releases/assets/11847859')
            .then(function(response) {
                return response.json();
            })
            .then(function(responseJson) {
                var downloadCount = responseJson.download_count;
                $("#downloadCount").text(downloadCount);                
                $('.counter').each(function() {
                    var element = $(this);
                    var endVal = parseInt(element.text());
                    element.countup(endVal);
                })
                countUpFired = true;
            });
        }
    })


    $("#navigation li a").click(function (e) {
        var targetElement = $(this).attr('href');
        if (targetElement!='#'){
            e.preventDefault();
            var targetPosition = $(targetElement).offset().top;
            var positionAdjustment = 150;
            if($('.navbar-toggler').is(':visible')){
                positionAdjustment = 10;
            }
            $("html, body").animate({ scrollTop : targetPosition-positionAdjustment },"slow");
        }
    });

    const nav = $("#navigation");
    const navTop = nav.offset().top;
    
    $(window).on("scroll", () => {
         const body = $("body");
         if($(window).scrollTop() >= navTop) {
             body.css("padding-top",nav.outerHeight() + "px");
             body.addClass("nav__fixed");
         }
         else{
            body.css("padding-top",0);
            body.removeClass("nav__fixed");
         }
    })

});