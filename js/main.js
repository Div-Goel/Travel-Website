(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    // Smooth scroll for same-page hash links (e.g., #about-section)
    $('a[href*="#"]:not([href="#"])').on('click', function (e) {
        var href = $(this).attr('href');
        try {
            var url = new URL(href, window.location.href);
            var currentPath = window.location.pathname.replace(/\/+$/, '');
            var linkPath = url.pathname.replace(/\/+$/, '');
            // Only intercept when the link points to this same page and has a hash
            if (url.hash && linkPath === currentPath) {
                var $target = $(url.hash);
                if ($target.length) {
                    e.preventDefault();
                    $('html, body').animate({ scrollTop: $target.offset().top }, 600, 'swing');
                }
            }
        } catch (err) {
            // Ignore malformed URLs
        }
    });

    // If the page loads with a hash (e.g., index.html#about-section), animate to it
    $(function () {
        if (window.location.hash) {
            var $targetOnLoad = $(window.location.hash);
            if ($targetOnLoad.length) {
                setTimeout(function () {
                    $('html, body').animate({ scrollTop: $targetOnLoad.offset().top }, 600, 'swing');
                }, 0);
            }
        }
    });
    
})(jQuery);

