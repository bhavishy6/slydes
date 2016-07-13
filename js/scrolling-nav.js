$( document ).ready(function() {
    $("span.bracket").hide();
});

//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($("span#nameheader").offset().top > 75) {
        // $(".navbar-brand").addClass("nameheader-collapse");
        $("span.lower").fadeOut(200);
        $("span.bracket").fadeIn(200);
    } else {
        // $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $("span.lower").fadeIn(200);
        $("span.bracket").fadeOut(200);
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
