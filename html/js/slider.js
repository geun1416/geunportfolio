$(function(){
  var swiper = new Swiper('.blog-slider', {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        mousewheel: {
          invert: false,
        },
        // autoHeight: true,
        pagination: {
          el: '.blog-slider__pagination',
          clickable: true,
        }
      });
});

$(function(){
  var mySwiper = new Swiper('.swiper-container', {
      loop: true,
      speed: 1000,
      autoplay: {
          delay: 2000,
      },
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
          rotate: 0,
          stretch: 100,
          depth: 150,
          modifier: 1,
          slideShadows: true,
      },

      // Navigation arrows
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
      pagination : {
  			el : '.swiper-pagination',
  			clickable : true,
  		},
  })
});
