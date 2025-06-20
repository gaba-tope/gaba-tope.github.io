---
title: "Google Analytics 4에서 내부 트래픽 제외하기"
tags: [jekyll]
categories: work
id: 2025-06-20-GA4-internal-traffic
cover: /files/cover/2025-06-20-GA4-internal-traffic.webp
modify_date: 2025-06-20
---

Jekyll Blog 방문자 통계를 Google Analytics로 추적할 때 내 컴퓨터로 접속한 것까지 포함되면 내가 원하는 데이터를 얻을 수 없겠죠?

Google Analytics 4에서 내 컴퓨터로 접속한 트래픽을 데이터에서 걸러내는 필터를 설정할 수 있습니다.
<!--more-->
이 포스트는 구글 기술지원 문서[^ref]를 바탕으로 내부 트래픽을 filter out한 이후 정리해본 글입니다. 아래에서 Google Analytics는 'GA'로 줄이겠습니다.

## 1. 내부 트래픽 정의

[GA Admin 창](https://analytics.google.com/analytics/web/#/?pagename=admin&utm_source=gahc&utm_medium=dlinks){:target='_blank'}에서 Data Collection and Modification(데이터 수집 및 수정) 메뉴의 Data streams(데이터 스트림)을 클릭합니다. 이어 작업하고자 하는 데이터 스트림 항목을 선택합니다. 아래에서는 제 홈페이지인 gaba-tope website 항목을 골랐습니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:40%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/GA_setting.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/GA_setting.webp" alt=""
            title = "GA_setting" width="100%">
        </a>
        <figcaption>설정 창에 진입.</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_streams.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_streams.webp" alt=""
            title = "data_streams" width="100%">
        </a>
        <figcaption>Data streams 클릭!</figcaption>
        </figure>
    </div>
</div>

Web stream details(웹 스트림 세부정보) 화면에서 Configure tag settings(태그 설정 구성)를 클릭합니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:40%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_streams_details.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_streams_details.webp" alt=""
            title = "data_streams_details" width="100%">
        </a>
        <figcaption>Configure tag setting 또는 태그 설정 구성을 클릭!</figcaption>
        </figure>
    </div>
</div>

Google tag 화면에서 show more(자세히 보기) 클릭 후 Define Internal Traffic (내부 트래픽 정의)를 클릭합니다.

Create(만들기) 버튼을 눌러 규칙의 이름을 쓰고, IP addresses Match type(검색 유형)에서 어떤 방식으로 IP 주소를 필터링할지 정합니다. traffic_type의 기본값은 internal로 되어 있을 것입니다.

저는 제 컴퓨터의 IP 주소를 필터링할 것이므로 Match type(검색 유형)을 IP address equals(IP 주소가 다음과 같음)로 하여 Value(값) 칸에 제 IP주소를 넣겠지요. 필요하면 규칙을 더하면 됩니다. 

이후 Create(만들기)를 클릭!

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:20%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_streams_details_Define_InternalTraffic.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_streams_details_Define_InternalTraffic.webp" alt=""
            title = "data_streams_details_Define_InternalTraffic" width="100%">
        </a>
        <figcaption>Define Internal Traffic (내부 트래픽 정의)를 클릭!</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:30%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_streams_details_Define_InternalTraffic_create.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_streams_details_Define_InternalTraffic_create.webp" alt=""
            title = "data_streams_details_Define_InternalTraffic_create" width="100%">
        </a>
        <figcaption>규칙 생성!</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:30%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_streams_details_Define_InternalTraffic_create_setting.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_streams_details_Define_InternalTraffic_create_setting.webp" alt=""
            title = "data_streams_details_Define_InternalTraffic_create_setting" width="100%">
        </a>
        <figcaption>만들기!</figcaption>
        </figure>
    </div>
</div>

## 2. 데이터 필터 생성

[GA Admin 창](https://analytics.google.com/analytics/web/#/?pagename=admin&utm_source=gahc&utm_medium=dlinks){:target='_blank'}에서 Data Collection and Modification(데이터 수집 및 수정) 메뉴의 Data filters(데이터 필터)를 클릭합니다. 

필터를 생성한 후, filter type(필터 타입)을 Internal Traffic(내부 트래픽)으로 선택합니다.

데이터 필터의 이름을 쓰고 Filter operation(필터 연산)을 exclude(제외)로 합니다. 내부 트래픽을 제외할 거니까요.

traffic_type 파라미터의 값은 아까 정의했던 내부 트래픽 규칙의 traffic type 값인 internal로 하면 됩니다. 

이후 fliter state(필터 상태)를 고른 후 데이터 필터를 생성합니다. testing 상태로 두고 잘 되는지 확인 후 active로 바꾸어도 좋겠습니다. 문서에 따르면 데이터 필터가 적용되는데에 24~36시간이 걸릴 수 있다고 합니다.

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:40%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_filters.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_filters.webp" alt=""
            title = "data_filters" width="100%">
        </a>
        <figcaption>Data Filter를 클릭!</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:40%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_filters_setting.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_filters_setting.webp" alt=""
            title = "data_filters_setting" width="100%">
        </a>
        <figcaption>필터 설정하여 생성!</figcaption>
        </figure>
    </div>
</div>

## 3. Test

GA Reports(보고서) 탭의 Realtime Overview (실시간 개요) 탭에서 'Add comparison (비교 추가)'을 클릭, Create New(새로 만들기)를 클릭, Dimension(측정 기준)에서 'Test data filter name (테스트 데이터 필터 이름)' 항목을 선택합니다. Dimension values에는 아까 생성했던 데이터 필터의 이름을 넣어줍니다. 저는 Dimension(측정기준), Match Type(검색유형), Value(값) 텍스트박스에 각각 Test data filter name(테스트 데이터 필터 이름), contains(다음을 포함), Internal Traffic으로 넣었습니다. 이후 Apply(적용하기)를 누르면 Realtime Overview (실시간 개요)에 새로운 비교 항목이 생성됩니다. 

<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:30%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_test_overviewPage.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_test_overviewPage.webp" alt=""
            title = "data_test_overviewPage" width="100%">
        </a>
        <figcaption>(+) 버튼을 눌러 Comparison을 새로 만들자.</figcaption>
        </figure>
    </div>
    <div style="position:relative; float:left; padding:5px; width:50%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_test_create_comparison.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_test_create_comparison.webp" alt=""
            title = "data_test_create_comparison" width="100%">
        </a>
        <figcaption>값을 적절히 입력하고 적용하기!</figcaption>
        </figure>
    </div>
</div>

해당 비교항목이 켜져 있는 창에서는 전체 사용자와 해당 데이터 필터에 해당하는 사용자의 통계를 나누어 확인할 수 있습니다. 저는 바로 제 컴퓨터로 사이트에 접속하였는데, 데이터 필터가 잘 작동한 것을 확인할 수 있었습니다.
<div class="row" style="display: flex; justify-content: center;">
    <div style="position:relative; float:left; padding:5px; width:70%">
        <figure>
        <a href="/files/img/2025-06-20-GA4-internal-traffic/data_test_comparison_Realtime_overview.webp" data-lightbox="vis">
            <img src = "/files/img/2025-06-20-GA4-internal-traffic/data_test_comparison_Realtime_overview.webp" alt=""
            title = "data_test_comparison_Realtime_overview" width="100%">
        </a>
        <figcaption>주황색 박스 쪽에서 내부 트래픽이 잡히는 것을 확인.</figcaption>
        </figure>
    </div>
</div>

데이터 필터가 적용되는데 시간이 걸린다고 하니 제대로 작동하는지 확인한 이후 데이터 필터를 활성화시키는 것이 좋을 것 같습니다.

[^ref]: [https://support.google.com/analytics/answer/10104470?hl=en](https://support.google.com/analytics/answer/10104470?hl=en){:target='_blank'}