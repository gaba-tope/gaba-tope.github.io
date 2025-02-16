---
title: 서울시 행정동별 평균 소득 시각화 - Interactive plot with {leaflet}
tags: Visualization
categories: work
cover: /files/cover/2024-02-23-seoul-dong-int-cover.png
id: 2024-02-23-seoul-dong-int
---


이전에 만들어본 [서울시 행정동별 평균 소득 plot]({% post_url 2023-12-24-seoul-dong-visual %})을 사용자가 이리저리 살펴볼 수 있게 만들어 보았어요. 
<!--more-->

<iframe src="/files/interactive_page/map_leaflet.html" height="600px" width="100%" style="border:none;"></iframe>

[Visualizations/Seoul_2023_Dong_income_expenditure](https://github.com/gaba-tope/Visualizations/blob/04bd7c6c96bb4fa6898e6f70c50e9f1b664517d8/Seoul_2023_Dong_income_expenditure/Seoul_Dong_income_exp.R){:target="_blank"}에 사용한 R script가 있으니 확인해 보아도 좋겠습니다.

Leaflet을 처음 사용하여 interactive choropleth map을 만드는 경우라면 [An R Interface to Leaflet Maps](https://rstudio.github.io/leaflet/index.html){:target="_blank"}를 읽어보길 추천해요.


아래에서는 핵심 코드를 살펴보겠습니다. 이전에 사용하고 다듬은 데이터셋과 객체들을 그대로 사용합니다.

## 1. Data Wrangling

### 1-1.Transform EPSG

[이전 포스트]({% post_url 2023-12-24-seoul-dong-visual %}){:target='_blank'}에서 combined_data와 map_seoul_gu의 EPSG를 5179로 맞추었죠. 하지만 leaflet 패키지로 사용할 shape file 등은 좌표계 (CRS; Coordinate Reference System)가 [WGS84 (= EPSG:4326)이어야](https://rstudio.github.io/leaflet/articles/projections.html){:target="_blank"} 하므로 `sf::st_transform()`을 이용하여 변환합니다.

```r
combined_data_l <- st_transform(combined_data, 4326)
map_seoul_gu_l <- st_transform(map_seoul_gu, 4326)
```

### 1-2. Create Function for Palette

색칠에 사용할 팔레트를 만들어야겠죠? `leaflet::colorNumeric`은 주어진 팔레트와 데이터를 짝짓는 함수를 리턴합니다. 

```r
pal <- colorNumeric(palette = "Purples", domain = combined_data_l$mean_income)
```

### 1-3. Create position values for Gu-name

구 이름을 쓸 위치값을 객체에 저장합니다. 구 이름을 어디에 쓰면 좋을까요? 아마 각 구의 가운데 위치 부근에 쓰면 좋겠죠. [`sf::st_centroid()`](https://r-spatial.github.io/sf/reference/geos_unary.html){:target="_blank"}는 각 polygon geometry의 무게중심 (centroid) 좌표를 sf 객체로 리턴합니다. 

```r
cent_seoul_gu <- st_centroid(map_seoul_gu_l) 
```

## 2. Plotting with {leaflet}

### 2-1. Create Leaflet Object

Leaflet 객체를 생성합니다. Pipe operator (`|>`)를 통해 leaflet 객체에 요소를 덧붙일 수 있어요. `addTiles()`를 통해 base map, 그러니까 배경에 깔리는 기본 지도를 추가합니다.

```r
library(leaflet)
l <- leaflet() |> addTiles() |> 
```

### 2-2. Add Gu-map and Gu-name

구 지도와 구 이름을 덧붙입시다. `addPolygons()`를 통해 구 지도를, `addLabelOnlyMarkers()`를 통해 구 이름을 추가했다는 것을 이해할 수 있겠죠?

<details>
<summary> Click here to see more </summary>

{% highlight r %}
addPolygons(data = map_seoul_gu_l,
              color = "black", weight = 5,
              fillColor = "transparent",
              fillOpacity = 1, group = "gu") |> 
  addLabelOnlyMarkers(data = cent_seoul_gu, label =  ~SIG_KOR_NM, 
                      labelOptions = labelOptions(noHide = T, direction = 'top', textOnly = T,
                                                  style = list(
                                                    "font-family" = "noto-sans",
                                                    "font-style" = "bold",
                                                    "font-size" = "15px"
                                                  ))
  ) |>
{% endhighlight %}
</details>

### 2-3. Add Dong-map

행정동 지도를 추가합니다. 

<details>
<summary> Click here to see more </summary>

{% highlight r %}
addPolygons(data = combined_data_l,
              color = "#1a1a1a", weight = 1, dashArray = "3",
              fillColor = ~ pal(mean_income), fillOpacity = 0.8,
              highlightOptions = highlightOptions(
                weight = 3,
                color = "#666",
                dashArray = "",
                fillOpacity = 0.8,
                bringToFront = T
              ),
              label = labels,
              labelOptions = labelOptions(
                style = list("font-weight" = "normal", padding = "3px 8px"),
                textsize = "15px", direction = "auto"
              )
  ) |> 
{% endhighlight %}
</details>

- `color`, `weight`, `dashArray`는 각각 선의 색, 선의 두께, 선의 종류를 지정하는 파라미터입니다. 
- `fillColor = ~pal(mean_income)` 파라미터값은 무슨 뜻일까요?
`pal()`함수에 `mean_income`을 넣으면 데이터 수에 맞는 팔레트가 생성됩니다. 그 팔레트를 사용하겠다는 의미에요.
- 한편 `highlightOptions`는 마우스 커서를 특정 polygon 또는 subpolygon에 갖다 대었을 때 (hover) 어떤 변화를 일으킬지 지정하는 파라미터입니다.
- `label`은 마우스 커서를 특정 polygon에 갖다 대었을 때 (hover) 나오는 툴팁 (tooltip)에 표시할 내용을 지정하는 파라미터입니다. 사전에 만든 `labels` 객체는 다음과 같이 html 형식의 문자열을 포함하는 list입니다.


```r
labels <- sprintf(
  "<strong>%s</strong><br/>평균 %s원",
  combined_data$EMD_KOR_NM, format(formattable::comma(combined_data$mean_income, format = 'd'),
                                   scientific = F)
) %>% lapply(htmltools::HTML)
```

### 2-4. Add Plot Legend

Plot legend (범례)를 추가합니다.

```r
  addLegend(data = combined_data_l,
            pal = pal, values = ~mean_income, opacity = 0.8,
            title = "평균 소득 (원)")
```

### 2-5. Save Leaflet Object as HTML

Leaflet 객체를 HTML 파일로 저장합니다.

```r
htmlwidgets::saveWidget(l, file = "map_leaflet.html") 
```

## 3. Leaflet을 Jekyll post에 삽입하기

이 웹사이트는 Jekyll을 이용하여 만든 Github pages입니다. 제가 만든 interactive plot를 게시글에 어떻게 넣을 수 있을까요?

바로 iframe 요소를 사용하면 leaflet이나 plotly 등으로 만든 HTML 파일을 Jekyll post에 넣을 수 있습니다.

{% highlight html %}
<iframe src="/files/interactive_page/map_leaflet.html" height="600px" width="100%" style="border:none;"></iframe>
{% endhighlight %}

[Rob Williams의 포스트](https://jayrobwilliams.com/posts/2020/09/jekyll-html){:target="_blank"}에도 이에 관한 설명이 잘 되어 있으니 참고해볼만 하겠습니다.
