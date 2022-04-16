(function ($) {
  "use strict";

  //   Main Slider Carousel
  if ($(".banner-carousel").length) {
    $(".banner-carousel").owlCarousel({
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      loop: true,
      margin: 230,
      nav: true,
      singleItem: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 6000,
      navText: [
        '<span class="bi bi-arrow-left"></span>',
        '<span class="bi bi-arrow-right"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
    });
  }
})(window.jQuery);
