---
title: Obsidian에서 지정한 부분만 특정 폰트 사용하기 - Google Font
tags: [obsidian]
categories: work
cover: /files/cover/obsidian_logo.png
---
## 상황
Obsidian같은 markdown 파일에서 지정한 부분만 특정한 폰트를 사용하기를 원할 수 있다.
- 예컨대 한자를 읽을 수 있도록 보여주는 폰트를 사용하고자 할 때, Google Font의 "Noto Sans KR" 폰트를 사용하고 싶을 수 있다. 
- Noto Sans KR 폰트는 "https://fonts.google.com/noto/specimen/Noto+Sans+KR"에서 확인할 수 있다.

<p align="center">
  <img src="/files/img/google_font.png" width="90%">
</p>

## 방법
1. Obsidian에서 사용하는 CSS Snippet에 다음을 추가한다. 폰트를 import하는 단계이다.
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');
```
2. 해당 폰트에 대한 span class를 생성한다. 
```css
.your-custom-class {
  font-family: 'FONT_NAME', sans-serif;
}
```
가령 Noto Sans KR 폰트에 대해서 다음 스크립트를 CSS에 추가한다.
```css
.noto-sans-kr {
  font-family: "Noto+Sans+KR", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
```
3. MD 파일에서 span element를 다음과 같이 사용한다.
```
소련의 대(<span class="noto-sans-kr">對</span>)한 정책
```
실제로 한자가 제대로 표시되는 것을 알 수 있다.

CSS에 관한 기본적인 개념과 규칙에 생소하다면 [CSS MDN WebDocs](https://developer.mozilla.org/ko/docs/Web/CSS){:target="_blank"}을 참고하는 것도 좋을 것 같다.