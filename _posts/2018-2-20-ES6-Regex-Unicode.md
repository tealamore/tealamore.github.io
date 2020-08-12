---
layout: post
title: ES6 + regex + unicode = 💕
headsup: Just so you know, clicking underlined text will display more information 
excerpt: Let's explore how to use the new unicode flag for regular expressions that was introduced in ES6 of javascript.
cover-img: /assets/img/unicode.jpg
share-img: /assets/img/unicode.jpg
tags: [javascript, ES6, regex]
---

As part of ES6, regular expressions now have the u (unicode) flag. In the past week, I've been trying to understand what the whole purpose of this flag is for. I'm hoping that this post will be helpful to those who are struggling to understand unicode with javascript regular expressions.

Let's play with regular expressions and see how the u-flag helps us:

```javascript
const string = 'a\u{21}a';

string; 
    // -> 'a!a'

/a.a/.test(string); 
    // -> true

/a.a/u.test(string); 
    // -> true
```

<div>
    You might have expected that we didn't really need the unicode flag here since
    <div class='expanderLink' onclick='expandoLink("unicodeHexExplanation")'>
        <code class='highlighter-rouge'>\u{21}</code>
        is an ascii character
        <code class='highlighter-rouge'>(!)</code>
    </div>
    as we saw in the print out from the second line. However, if you didn't guess that, that's also ok!
</div>

<div id='unicodeHexExplanation' class='invisible'>
    I've made this mistake numerous times where I look at the 21 in
    <code class='highlighter-rouge'>\u{21}</code>
    and assumed that would the 21st character. If you were to look at an ascii table, you'd see that 21 represents the negative acknowledge (don't ask me what that is). When you're reading these numbers, you need to remember that they're in hexadecimal.
    If you convert 21 from hexidecimal to decimal, you'll get 33, which is then <code class='highlighter-rouge'>(!)</code>.
    <br />
    <br />
    I actually almost posted on Stack Overflow to ask why
    <code class='highlighter-rouge'>\uFFFF</code>
    wasn't the same character as
    <code class='highlighter-rouge'>\u{65535}</code>.
    So if you make this mistake, just know that you're not alone.
</div>

Here's an example where we test against a non-ascii character:

```javascript
const string = 'a\u{1F495}a';

/a./.test(string); 
    // -> true

/a.a/.test(string); 
    // -> false

/a./u.test(string); 
    // -> true

/a.a/u.test(string); 
    // -> true
```

If you're anything like me, it is not obvious at all why the first test passed. It would make sense that that line fails. Yet it doesn't, so let's go a bit deeper and figure out what is going on here:

```javascript
const string = 'a\u{1F495}a';

/a(.)/.exec(string); 
    // -> [ 'a�', '�', index: 0, input: 'a💕a', groups: undefined ]

/a(.)/u.exec(string); 
    // -> [ 'a💕', '💕', index: 0, input: 'a💕a', groups: undefined ]
```

If those aren't displaying well for you, it's ok. They don't display well for me either. Let's see what our capturing groups grabbed:

```javascript
/a(.)/.exec(string)[1] === '\u{1F495}'; 
    // -> false

/a(.)/u.exec(string)[1] === '\u{1F495}'; 
    // -> true

/a(.)/.exec(string)[1] === '\u{1F495}'[0]; 
    // -> true
```

I'm choosing to save us both a ton of time and headache and just tell you what is happening here. In javascript depending on what unicode character you use, the character is represented as 1 or 2 characters between `\u{0}` and `\u{FFFF}`. Characters greater than `{FFFF}` are stored as two smaller characters in the range I just listed.

Given that bit of information, you might be able to see that the `.` with the u-flag is matching the whole unicode character, while the `.` without the u-flag is only matching the first of two characters that represents the unicode character.

If we wanted to still avoid the u-flag and only match when the character between the two a's has a value greater than `FFFF`, we could this (though I really recommend using the u-flag):

```javascript
/a(..)a/.exec(string)[1] === '\u{1F495}'; 
    // -> true
```

There are more things that the u-flag provides us, but this post hopefully helps in understanding some of the basics of the u-flag.
