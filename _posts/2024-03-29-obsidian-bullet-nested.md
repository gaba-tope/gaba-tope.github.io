---
title: Customizing Bullet Styles in Nested Unordered Lists
tags: [obsidian]
categories: work
cover: /files/cover/2024-03-29-obsidian-bullet-nested.png
lang: en
ref: obs-bullet
---
## Intro
Obsidian does not have different bullet shapes for different levels of nested lists. To customize bullet styles, one has to modify the CSS (Cascading Style Sheets) code. Below are ways to resolve the issue. <!--more-->

## Solution 1 - ZenMoto's
I could find the working solution in the [Obsidian forum post](https://forum.obsidian.md/t/problems-encountered-when-modifying-unordered-lists-styles-with-css/53824/2){:target="_blank"} answered by [ZenMoto](https://forum.obsidian.md/u/ZenMoto){:target="_blank"}.

For those unfamiliar with applying style with CSS, [CSS Styling Lists](https://www.w3schools.com/css/css_list.asp) tutorial on W3Schools is a helpful resource for beginners.

### Downside
When an unordered list is used within the ordered list, the bullet styles are not shown as expected.

- What we expect:
<p align="left">
  <img src="/files/img/expect-sol1.png" width="30%">
</p>
- What is actually shown:
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

## Solution 2 - Downside fixed
To resolve this issue, I slightly modified the ZenMoto's script. The rule to **apply the style to the source-view mode is deprecated, but the issue can be solved in the preview-mode**. The reason why the solution cannot be applied to the source-view mode is that I do not know much about the `.markdown-source-view.mod-cm6` script, and thus couldn't come up with a solution to have designated bullet styles even under ordered lists.

Slight modification to the [ZenMoto's solution](https://forum.obsidian.md/t/problems-encountered-when-modifying-unordered-lists-styles-with-css/53824/2){:target="_blank"} by me:

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
Using the script for level 1 ~ level 3, I now have the desired result:
<p align="left">
  <img src="/files/img/nested_unordered_list.png" width="40%">
</p>

### Downside
It seems that both of the solutions don't apply to the published document in a PDF file, though partially applied in a HTML file.


Feel free to adjust the script with your preference!