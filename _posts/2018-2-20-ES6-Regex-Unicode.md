---
layout: post
title: ES6 + regex + unicode = 💕
description: This is a test
---

As part of ES6, regular expressions now have the u (unicode) flag. In the past week, I've been trying to understand what the whole purpose of this flag is for. I'm hoping that this post will be helpful to those who are struggling to understand unicode with javascript regular expressions. 

Let's start off with what exactly is unicode and how it works in javascript. TODO: 

Now that we have somewhat of a good understanding of unicode, let's play with regular expressions and see how the u-flag helps us:  

```javascript
const string = 'a\u{21}a';

console.log(string); // -> 'a!a'

console.log(/a.a/.test(string)); // -> true

console.log(/a.a/u.test(string)); // -> true
```

You might have expected that we didn't really need the unicode flag here since `\u{21}` is an ascii character (`!`) as we saw in the print out from the second line. However, if you didn't guess that, that's ok!

Here's an example where we test against a non-ascii character:

```javascript
const string = 'a\u{6F342}a';

console.log(/a./.test(string)); // -> true

console.log(/a.a/.test(string)); // -> false

console.log(/a./u.test(string)); // -> true

console.log(/a.a/u.test(string)); // -> true
``` 

If you're anything like me, it is not obvious at all why the first test worked. It would make sense that that line fails. Yet it doesn't, so let's go a bit deeper and figure out what is going on here:

```javascript
const string = 'a\u{6F342}a';

console.log(/a(.)/.exec(string)); // -> [ 'a�', '�', index: 0, input: 'a񯍂a' ]

console.log(/a(.)/u.exec(string)); // -> [ 'a񯍂', '񯍂', index: 0, input: 'a񯍂a' ]
```

If those aren't displaying well for you, it's ok. They don't display well for me either. Let's see what our capturing groups grabbed:

```javascript
console.log(/a(.)/.exec(string)[1] === '\u{6F342}'); // -> false

console.log(/a(.)/u.exec(string)[1] === '\u{6F342}'); // -> true

console.log(/a(.)/.exec(string)[1] === '\u{6F342}'[0]); // -> true
```

I hope you read the explanation of unicode above because it should help make this section easier to understand. 
Here's the short version: Depending on what unicode character you use, javascript represents that characters as 1 or 2 characters. 

Given that bit of information, you might be able to see that the `.` with the u-flag is matching the whole unicode character, while the `.` without the u-flag is only matching the first characters that represents the unicode character.

If we wanted to still avoid the u-flag, we could change our expression to this:

```javascript
console.log(/a(..)a/.exec(string)[1] === '\u{6F342}'); // -> true
```

There are more things that the u-flag provides us, but this post hopefully helps in understanding some of the basics of the u-flag. 


This is just a test to see how this renders:

```javascript
/a.a/gim
```