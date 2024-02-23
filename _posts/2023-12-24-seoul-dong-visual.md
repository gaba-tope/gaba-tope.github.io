---
title: 서울시 행정동별 평균 소득 및 소비 시각화
tags: Visualization
---

서울시의 행정동별 평균 소득 및 소비 데이터셋을 우연히 발견하여, 시각화해보면 좋겠다 싶어 만들어보았어요.
[Visualizations/Seoul_2023_Dong_income_expenditure](https://github.com/gaba-tope/Visualizations/tree/04bd7c6c96bb4fa6898e6f70c50e9f1b664517d8/Seoul_2023_Dong_income_expenditure)에 사용한 R script가 있으니 확인해 보아도 좋겠습니다.

<iframe src="/files/interactive_page/map_leaflet.html" height="600px" width="100%" style="border:none;"></iframe>

### Dataset
1. 서울시 행정동별 평균 소득 및 소비 데이터셋
    - "서울 열린데이터 광장"에서 제공하는 [서울시 상권분석서비스(소득소비-서울시)](https://data.seoul.go.kr/dataList/OA-22168/S/1/datasetView.do)의 .csv 파일을 다운로드하여 사용함. 
    - 최신수정일자 2023.11.13일자의 데이터
    - License: CC BY
2. 서울시 구역의 도형 데이터셋
    - ["주소기반산업지원서비스"]("https://business.juso.go.kr/")의 "제공하는 주소" - "구역의 도형" - 2022년 11월 자료 선택하여 수령 ("구역의도형_전체분_서울특별시.zip") 후 사용함.
    - "TL_SCCO_GEMD.shp"이 서울시 행정동의 구역의 도형 shape file임. .dbf 파일과 .shx 파일과 동일 directory에 있어야 함을 유의.
    - "TL_SCCO_SIG.shp"이 서울시 구의 구역의 도형 shape file임. 마찬가지로 .dbf 파일과 .shx 파일과 동일 directory에 있어야 함.

### Data 가공
1. quarter == 20231 조건에 해당하는 데이터만 사용.<br>
```r
seoul_20231 <- dplyr::filter(seoul, quarter == 20231)
```
2. "seoul_20231" object의 데이터는 "개포3동", "상일제1동", "상일제2동"의 데이터를 포함하지 않고 있는데, 이는 데이터가 행정동 분리와 명칭 변경 이전에 작성되었기 때문인 것으로 보임.
- "seoul_20231"상의 "일원2동"은 2022년 12월 23일에 "개포3동"으로 명칭이 변경됨 ([강남구청](https://www.gangnam.go.kr/board/B_000031/1072853/view.do?mid=ID01_0313)). 이에 따라 "seoul_20231"상의 "dong_name"변수를 "일원2동"에서 "개포3동"으로 변경하고 해당 "dong_code"와 "EMD_CD" 변수 또한 변경하여 "seoul_20231_updated" 객체에 저장함.<br>
```r
seoul_20231_updated[seoul_20231_updated$dong_code == 11680740, 17] <- "1168067500" # 일원2동 -> 개포3동 renamed
seoul_20231_updated[seoul_20231_updated$dong_code == 11680740, 3] <-  "개포3동" # 일원2동 -> 개포3동 renamed
```
- "seoul_20231"상의 "상일동"은 2021년 07월 01일에 "상일제1동"으로 명칭이 변경됨 ([상일1동 주민센터](https://www.gangdong.go.kr/web/dongrenew/contents/sangil_010_010)). 이에 따라 "seoul_20231"상의 "dong_name"변수를 "상일동"에서 "상일제1동"으로 변경하고 해당 "dong_code"와 "EMD_CD" 변수 또한 변경하여 "seoul_20231_updated" 객체에 저장함.<br>
```r
seoul_20231_updated[seoul_20231_updated$dong_code == 11740520, 17] <- "1174052500" # 상일동 -> 상일제1동 renamed
seoul_20231_updated[seoul_20231_updated$dong_code == 11740520, 3] <- "상일제1동" # 상일동 -> 상일제1동 renamed
```
- "seoul_20231"상의 "강일동"의 남쪽 지역은 2021년 07월 01일에 "상일제2동"으로 분리됨 ([연합뉴스](https://www.yna.co.kr/view/AKR20210621039600004)). 이에 따라 "seoul_20231_updated" 객체에 "dong_name"을 "상일제2동"으로, 해당하는 "dong_code"와 "EMD_CD"를 넣어 새로운 행을 추가함. 이때 "상일제2동"의 소득-지출 데이터는 "강일동"의 데이터를 복사하여 그대로 붙여넣었음. <br>
```r
seoul_20231_updated[nrow(seoul_20231_updated)+1, ] <- NA # New empty row added
seoul_20231_updated[nrow(seoul_20231_updated), 1:3] <- list(20231, 11740526,"상일제2동") # 상일제2동 row added (South region of 강일동 became 상일제2동)
seoul_20231_updated[nrow(seoul_20231_updated), 4:16] <- seoul_20231_updated[283, 4:16] # 상일제2동 data is the same as 강일동. 
seoul_20231_updated[nrow(seoul_20231_updated), 17] <- "1174052600"
```
3. "seoul_20231_updated" object을 shape object인 "map_seoul"과 left_join()으로 merge. 기준은 EMD_CD임.

### Plotting
1. {ggplot2}의 geom_sf object을 사용하여 지도를 그림. 
2. [Interactive plot](https://gaba-tope.github.io/2023/12/24/seoul-dong-visual.html)은 {leaflet} 패키지를 사용하여 그림.

