---
layout: series
series: solovay-strassen
title: Euler's Criterion
excerpt:
cover-img: /assets/img/sharon-pittaway-4_hFxTsmaO4-unsplash.jpg
share-img: /assets/img/sharon-pittaway-4_hFxTsmaO4-unsplash.jpg
tags: [primes, algorithms]
---

We're so close to being done. Once we get through this, we can revisit Solovay-Strassen and finally understand this.

## The Criterion

Euler's criterion shows that for every prime number $$p$$, the follow equation is true

$$
\left(\frac{q}{n}\right)\equiv q^{\frac{p-1}{2}}\ (mod\ p)
$$

I'm not going to get into actually proving this because Euler has already done it for us. We already know how to calculate $$\left(\frac{q}{n}\right)$$ and maybe one day I'll write about how we can efficiently calculate $$q^{\frac{p-1}{2}}\ (mod\ p)$$. If you don't want to wait for me, just look into modular exponentiation. Really interesting stuff

## What's the Catch

There is one catch to this. As I said, for every prime number, that equation is true, but sometimes a non-prime aka composite number will also satisfy that equation for some values of $$q$$ and these are called pseudoprimes.

How do we combat pseudoprimes?
