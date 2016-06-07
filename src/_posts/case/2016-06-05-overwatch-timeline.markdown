---
layout: post
category: case
title:  "Overwatch Timeline"
image: /assets/images/cases/case-overwatch-timeline.jpg
description: I made an interactive timeline based on the story of the game Overwatch.
---

[http://ricklancee.github.io/overwatch-timeline/](http://ricklancee.github.io/overwatch-timeline/)

<video autoplay="true" loop="true">
    <source src="{{ site.baseurl | prepend: site.url }}/assets/images/overwatch/timeline.mp4" type="video/mp4">
</video>

As an exercise i created an interactive time line about the story of the game [overwatch](http://playoverwatch.com). My goal here was to create a interactive experience at 60 frames per second in the browser. Using techniques like a [game loop](https://developer.mozilla.org/en-US/docs/Games/Anatomy) and [lerping](http://codepen.io/rachsmith/post/animation-tip-lerp) for the animations.

I managed to achieve my goal of 60 frame per second by using the performant css and javacript. The Javascript has only one purpose; to calculate numbers about where you currently are, and where you need to go. The only DOM interaction is setting a `transform` attribute on the container. Which results in smooth animations.   

The demo works great in Google Chrome but in other browsers not so much. In IE or Edge it doesn't work at all, and in firefox the scrolling is really slow. However it was not my intent to create a cross browser experience it would have been nice it worked across all major browsers. --- but it would have been nice.
