---
layout: series
series: solovay-strassen
title: Jacobi Symbol
excerpt:
cover-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
share-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
tags: [primes, algorithms]
---

As I hinted to with the previous post about quadratic residues, clearly there needs to be a better way than having a data center worth of storage for each value of $$n$$ to check if it's prime.

In this episode err post, we'll be discussing the Jacobi symbol and how it can make checking if $$q$$ is a quadratic residue of $$n$$ much easier.

## Mathematical Definitions

In this section, we're just covering definitions. There are a lot of them for this and frankly I'm not going to cover them all since they're not all super helpful for this problem.

To start off, this is what the Jacobi symbol looks like

$$\left(\frac{q}{n}\right)$$

but this is not division that we're looking at. This is simply saying what we covered in the previous post of is $$q$$ a quadratic residue of $$n$$.

Instead of returning true/false, it returns one of three values (think of it like a `compare` function):

$$
\left(\frac{q}{n}\right)=
\left\{
\begin{array}{ll}
      0 & q \equiv 0\ (mod\ p) \\
      1 & \text{q is a quadratic residue of n} \\
      -1 & \text{q is a quadratic nonresidue of n}
\end{array}
\right.
$$

## The Many Rules of Jacobi symbols

Now that we got that out of the way, let's discuss the rules of the Jacobi symbol.

$$\left(\frac{q_1}{n}\right)=\left(\frac{q_2}{n}\right)\ if\ q_1\equiv q_2\ (mod\ n)$$

which also means

$$\left(\frac{a}{b}\right)=\left(\frac{a\ (mod\ b)}{b}\right)$$

Also

$$\left(\frac{q_1q_2}{n}\right)=\left(\frac{q_1}{n}\right)\left(\frac{q_2}{n}\right)$$

Getting a tad closer to actual numbers and not just variables, when 2 is in the top position,

$$
\left(\frac{2}{n}\right)=
\left\{
\begin{array}{ll}
      1 & n \equiv 1,7\ (mod\ 8) \\
      -1 & n \equiv 3,5\ (mod\ 8) \\
\end{array}
\right.
$$

And the most important part aka the law of quadratic reciprocity. You know it's important when it's a law and not just a definition.

$$
\left(\frac{q}{n}\right)=
\left\{
\begin{array}{ll}
      -\left(\frac{n}{q}\right) & q\equiv n \equiv 3\ (mod\ 4) \\
      \left(\frac{n}{q}\right) & \text{otherwise}
\end{array}
\right.
$$

## A practice run

I know we're all just waiting to see the code, but I think we should do a practice example just to make sure we got it.

Let's compute the Jacobi symbol for $$\left(\frac{4783}{6113}\right)$$. Also just a note, whenever you see the two values switch place, that's the quadratic reciprocity coming into play.

$$
\left(\frac{4783}{6113}\right) = \left(\frac{6113}{4783}\right) = \left(\frac{6113\ (mod\ 4783)}{4783}\right) = \left(\frac{1330}{4783}\right) = \left(\frac{2}{4783}\right)\left(\frac{665}{4783}\right)
$$

Since $$4783\equiv 7\ (mod\ 8)$$, $$\left(\frac{2}{4783}\right)=1$$. Continuing on

$$
\left(\frac{665}{4783}\right)=\left(\frac{4783}{665}\right)=\left(\frac{4783\ (mod\ 665)}{665}\right)=\left(\frac{128}{665}\right)=\left(\frac{2}{665}\right)^7
$$

and since $$665\equiv 1 \ (mod\ 8)$$, $$\left(\frac{2}{665}\right)=1$$ and simply $$1^7=1$$

Thus $$\left(\frac{4783}{6113}\right)=1$$ aka 4783 is a quadratic residue of 6113.

Also just wanna call out, these were two random numbers I used. I didn't plan that.

## Code, still mathy just with less symbols

```python
def jacobi(q, n):
    if n % q == 0:
        # base case of when n is a multiple of q
        return 0

    result = 1

    while q > 0:
        # extract all the factors of 2 from q
        while q % 2 == 0:
            q = q // 2
            # applying the rule about (2/n)
            # we only care about the case of -1, since 1 have no impact on the result
            if n % 8 in [3,5]:
                result *= -1

        # quadratic reciprocity aka flipping the numbers and flipping the sign if needed
        if q < n:
            q, n = n, q
            if q % 4 == 3 and n % 4 == 3:
                result *= -1

        q = q % n

    return result
```

If we check `jacobi(4783, 6113)` we get $$1$$. So this code works. Hopefully the comments explain it well enough that you can see how those rules translate into the code.

Before you accuse me of cheating, I wrote the code after I did the practice problem.

We finally have an efficient way of calculating quadratic residues, but how does that play into testing if a number is prime?
