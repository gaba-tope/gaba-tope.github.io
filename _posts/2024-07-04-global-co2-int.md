---
title: Global CO2 Emission Plot - Interactive plot with {plotly}
tags: [Visualization, tidytuesday]
categories: work
cover: /files/cover/2024-07-04-global-co2-int.png
---
<style>
.container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

/* Then style the iframe to fit in the container div with full height and width */
.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
As part of the [tidytuesday challenge a few months ago (2024-05-21)](https://github.com/rfordatascience/tidytuesday/blob/master/data/2024/2024-05-21/readme.md){:target="_blank"}, I made an interactive line plot showing the amount of emitted carbon by major oil, gas, coal, and cement producers. One can get their cursor on a line to see how much carbon was emitted in the year, by type of commodities. Although some time has passed since this challenge was posted, I found the dataset highly intriguing. The data includes CO2 emissions per type of commodity produced by major fossil fuel-related corporations, revealing the variety of resources responsible for carbon emissions. 
 <!--more-->

The interactive plot below is optimized for desktop viewing or horizontal view mode.
<div class = "container">
<iframe class="responsive-iframe" src="/files/interactive_page/total_e_ly_post.html" style="border:none"></iframe>
</div>

- 'MtCO2e' stands for 'million tonnes of carbon dioxide equivalent', which is an unit for total emission values.
- R script to create the above plot is in [tidytuesday/2024/2024-05-21/2024-05-21 (carbon majors).R](https://github.com/gaba-tope/tidytuesday/blob/4fdeb3564e2492887072918ee255fc00454e19eb/2024/2024-05-21/2024-05-21%20(carbon%20majors).R){:target="_blank"}.
- Let's see how I wrangled the data and created a the plot. I focused on the code for creating a plotly object. You can see the script to see code for static ggplot2 plot.


# Data Import

```r
tuesdata <- tidytuesdayR::tt_load('2024-05-21')
emissions <- tuesdata$emissions
```

# Data Wrangling
1. `total_e_year` column, which is a sum of the carbon dioxide emission in the corresponding year and from the corresponding commodity was created.<br>
```r
total_emissions <- emissions |> 
  select(commodity, total_emissions_MtCO2e, year) |> 
  group_by(year, commodity) |> 
  mutate(total_e_year = sum(total_emissions_MtCO2e))
```
2. Since I will be adding each line plot for a commodity using each commodity column, the dataframe was widened. Regarding `pivot_wider()`, `pivot_longer()`, and the concept of tidy data, the introduction of 'tidy data' in [tidyr Documentation](https://tidyr.tidyverse.org/articles/tidy-data.html){:target="_blank"} would be helpful. <br>
```r
# emission data: text column added for plotly
total_emissions_ly <- total_emissions |> 
    select(-total_emissions_MtCO2e) |> 
  group_by(year, commodity) |> 
  summarise(total_e_year = sum(total_e_year, na.rm = TRUE), .groups = "drop") |> 
  pivot_wider(names_from = commodity, values_from = total_e_year, values_fill = 0)
```

# Font and Colors

Before plotting, let's specify font and color palette for plots.

1. Using `showtext::font_add_google()`, you can add font provided by [Google Font](https://fonts.google.com/){:target="_blank"}.
```r
## Fonts & Colors ---------------------------------------------------
font_add_google(name = "Oswald", family = "oswald")
showtext_auto()
main_font <- "oswald"
```
2. To use custom font for your Plotly HTML that will be embedded in other webpage, you need to add CSS snippet to Plotly object. Lets assign CSS snippet to `font_css` beforehand.
```r
# Font dependency for plotly
oswald_file <- showtextdb::google_fonts("Oswald")$regular_url 
font_css <- paste0(
  "<style type = 'text/css'>",
  "@font-face { ",
  "font-family: 'oswald'; ", 
  "src: url('", oswald_file, "'); ", 
  "}",
  "</style>")
```
3. Specify colors. 
- Note that `ggsci::pal_npg("nrc")(9)` function pick up `9` colors from 'npg' palette. [`ggsci`](https://cran.r-project.org/web/packages/ggsci/vignettes/ggsci.html){:target="_blank"} package includes color palletes used in prominent science journals such as 'npg (Nature)', 'AAAS (Science)', NEJM, JAMA, etc. I love those palettes!
```r
bg_col <- "#eeeeee"
text_col <- "grey10"
major_grid_col <- "#bebebe"
minor_grid_col <- "#d6d6d6"
cols_vec_ly <- pal_npg("nrc")(9)
```


# Plotting with {plotly}

1. Plotly object `plot_ly()` was created, creating the first line plot for "Oil & NGL" commodity.
- A template for hovertext and its style was specified.
- Note that the first element of `cols_vec_ly` was used to specify the color of the first line plot. The following lines will have their colors just as the first one.
- Additional plotly layers can be added by passing the preceding object to next plotly function using the pipe operator (`%>%` or `|>`).
- For more detailed instructions and examples about drawing line plot using Plotly, see [Plotly - 'Line Plots in R'](https://plotly.com/r/line-charts/). <br>
```r
total_e_ly <- plot_ly(data = total_emissions_ly,
        type = "scatter", mode = "lines",
        x = ~year, y = ~`Oil & NGL`, name = "Oil & NGL",
        line = list(color = cols_vec_ly[[1]], width = 2),
        hovertemplate = paste("<b>Year: </b>%{x}",
                              "<br><b>Emission: </b>%{y:,.1f}"),
        hoverlabel = list(bgcolor = "black",
                          bordercolor = "transparent",
                          font = list(family = "oswald",
                                      size = 15,
                                      color = "white"
                          ),
                          align= "left")
        ) |> 
```

2. The function `add_trace()` was called to add following lines for each commodity. 
- The tilde (`~`) makes the subsequent object to be searched within the dataframe specified in `data` parameter. That is, `~Bituminous Coal` refer to the corresponding columns in the tibble `total_emissions_ly`.  <br>
```r
  add_trace(y = ~`Bituminous Coal`, name = "Bituminous Coal",
            line = list(color = cols_vec_ly[[2]], width = 2)) |>
  add_trace(y = ~`Natural Gas`, name = "Natural Gas",
            line = list(color = cols_vec_ly[[3]], width = 2)) |> 
  add_trace(y = ~`Metallurgical Coal`, name = "Metallurgical Coal",
            line = list(color = cols_vec_ly[[4]], width = 2)) |> 
  add_trace(y = ~`Sub-Bituminous Coal`, name = "Sub-Bituminous Coal",
            line = list(color = cols_vec_ly[[5]], width = 2)) |> 
  add_trace(y = ~`Anthracite Coal`, name = "Anthracite Coal",
            line = list(color = cols_vec_ly[[6]], width = 2)) |> 
  add_trace(y = ~`Cement`, name = "Cement",
            line = list(color = cols_vec_ly[[7]], width = 2)) |> 
  add_trace(y = ~`Thermal Coal`, name = "Thermal Coal",
            line = list(color = cols_vec_ly[[8]], width = 2)) |> 
  add_trace(y = ~`Lignite Coal`, name = "Lignite Coal",
            line = list(color = cols_vec_ly[[9]], width = 2)) |> 
  ```

3. The `config()` function was used to control the systemic part of the plot. `scrollZoom = TRUE` makes the plot zoomed in or zoomed out by scrolling a mouse wheel. `responsive = TRUE` makes the plot resposive to the size of the windows that the plot was shown.<br>
```r 
config(scrollZoom = TRUE,
      responsive = TRUE) |> 
```

4. Miscellaneous layout properties were specified using `layout()` function.
- Global font was specified by `font` parameter.
- Background colors were specified by `plot_bgcolor` and `paper_bgcolor` parameter.
- The title, xaxis, yaxis and legend of the plot was added and modified.
- The properties of the x-axis and the y-axis were defined by `xaxis` and `yaxis` parameter, respectively. 
- Here, you don't need to use `<span>` element to control the size of texts, but include `font = list(size = size_of_text)` in the relevant position, just as below script. It seems that `span` element override the `font = list(size = xx)` parameter. Note that I used `span` element to make texts responsive to window size using `vw` or `vh` units, which ended up not successful.<br>
```r
layout(font = list(family = main_font,
                     color = text_col),
         plot_bgcolor = bg_col, # plot area
         paper_bgcolor = bg_col, # outside plot area
         title = list(text = "<span style='font-size:40px;'><b>Global CO2 Emission by Commodities</b></span>",
                      xanchor = "center", yanchor = "top",
                      font = list(size = 20), y = 0.95
                      ),
         xaxis = list(title = list(text = "<span style='font-size:20px;'><b>Year</b></span>"),
                      ticks = "outside",
                      dtick = 25,
                      font = list(size = 18)
                      ),
         yaxis = list(title = list(text = "<span style='font-size:20px;'><b>Total CO2 Emissions</b> (MtCO2e)</span>"),
                      font = list(size = 18)
                      ),
         legend = list(title = list(text = "<b>Commodities</b>",
                                    align = "center",
                                    font = list(size = 20)),
                       font = list(size = 17), y = 0.85
                       )
                       )
```

5. The `total_e_ly` object was saved as a html file with the `htmlwidgets::saveWidget()` function.
```r
htmlwidgets::saveWidget(total_e_ly, file = "total_e_ly_post.html")
```

# Add Font Dependency
If you are to embed Plotly HTML to other webpage, you need to add CSS snippet to your Plotly object to specify font style. I dealt with it in [the previous post]({% post_url 2024-02-28-Feb-29-int %}#add-font-dependency).

1. Load and create CSS snippet for the font.
```r
## Fonts & Colors ---------------------------------------------------
font_add_google(name = "Oswald", family = "oswald")
showtext_auto()
main_font <- "oswald"
# Font dependency for plotly
oswald_file <- showtextdb::google_fonts("Oswald")$regular_url 
font_css <- paste0(
  "<style type = 'text/css'>",
  "@font-face { ",
  "font-family: 'oswald'; ", 
  "src: url('", oswald_file, "'); ", 
  "}",
  "</style>")
```
2. Incorporate the CSS snippet to your Plotly object as the following script. [`htmltools::htmlDependency()`](https://rstudio.github.io/htmltools/reference/htmlDependency.html){:target="_blank"} function is used to add HTML dependencies like CSS.
```r
event_plotly$dependencies <- c(
  event_plotly$dependencies,
  list(
    htmltools::htmlDependency(
      name = "oswald",
      version = "0",  
      src = "",
      head = font_css 
    )
  )
)
```
This ensures that your plot displays the designated font, regardless of where it is viewed. 

# Embed Responsive Plotly Visualizations
Building upon the [the previous method for embedding Plotly visualization]({% post_url 2024-02-28-Feb-29-int %}#embed-plotly-to-jekyll-blog), we can enhance it with CSS to create a responsive design. This allows you to integrate Plotly HTML into any website, ensuring the visualization adapts seamlessly to different window sizes. From what I've learned, responsiveness is one of the key principles in web design. With people using a wide variety of devices with different screen sizes, it's crucial to ensure that content looks good and functions well regardless of what device people use. This is particularly important for data visualizations, which need to deliver its content clearly across all platforms.
 ~~Although I failed to make text and title in the plot responsive...~~ <br>
```html
<div class = "container">
<iframe class="responsive-iframe" src="/files/interactive_page/total_e_ly_post.html" style="border:none"></iframe>
</div>
```

Note that the iframe element is included in `div` with class `"container"`, and the iframe has class `"responsive-iframe"`. We can then style those elements with CSS! This works for any iframe element.<br>

```css
.container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

/* Then style the iframe to fit in the container div with full height and width */
.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
```

This ensures that the iframe maintains a 16:9 ratio and fill its container.

- For more information on responsive iframe, see:<br> [w3schools - 'How TO - Responsive Iframe'](https://www.w3schools.com/howto/howto_css_responsive_iframes.asp)
- Regarding `padding-top`, see:<br>[MDN Web Docs - CSS Reference - 'padding-top'](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)



Without these resources, this section would not exist.