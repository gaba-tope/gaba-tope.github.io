// // 클릭 이벤트 핸들러
// $("#topBtn").click(function(e){
//     e.stopPropagation();
//     $("html, body").animate({ scrollTop : 0 }, 'slow', 'easeOutCubic');
// });

// // 스크롤 이벤트 핸들러
// $(window).scroll(function() {
//     if($(window).scrollTop()==0)
//     {
//         $("#topBtn").css("opacity",0); // 맨위로 버튼 숨기기
//     }
//     else{
//         $("#topBtn").css("opacity",1);
//     }
// });

var topButton = document.getElementById("toTop");

// 사용자가 스크롤할 때 실행되는 함수
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.opacity = "1"; // 스크롤 위치가 20px 이상일 때 버튼 표시
    } else {
        topButton.style.opacity = "0"; // 그 외에는 버튼 숨김
    }
}

// 버튼 클릭 시 페이지 맨 위로 스무스하게 이동하는 함수
topButton.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 스크롤 이벤트 핸들러
$(window).scroll(function() {
    if($(window).scrollTop()==0)
    {
        $("#toTop").css("opacity",0); // 맨위로 버튼 숨기기
    }
    else{
        $("#toTop").css("opacity",1);
    }
});