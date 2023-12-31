---
layout: post
title: SQL Non-Clustered Indexing
excerpt: What is an index in SQL and what questions should we ask before deciding to use one?
cover-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
share-img: /assets/img/veeterzy-sMQiL_2v4vs-unsplash.jpg
tags: [sql]
---

## What is an index?

Creating an index for a table communicates to the SQL engine that a particular column is something that may be queried on and thus it should prepare by setting up an optimization for those queries. To do this, the SQL engine will create a data structure which will aid in making reads for that column significantly faster. Now give me a second and I'll explain how that works. 

Just a heads up, for this article, we're primarily discussing non-clustered indexes, which can behave differently to that of clustered indexes.

## Why is this even a thing?

Let's say you're a mail person. Your job is to take a stack of letters and get them to their final destinations. A letter normally contains information like the building number, street, city, etc. This information helps you decide both if it's even your job to deliver that letter (aka if the letter is supposed to go to another city) and to help you optimize a strategy for delivery. 

Ok, now we understand how mail works, but what does that have to do with databases?

Now imagine you're tasked with delivering letters, but they don't have addresses on them and instead just have the recipient's name. Well that makes delivery so much more complex. Even if you know that that person does live in your city, you will have to go door-to-door asking if that person lives at each house until you find the intended recipient.

Do you see how inefficient this is? It could take you days to deliver just one single letter. 

Indexes are basically like home addresses. They make it easier on the database to find what we're looking for. Without using an index, the database will do what's called a sequential or full table scan, which involves looking at each row until it finds the one you're looking for. 

However, when using an index, the database constructs an object that decreases the amount of rows that are needed to be looked at to find the desired row. 

So in short, indexing makes it easier and quicker to find data. 

## So how does this work?

So while there are many types of index strategies we could use ([see more here](https://www.postgresql.org/docs/10/indexes-types.html)), I want to just discuss the most commonly used strategy, which is a [B-tree](https://www.geeksforgeeks.org/introduction-of-b-tree-2/). 

The SQL engine when told about an index will construct a B-tree where the nodes are the values of the specified column (yes i know indexes can span multiple columns, but that makes diagrams more complex). Since a B-tree is a binary search tree, we get the benefit that lookups are significantly faster.

For example, imagine our table has 1,000,000,000 entries in it. The worst case query without an index, we'd have to look at all 1,000,000,000 rows. However with the B-tree assisting us, we would instead have to look at a maximum of 30 rows. 

Impressive, right?

## But what are the cons?

This is always an important question to ask when discussing any technology or strategy. I showed above that it can make our queries significantly faster, so why don't databases automatically create an index for every permutation of all of the columns so any query you could perform would be extremely fast?

So here's the thing, whenever an update is made to any column in an index (aka insert, update, or delete), the entire index has to update which slows down that write. Now sure, the dbs have some nifty optimizations under the hood, but it still takes time to rebalance a tree with 1,000,000,000 nodes. So if your table is dealing with a lot of writes, you really need to consider if indexing is right (pun intended) for you. 

Beyond that, indexes can take up a lot of disk space. The values of the columns in the index have to all be copied over to the b-tree and thus we have to duplicate the data. There are cases where the index actually takes up more space than the data itself. 

In short, indexes are extremely powerful, but should only really be used for tables that have significantly more reads than writes and also indexes should only be created when there's an actual explicit need as opposed to being a premature optimization. 
