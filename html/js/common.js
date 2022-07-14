$(function() {

  if( $("header").length ){
      var jbOffset = $("header").offset();
      $( window ).scroll( function() {
          if ( $( document ).scrollTop() > jbOffset.top ) {
              $( 'header' ).addClass( 'fixed' );
          }
          else {
              $( 'header' ).removeClass( 'fixed' );
          }
      });
  }
});

$(function(){
var topEle = $('#topBtn');

topEle.on('click', function() {
$('html, body').stop().animate({scrollTop: 0});
});

var typingBool = false;
var typingIdx=0;
var liIndex = 0;
var liLength = $(".typing-txt>ul>li").length;


var typingTxt = $(".typing-txt>ul>li").eq(liIndex).text();
//liIndex 인덱스로 구분해 한줄씩 가져옴

typingTxt=typingTxt.split(""); // 한글자씩 잘라 배열로만든다

if(typingBool==false){ // 타이핑이 진행되지 않았다면
    typingBool=true;
    var tyInt = setInterval(typing,100); // 반복동작
}

function typing(){
  $(".typing ul li").removeClass("on");
   $(".typing ul li").eq(liIndex).addClass("on");
  //현재 타이핑되는 문장에만 커서 애니메이션을 넣어준다.

  if(typingIdx<typingTxt.length){ // 타이핑될 텍스트 길이만큼 반복
     $(".typing ul li").eq(liIndex).append(typingTxt[typingIdx]); // 한글자씩 이어준다.
     typingIdx++;
   } else{ //한문장이끝나면
     if(liIndex<liLength-1){
     //다음문장으로  가기위해 인덱스를 1증가
       liIndex++;
     //다음문장을 타이핑하기위한 셋팅
        typingIdx=0;
        typingBool = false;
        typingTxt = $(".typing-txt>ul>li").eq(liIndex).text();

     //다음문장 타이핑전 1초 쉰다
         clearInterval(tyInt);
          //타이핑종료

         setTimeout(function(){
           //1초후에 다시 타이핑 반복 시작
           tyInt = setInterval(typing,100);
         },1000);
        } else if(liIndex==liLength-1){

         //마지막 문장까지 써지면 반복종료
           clearInterval(tyInt);

          //1초후
          setTimeout(function(){
            //사용했던 변수 초기화
            typingBool = false;
          liIndex=0;
          typingIdx=-0;

            //첫번째 문장으로 셋팅
          typingTxt = $(".typing-txt>ul>li").eq(liIndex).text();
               //타이핑 결과 모두 지우기
          $(".typing ul li").html("")

            //반복시작
            tyInt = setInterval(typing,100);
          }, 1000);
        }
    }
}

var topEle = $('#topBtn');

topEle.on('click', function() {
$('html, body').stop().animate({scrollTop: 0});
});

$('a[href*=#]').on('click', function(event){
event.preventDefault();
$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
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
