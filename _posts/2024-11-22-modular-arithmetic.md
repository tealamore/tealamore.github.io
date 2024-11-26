---
layout: series
series: solovay-strassen
title: Modular Arithmetic
excerpt:
cover-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
share-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
tags: [primes, algorithms]
---

This will be a super short post, but I just want to cover a couple core concepts to make sure we're all on the same page.

## Mod

Starting off, what is mod or as this post is called, modular arithmetic?

Think about mod like a circle. After you reach the end, you wrap back to the start. For example, a minute after 1:59 isn't 1:60, it's 2:00. It wrapped around.

Modular arithmetic is the mathematical field based around this concept. Also mod is an operator used to force these values to wrap around, or put more simply, it finds the remainder when divided by the modulus.

An example being $$1009\ (mod\ 10) = 9$$ because the remainder of $$1009/10$$ is $$9$$.

## Congruence

You'll see in a lot of posts that I'll write $$a\equiv b\ (mod\ n)$$. That triple equal sign, not the javascript one, is called congruence and it means, $$a$$ and $$b$$ have the same remainder when divided by $$n$$.

## Negative mods

I avoid using this notation in this series because it can be a little confusing if you're not used to it. However let's say you see someone say $$-1\ (mod\ 8)$$, what does that mean? The negative remainder?

Going back to clocks, when someone says it's 10 til noon, they're really saying -10 from noon or 11:50. Since the minutes wrap around at 60 (aka minutes are mod 60), we could say that 11:50 is congruent to -10 from noon or mathematically, $$50\equiv -10\ (mod\ 60)$$
