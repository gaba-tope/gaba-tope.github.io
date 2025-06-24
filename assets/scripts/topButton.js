var topButton = document.getElementById("toTop"); 

// 사용자가 스크롤할 때 실행되는 함수
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.opacity = "1"; // 스크롤 위치가 20px 이상일 때 버튼 표시
    } else {
        topButton.style.opacity = "0"; // 그 외에는 버튼 숨김
    }
}

window.onscroll = function() {scrollFunction()};

// 구형 브라우저용 스무스 스크롤 함수
function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    var startTime = performance.now();
    
    function step(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        
        // easeInOutCubic 이징 함수
        var easeProgress = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startY + distance * easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// 버튼 클릭 시 페이지 맨 위로 스무스하게 이동하는 함수
topButton.onclick = function() {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // 구형 브라우저를 위한 애니메이션
        smoothScrollTo(0, 500);
    }
}

