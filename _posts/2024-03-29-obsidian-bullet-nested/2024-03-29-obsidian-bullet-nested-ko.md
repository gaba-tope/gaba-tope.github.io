---
title: Nested Unordered Lists에서 bullet style 커스터마이징하기
tags: [obsidian]
categories: work
cover: /files/cover/2024-03-29-obsidian-bullet-nested.png
lang: ko
permalink: /work/2024/03/29/obsidian-bullet-nested
---
## Intro
옵시디언은 nested list의 각 레벨에 모두 동일한 기호를 사용합니다. CSS (Cascading Style Sheets)를 수정하여 레벨 별로 기호를 달리 쓸 수 있습니다.
아래에서는 이 방법들을 살펴보겠습니다. <!--more-->

## Solution 1 - ZenMoto's
[ZenMoto](https://forum.obsidian.md/u/ZenMoto){:target="_blank"}가 [Obsidian forum post](https://forum.obsidian.md/t/problems-encountered-when-modifying-unordered-lists-styles-with-css/53824/2){:target="_blank"}에서 답한 내용이 도움이 되었습니다.

CSS를 잘 알지 못하는 분들에게는 W3Schools의 [CSS Styling Lists](https://www.w3schools.com/css/css_list.asp) 튜토리얼을 추천드립니다.

### 한계
Unordered list가 ordered list 내부에 들어있을 때는 우리가 원하지 않는 방식으로 나옵니다.

- 우리가 원하는 것:
<p align="left">
  <img src="/files/img/expect-sol1.png" width="30%">
</p>
- 실제 결과:
<p align="left">
  <img src="/files/img/actual-sol1.png" width="30%">
</p>

{% include codeHeader.html %}
```css
/*========ZenMoto's Script=========*/

/* LEVEL 1 */
.markdown-reading-view ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-1 .list-bullet:after {
/* Bullet */
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 2 */
.markdown-reading-view ul > li > ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-2 .list-bullet:after {
/* Dash */
    height: 1px;
    width: 7px;
    border-radius: 0%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 3 */
.markdown-reading-view ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-3 .list-bullet:after {
/* Hollow Bullet */
    height: 4px;
    width: 4px;
    background-color: Transparent;
    border-color: var(--bullet-new-color);
    border-style: solid;
    border-radius: 50%;
    border-width: 1px;
} 

/* LEVEL 4 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-4 .list-bullet:after {
/* Solid Square */
    height: 5px;
    width: 5px;
    border-radius: 0%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 5 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-5 .list-bullet:after {
/* Dash */
    height: 1px;
    width: 7px;
    border-radius: 0%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 6 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-6 .list-bullet:after {
/* Hollow Square */
    height: 4px;
    width: 4px;
    background-color: Transparent;
    border-color: var(--bullet-new-color);
    border-style: solid;
    border-radius: 0%;
    border-width: 1px;
} 

/* LEVEL 7 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-source-view.mod-cm6 .HyperMD-list-line-7 .list-bullet:after {
/* Small Bullet */
    height: 2px;
    width: 2px;
    border-radius: 50%;
    background-color: var(--bullet-new-color);
} 

/* bullet color */
:root { --bullet-new-color: rgb(89,89,223);}
```

## Solution 2 - 한계 보완됨
이를 해결하고자 저는 Zenmoto의 코드를 약간 변형시켰습니다. Source-view mode에서는 스타일이 적용되지 않지만, preview mode에서는 스타일이 적용됩니다. Source-view mode에 관해서는 `.markdown-source-view.mod-cm6`를 수정해야 하는데, 이 부분은 잘 알지 못하여 따로 스타일을 적용하지 못했습니다.

[ZenMoto's solution](https://forum.obsidian.md/t/problems-encountered-when-modifying-unordered-lists-styles-with-css/53824/2){:target="_blank"}을 약간 변형한 코드:

{% include codeHeader.html %}
```css
/* LEVEL 1 */
.markdown-reading-view ul > li > .list-bullet:after,
.markdown-reading-view ol > ul > li > .list-bullet:after {
/* Bullet */
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 2 */
.markdown-reading-view ul > li > ul > li > .list-bullet:after,
.markdown-reading-view ol > ul > li > ul > li > .list-bullet:after {
/* Dash */
    height: 1px;
    width: 7px;
    border-radius: 0%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 3 */
.markdown-reading-view ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-reading-view ol > ul > li > ul > li > ul > li > .list-bullet:after {
/* Hollow Bullet */
    height: 4px;
    width: 4px;
    background-color: Transparent;
    border-color: var(--bullet-new-color);
    border-style: solid;
    border-radius: 50%;
    border-width: 1px;
} 

/* LEVEL 4 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-reading-view ol > ul > li > ul > li > ul > li > ul > li > .list-bullet:after {
/* Solid Square */
    height: 5px;
    width: 5px;
    border-radius: 0%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 5 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-reading-view ol > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after {
/* Dash */
    height: 1px;
    width: 7px;
    border-radius: 0%;
    background-color: var(--bullet-new-color);
} 

/* LEVEL 6 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-reading-view ol > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after {
/* Hollow Square */
    height: 4px;
    width: 4px;
    background-color: Transparent;
    border-color: var(--bullet-new-color);
    border-style: solid;
    border-radius: 0%;
    border-width: 1px;
} 

/* LEVEL 7 */
.markdown-reading-view ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after,
.markdown-reading-view ol> ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > .list-bullet:after {
/* Small Bullet */
    height: 2px;
    width: 2px;
    border-radius: 50%;
    background-color: var(--bullet-new-color);
} 

/* bullet color */
:root { --bullet-new-color: rgb(89,89,223);}

```
Level 1 ~ level 3에 스타일을 적용하면 다음 결과를 볼 수 있습니다:
<p align="left">
  <img src="/files/img/nested_unordered_list.png" width="40%">
</p>

### 한계
두 방법 모두 PDF로 export된 문서에서는 적용되지 않는 것 같고요, HTML 파일에서는 부분적으로만 적용되는 듯합니다. 
