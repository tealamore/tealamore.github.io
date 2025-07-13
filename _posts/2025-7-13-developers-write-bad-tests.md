---
layout: post
title: Developers Write Bad Unit Tests
headsup: Just so you know, clicking underlined text will display more information 
excerpt: All too often, developers will practice what I like to call DDT aka Development-driven testing — the inverse of TDD. I promise this won't be a TDD-advocacy post because frankly I can't handle getting that much hate today. 
cover-img: /assets/img/anna-mould-Zck1ap7muew-unsplash.jpg
share-img: /assets/img/anna-mould-Zck1ap7muew-unsplash.jpg
tags: [testing]
---

I'm aware this may be a controversial post. 

All too often, developers will practice what I like to call DDT aka Development-driven testing — the inverse of TDD. I promise this won't be a TDD-advocacy post because frankly I can't handle getting that much hate today. 

But DDT is the practice of writing code first and then writing your tests to match what you've already written. Since the popularization of LLMs, you'll often see developers copy and paste a function into ChatGPT and ask it to write comprehensive tests. And of course the LLM is so gracious that it'll just spit out tests that — hopefully — all pass and cover the various branch conditions.

Boom. Testing done. 

You push this code change out to prod and suddenly all sorts of errors are being thrown. Null pointer exception this, class cast exception that. Hell, maybe even [Little Bobby Tables](https://xkcd.com/327/) comes to visit.

How can this happen? You have 100% code coverage. Even better you've got 100% branch coverage. 

## How are tests and bugs related? 

What a trivial question. Of course more tests = less bugs, right? 

Well not right, actually. Here's the thing, if you write garbage tests that cover every line of code, that doesn't do anything. 

Not even joking, I've seen a test exactly like this 

```java
    @Test
    void testAdd() {
        try {
            Calculator calculator = new Calculator();
            calculator.add(5, 3);
        } catch (Exception e) {

        }

        assertTrue(true);
    }
```

The only thing this test does is verify the code compiles. It's not useful, but it does cover lines of code. 

Instead developers need to be thinking of how to break their code — or I guess instruct their LLM to think of how to break their code — and write those tests. 

## What makes a test a good test?

This is a good question — I know because, well, I just asked it. 

There's two ways we can analyze tests: statically and dynamically. 

Dynamic checks involve testing the tests themselves. While there are many great tools for that, I'm not going down that rabbit hole today. Read about mutation testing if you're curious. 

Statically though, that's the stuff we can all implement today. Here are some static checks that can help you spot if your tests are actually doing anything useful: 

1. <div class='expanderLink' onclick='expandoLink("githubTestPilot")'>calls the function-under-test (FUT)</div><div id='githubTestPilot' class='invisible'>Looking at you, <a href="https://arxiv.org/pdf/2302.06527" target="_blank" rel="noopener noreferrer">Github TestPilot Section 4.3</a></div>
2. fails if the FUT's behavior changes
3. avoids loose matchers as much as possible — like `any()` 
4. is deterministic. Meaning the tests don't rely on randomness or branching logic
5. doesn't duplicate business logic from production code
6. covers edge cases and error states

I will say #6 is the hardest part of this. This means we can no longer glance at a PR and say "LGTM". We, as PR reviewers, need to think about edge cases and make sure they're covered by tests. 

## So what do we do now?

Do we rewrite all of our tests today? No. You'll never hear me sign off on a rewrite. 

Instead we need a mindset shift as a team — not just when writing the code, but also when reviewing it. 

We can't view tests as a chore, but instead as a tool that increases confidence that our software, when released to prod, will be able to handle all the wacky things our customers do. 
