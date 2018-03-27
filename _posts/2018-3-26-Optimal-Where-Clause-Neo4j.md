---
layout: neo4j
title: Optimal where clause in Neo4j
---

This should be a fairly short post but I’m hoping that by writing it down, I’ll stop googling this same question every time I’m reviewing a pull request that involves a neo4j query.

There are two ways to do a basic `WHERE` clause in Cypher:

```sql
SELECT (p:Person)
WHERE p.name="Brad"
RETURN p;

SELECT (p:Person {name: "Brad"})
RETURN p;
```

To me, it feels logical that the second query is more efficient than the first. I would think the first query would grab every Person, filter out everyone who’s name isn’t "Brad" and return what’s left.

Luckily, Cypher was wrote by some very smart people who made both queries have the same query plan and thus are equally efficient.