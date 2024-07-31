$(function() {
  if ($("header").length) {
    $(window).scroll(function() {
      let scrollTop = $(document).scrollTop();
      if (scrollTop > 800) {
        $('header').addClass('fixed');
      } else {
        $('header').removeClass('fixed');
      }
    });
  }
});


$(function() { 
  $('.topBtn').css('display','none');
  $(window).scroll(function() { if ($(this).scrollTop() > 300) { 
    $('.topBtn').fadeIn();
      } else { 
        $('.topBtn').fadeOut(); 
      } 
  });
	$('.topBtn').click(function(){
		$('html, body').animate({scrollTop:0},500);
	});
});


// $(function() {
//   $(".menu ul li").on("mouseenter", function() {
//     $(this).addClass("on");
//   });
// });
// $(function() {
//   $(".menu ul li").on("mouseleave", function() {
//     $(this).removeClass("on");
//   });
// });


$(function(){

  "use strict";

  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
      
    hue = 217,
    stars = [],
    count = 0,
    maxStars = 1000;
  
  // Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
  // Cache gradient
  var canvas2 = document.createElement('canvas'),
      ctx2 = canvas2.getContext('2d');
      canvas2.width = 100;
      canvas2.height = 100;
  var half = canvas2.width/2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
      gradient2.addColorStop(0.025, '#fff');
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 0%, 33%)');
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 0%, 6%)');
      gradient2.addColorStop(1, 'transparent');
  
      ctx2.fillStyle = gradient2;
      ctx2.beginPath();
      ctx2.arc(half, half, half, 0, Math.PI * 2);
      ctx2.fill();
  
  // End cache
  
  function random(min, max) {
    if (arguments.length < 2) {
      max = min;
      min = 0;
    }
    
    if (min > max) {
      var hold = max;
      max = min;
      min = hold;
    }
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function maxOrbit(x,y) {
    var max = Math.max(x,y),
        diameter = Math.round(Math.sqrt(max*max + max*max));
    return diameter/2;
  }
  
  var Star = function() {
  
    this.orbitRadius = random(maxOrbit(w,h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 1000000;
    this.alpha = random(2, 10) / 10;
  
    count++;
    stars[count] = this;
  }
  
  Star.prototype.draw = function() {
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
        twinkle = random(10);
  
    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }
  
    ctx.globalAlpha = this.alpha;
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }
  
  for (var i = 0; i < maxStars; i++) {
    new Star();
  }
  
  function animation() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 3%, 1)';
      ctx.fillRect(0, 0, w, h)
    
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 1, l = stars.length; i < l; i++) {
      stars[i].draw();
    };  
    
    window.requestAnimationFrame(animation);
  }
  
  animation();

});

$(function() {
  let isAnimating = false;

  function scrollToSection(target) {
    if (isAnimating) return;
    isAnimating = true;
    $('html, body').animate({ scrollTop: $(target).offset().top }, 700, () => isAnimating = false);
  }

  // $(window).on('wheel', function(event) {
  //   if (isAnimating) return;
  //   let deltaY = event.originalEvent.deltaY;
  //   if (deltaY > 0 && $(window).scrollTop() < $('#section2').offset().top) {
  //     scrollToSection('#section2');
  //   } else if (deltaY < 0 && $(window).scrollTop() > 0) {
  //     scrollToSection('#section1');
  //   }
  // });

  $('.main_menu a').on('click', function(e) {
    e.preventDefault();
    scrollToSection($(this).attr('href'));
  });

  $('.scroll_icon').on('click', function() {
    scrollToSection('#section2');
  });
});

$(function() {
  var mySwiper = new Swiper('.meimg_slide', {
    slidesPerView: 1, // 한 번에 표시할 슬라이드 수
    loop: true, // 슬라이드 루프(무한 회전) 활성화
    autoplay: {
        delay: 2000, // 2초마다 자동 재생
        disableOnInteraction: false // 사용자 상호 작용 후에도 자동 재생 유지
    },
    effect: 'fade', // 페이드 인/아웃 효과
    direction: 'horizontal', // 슬라이드 방향 (수평)
    touchRatio: 1, // 슬라이드 드래그 감도
    mousewheel: false, // 마우스 휠로 슬라이드 이동 가능
    centeredSlides: true, // 슬라이드 중앙 정렬
    watchOverflow: true // 슬라이드가 화면을 넘어갈 때의 처리 설정
  });
});
