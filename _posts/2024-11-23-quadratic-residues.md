---
layout: series
series: solovay-strassen
title: Quadratic Residues
excerpt: Why don't quadratic residues like to brag? Because they're too mod-est
cover-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
share-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
tags: [primes, algorithms]
---

Quadratic residues have lots of interesting uses across technology, but like with the rest of this series, we are just focusing on what it is and it's specific application to primality testing. 

## Definitions

The definition is, not so, simply that integer $$q$$ is congruent to a perfect square modulo $$n$$. Written out in more mathy ways, that's

$$x^2 \equiv q\ (mod\ n)$$

On the contrary though, if $$q$$ doesn't meet this condition, then it's considered a quadratic nonresidue.

## Less Definitionally 

Here's a naive approach to checking if $$q$$ is a quadratic residue or nonresidue of $$n$$.

```python
def is_residue(q, n):
    residues = set()
    for i in range(1, n): # aka iterating over the values 1 ... n-1
	    residues.add((i**2) % n)

    return q in residues
```

While this code does work, it has some issues. For one and this is just how I implemented it, whenever you want to check a new value of $$q$$, you have to recompute all the residues, which is just wasteful if you're going to be checking a lot of values.

But the bigger issue here, is that we're thinking about extremely large values of $$n$$. 

Let's think about just how much memory it would take to hold all these residues. Assuming we write this code super efficiently and use the least amount of bits possible to store each residue, they would have a size of between 1 to 1000 bits for a number $$n$$ on the order of $$2^{1000}$$ so assuming even distribution, that would be 500 bits per residue. And given that we can expect there to be $$\frac{n}{2}$$ unique residues for $$n$$, that means we should have $$2^{999}$$ distinct residues. In total, we can expect $$500*2^{999}$$ bits or $$3.3*10^{284}$$ exabytes for each value of $$n$$.

So yeah, this solution clearly won't work for large values, but I wonder if there's a better way.
