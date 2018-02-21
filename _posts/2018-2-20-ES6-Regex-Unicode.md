---
layout: post
title: ES6 + regex + unicode = 💕
description: This is a test
---

As part of ES6, regular expressions now have the u (unicode) flag. In the past week, I've been trying to understand what the whole purpose of this flag is for. I'm hoping that this post will be helpful to those who are struggling to understand unicode with javascript regular expressions. 

To avoid pasting in characters that can't easily be displayed, I'll only be using `\u` notation. Remember `\u` is different from the u-flag (`/u`). 

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




TODO: talk about Unicode code points/UTF-16 code units. Also UTF translates to 1 char, while unicode is 1-2 chars. Note that unicode is represented as 1-2 BMP characters and that `.` without /u just matches BMP characters

I was reading this article about the unicode flag for regex. The article says that without the u-flag, `.` only matches the BMP characters, which is all characters between \u{0} to \u{FFFF}.

In the article, it shows that /a.b/.test('a\u{1D306}b') returns false, while /a.b/u.test('a\u{1D306}b') returns true. However, both /a./ and /.b/ match 'a\u{1D306}b'. I don't really understand what the u-flag helps us do.

That's really interesting. So in the example they showed in the article /a.b/.test('a\u{1D306}b'), that failed because \u{1D306} is actually 2 characters/code units. When the regex is /a..b/, it returns true.

 
