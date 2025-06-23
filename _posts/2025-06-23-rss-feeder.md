---
title: "RSS Reader를 이용하여 블로그 포스트 알림받는 법!"
tags: [jekyll]
categories: work
id: 2025-06-20-GA4-internal-traffic
cover: /files/cover/2025-06-23-rss-feeder.png
modify_date: 2025-06-20
---
네이버나 티스토리 등 자체 앱이 있는 블로그와 달리 제 홈페이지는 앱이 없습니다. 새로운 포스트가 올라와도 알림을 받기 어렵다는 단점이 있지요.

하지만 사실 **알림을 받을 수 있습니다**. 네이버 블로그나 티스토리보다 훨씬 가볍고 근본있고 확장성있는 **RSS 피드**라는 것을 이용하면 됩니다.

<!--more-->
## 알림받는 방법

### 앱

RSS 리더(RSS Reader) 앱을 이용하면 됩니다. 여러 모바일/웹 앱이 있는데, 저는 'Feeder.co' (https://feeder.co/)라는 RSS 리더 앱을 이용합니다. [모바일 앱](https://play.google.com/store/apps/details?id=feeder.co){:target='_blank'}, [데스크탑 웹](https://feeder.co/){:target='_blank'}, [크롬 확장프로그램](https://chromewebstore.google.com/detail/rss-feed-reader/pnjaodmkngahhkoihejjehlcdlnohgmp?hl=en&pli=1){:target='_blank'} 모두 있어서 계정 하나만 만들면 편리하게 이용할 수 있어요. 

Feeder 이외에도 Feedly 등 RSS 피드 리더가 다양하니 마음에 드시는 것으로 사용하시면 됩니다.

사용방식은 매우 간단합니다. **RSS 주소를 RSS 리더에 등록하기만 하면 끝!!**

### 예시

Feeder 웹과 저의 홈페이지를 예로 들어보겠습니다.

Feeder 홈페이지 혹은 모바일 앱에서 계정을 생성합니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:60%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/rss_feeder_account.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/rss_feeder_account.webp" alt=""
            title = "rss_feeder_account" width="100%">
        </a>
        <figcaption>계정을 만듭니다.</figcaption>
        </figure>
    </div>
</div>

제 홈페이지 맨 아래의 노란색 안테나 아이콘을 누르거나 각 게시글 하단의 'subscribe' 링크를 누르면 [https://gaba-tope.github.io/feed.xml](https://gaba-tope.github.io/feed.xml){:target='_blank'}라는 페이지가 뜹니다. 이 페이지의 주소, 즉 'https://gaba-tope.github.io/feed.xml'를 복사합니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:60%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/rss_link.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/rss_link.webp" alt=""
            title = "rss_link" width="100%">
        </a>
        <figcaption>열린 RSS 페이지의 주소를 복사합니다. </figcaption>
        </figure>
    </div>
</div>

로그인 후 Feeder 앱 또는 웹에서 + 모양의 피드 추가 버튼을 누르고 복사한 주소를 붙여넣어 검색하면 나오는 제 홈페이지의 피드를 팔로우 합니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:33%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/add_feed.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/add_feed.webp" alt=""
            title = "add_feed" width="100%">
        </a>
        <figcaption>보라색 플러스 버튼을 누른 후</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:33%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/add_feed_paste.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/add_feed_paste.webp" alt=""
            title = "add_feed_paste" width="100%">
        </a>
        <figcaption>주소를 붙여넣고 검색버튼을 누르면</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:33%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/add_feed_search_results.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/add_feed_search_results.webp" alt=""
            title = "add_feed_search_results" width="100%">
        </a>
        <figcaption>이처럼 제 홈페이지 RSS 피드라는 것이 나옵니다. 팔로우를 눌러줍시다.</figcaption>
        </figure>
    </div>
</div>

피드를 편집하여 피드 이름, 알림을 확인할 주기, 알림 방법 등을 설정할 수 있습니다.
<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/add_feed_added.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/add_feed_added.webp" alt=""
            title = "add_feed_added" width="100%">
        </a>
        <figcaption>왼쪽 창에 제 홈페이지 피드가 추가된 것을 확인할 수 있습니다. </figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/add_feed_edit.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/add_feed_edit.webp" alt=""
            title = "add_feed_edit" width="100%">
        </a>
        <figcaption>선택 후 우클릭하여 편집할 수도 있습니다.</figcaption>
        </figure>
    </div>
</div>

### 그룹별로 받아보기

저는 다음과 같이 카테고리를 나누어 놓고 여러 홈페이지/블로그 등의 글들을 하나의 창에서 받아봅니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/rss_categories.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/rss_categories.webp" alt=""
            title = "rss_categories" width="100%">
        </a>
        <figcaption>각 피드를 그룹화하여 </figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/rss_categories_personal_blogs.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/rss_categories_personal_blogs.webp" alt=""
            title = "rss_categories_personal_blogs" width="100%">
        </a>
        <figcaption>그룹별로 받아볼 수도 있습니다</figcaption>
        </figure>
    </div>
</div>

## 왜 굳이 이걸 써야 하나: 아주 널리 사용되기 때문!

제 홈페이지 하나 알림받으려고 RSS 피드 리더(RSS Feed Reader)를 사용하는 것은 불편하겠죠. 하지만 RSS 피드는 굉장히 유용합니다. **거의 모든 블로그 플랫폼들이 RSS 피드 기능을 지원**하기 때문입니다.

***따라서 RSS의 최대 장점은 웹페이지를 막론하고 새로운 게시물을 한꺼번에 모아볼 수 있다는 데 있습니다.***

즉, RSS 리더를 이용하여 네이버 블로그, 티스토리 블로그, Github Jekyll Blog, 브런치, Velog, 워드프레스 블로그, 포스타입 게시글, 연합뉴스 기사, 특정 저자의 연구논문, 네이버 특정 키워드 뉴스 검색결과, 유튜브 특정 채널 등등, 서비스를 막론하고 새로운 웹 게시물이 등록되었을 때 이를 알림받고 한번에 확인할 수 있는 것입니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:30%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/Naver_rss.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/Naver_rss.webp" alt=""
            title = "Naver_rss" width="100%">
        </a>
        <figcaption>네이버 RSS 피드</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-23-rss-feeder/tistory_rss.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-23-rss-feeder/tistory_rss.webp" alt=""
            title = "tistory_rss" width="100%">
        </a>
        <figcaption>티스토리 RSS 피드. 따로 버튼은 없지만, 블로그 주소에 "/feed"만 붙여주면 RSS 피드 주소가 됩니다.</figcaption>
        </figure>
    </div>
</div>


<details>
<summary>서비스별 RSS 피드 주소 확인법 (클릭하여 더보기)</summary>
1. 네이버 블로그: 보통 블로그에 RSS 버튼이 있습니다. 'RSS 2.0 | RSS1.0 | ATOM 0.3'이라 적힌 링크를 누르면 RSS 피드 주소를 볼 수 있습니다.<br>
2. 티스토리: 블로그 주소에 "/feed"만 붙여주면 RSS 피드 주소가 됩니다. "https://블로그이름.tistory.com/rss" 처럼요.<br>
3. 브런치: <a href="https://www.ttmkt.com/kr/tools/brunch-rss-generator/" target="_blank">브런치 RSS 피드 생성 서비스</a>에서 RSS 피드 주소를 받을 수 있습니다.<br>
4. 워드프레스: 블로그 주소에 "/feed/"를 붙여주면 RSS 피드 주소가 됩니다. "https://블로그이름.wordpress.com/feed/" 처럼요. <br>
5. 포스타입: 포타 주소에 "/rss"를 붙여주면 됩니다. "postype.com/@포스타입이름/rss"처럼요.<br>
6. velog: "https://v2.velog.io/rss/블로그이름"이 RSS 피드 주소입니다.<br>
7. 연합뉴스 기사: 자세한 설명은 <a href="https://www.yna.co.kr/rss/index" target="_blank">연합뉴스 rss 페이지</a>를 참고. <br>
8. Pubmed 논문: Advanced Search에서 Author query로 연구자 이름과 Affiliation query로 연구자의 소속을 AND로 추가한 후 나오는 검색결과 페이지에서 검색창 바로 아래 'Create RSS'를 눌러 RSS 피드 주소를 확인할 수 있다. 보다 자세한 설명은 '준준xy'의 포스트 <a href="https://junjunxy.tistory.com/58" target="_blank">RSS를 이용한 pubmed논문 구독</a>을 보세요.<br>
9. 유튜브: '뒬탕'의 <a href="https://discordbot.tistory.com/50" target="_blank">유튜브 새 동영상 알림을 RSS로(또는 디스코드로) 받아봅시다</a> 포스트가 보다 자세한 설명을 제공하니 보세요.
</details>

전 학교 공지사항도 RSS 피드를 통해 받아보고 있습니다. 아주 기본 기능으로 간주되어 생각보다 널리 사용되고 있으니 여기 나와있지 않은 서비스가 RSS 피드를 제공하는지 확인해보시길 권합니다.

## 번외 — 왜 네이버 블로그가 아니라 개인 홈페이지를 사용하는가?

제 개인 홈페이지는 정적 웹사이트를 생성해주는 Jekyll이라는 도구를 사용하여 만들고 있습니다. Jekyll 블로깅은 러닝 커브가 꽤 가팔라서 진입장벽이 상당하고 사진 첨부나 디자인 수정 등을 GUI가 아니라 HTML 및 CSS를 이용해야 한다는 점에서 번거로울 수 있습니다.
네이버 블로그나 티스토리 등에 비해 포스팅이 상당히 번거롭고 귀찮음에도 계속 이용하는 이유는 다음과 같습니다.

1. 마크다운 문법에 익숙해져 계속 그렇게 글을 쓰고 싶다.
2. 자주 사용하는 HTML 스니펫은 초반에 만들어 놓아서 복사-붙여넣기만 하면 된다.
3. 커스터마이징이 매우 자유롭다. 사실 커스터마이징이 자유로운만큼 일일이 지정할 것이 많아 번거롭고 귀찮다고도 볼 수 있다. 네이버 블로그에서는 내가 원하는 폰트와 색을 사용하거나 iframe 등 웹페이지를 삽입하는 것이 어려운 것으로 알고 있다.
4. 정적 사이트라서 상호작용이 불가능한데 Google Firebase 등을 이용하여 상호작용 서비스를 추가해보는 재미…? 요즘은 할 게 많아서 사이트 자체를 건드리는 일은 별로 없긴 하다.



​