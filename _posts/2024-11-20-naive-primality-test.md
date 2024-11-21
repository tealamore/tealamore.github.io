---
layout: post
title: Naive Primality Testing
excerpt: In cryptography, we use large probably prime numbers to encrypt traffic. But how do we know if a large number is prime?
cover-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
share-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
tags: [primes, algorithms]
---

In cryptography, we use probably prime numbers to encrypt traffic. There are definitely reasons why we do so, but this is not a blog post talking about why we use prime numbers.

I want to point out that I said **probably** prime numbers instead of just prime numbers and much much later on, you'll understand why.

Before we get into anything complicated, let's talk about some more naive or simplistic methods for determining if a number is prime. For all of these examples, we have picked a sufficiently large random number that we will call $$n$$, which we'll be testing to see if it's prime.

## Brute force

The brute force method involves us checking every integer from $$2$$ to $$n-1$$. Put simply

```python
def isPrime(n):
    for i in [2 ... n-1]:
        if n mod i == 0:
            return "composite"
    return "prime"
```

Look, does it work? Yes but only barely. When we're talking about a number that's 1000-digits long, this would take forever to finish.

## Brute force but slightly improved

Let's observe the number $$10$$. It's prime factorization is $$2*5$$. If we discover that $$2$$ evenly divides $$10$$, then there's no point trying to go up towards the $$5$$.

Put more generally, you can stop at $$\sqrt n$$ because any factor larger than $$\sqrt n$$ must pair with one smaller.

```python
def isPrime(n):
    for i in [2 ... sqrt(n)]:
        if n mod i == 0:
            return "composite"
    return "prime"
```

Again, this is faster, but truly not by much when we're talking about massive numbers.

## Other naive solutions

I don't feel the need to go into it, but there are other naive solutions like the [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes). These methods are great for prime factorization, but simply aren't useful enough for testing a massive number, like what we're concerned about.

---

The real issue with these strategies for determining if $$n$$ is prime is that we don't actually care what the prime factorization of $$n$$ is. We just want a quick "yes" or "no" to the question is $$n$$ prime. But with that comes trade-offs. Namely complexity and certainty. And in these next few posts, we're going to explore the complexity and levels of certainty
