---
layout: regex
title: Let's get sticky with it
headsup: Just so you know, clicking underlined text will display more information 
---

We're back for round two of regular expressions in javascript. If you haven't see my post already about unicode mixed with regular expressions, [you should check it out](https://bradarv90.github.io/ES6-Regex-Unicode/). I thought it was really interesting, but I guess you don't have to like it if you really don't want to. In this post, we'll be discussing the sticky flag (y), which was also introduced in ES6.

### How it works

Unlike other regular expressions, ones with the sticky flag check only at one specific spot. For example,

```javascript
const regex = /a/;
const stickyRegex = /a/y;

'ba'.match(regex); // -> [ 'a', index: 1, input: 'ba' ]
'ba'.match(stickyRegex); // -> null
```

In order for a sticky regex to match, the pattern must start at the position of `stickyRegex.lastIndex`. To repeat off the previous example and show a success case, we can do this:

```javascript
const regex = /a/;
const stickyRegex = /a/y;

'ba'.match(regex); // -> [ 'a', index: 1, input: 'ba' ]
stickyRegex.lastIndex = 1;
'ba'.match(stickyRegex); // -> [ 'a', index: 1, input: 'ba' ]
```

#### Edge case(s)

With sticky regexes, there are some catches that you must be aware of. Other blogs say these cases are obvious, but frankly I didn't expect it. A sticky regex with a `^` will always fail unless `lastIndex = 0` and the pattern starts at the beginning of the input string.

```javascript
const regex = /^a/y;
regex.lastIndex = 2;
'cba'.match(regex); // -> null
regex.lastIndex = 2;
'abc'.match(regex); // -> null
```

Using the multiline flag and the `^`, now the `lastIndex` must match the first character of a line and the pattern start there.

```javascript
const regex = /^a/my;
regex.lastIndex = 2;
'cba'.match(regex); // -> null
regex.lastIndex = 2;
'c\na'.match(regex); // -> [ 'a', index: 2, input: 'c\na' ]
```

Other than that, the sticky flag behaves in a fairly logical way.

### Example usage

This seems all fine and dandy, but why would anyone ever want to use this? It seems like a lot of headache for no real gain.

After doing lots of googling, I found that most people say it's good for building parsers. Now I couldn't find any examples and I am not an expert on parsers. However, I will attempt to write a little parser below. Forgive me if it's a bad implementation since this is not my forte.

```javascript
const testIfString = 'if a == 2: print(a)';
const testWhileString = 'while a == 2: print(a)';
const testStringFail = 'a == 2 if: print(a)';
const ifRegex = /if/y;
const whileRegex = /while/y;

const parseBranchingStatement = (testString, branchRegex) => {
  const boolRegex = /\s([^:]+):/y;
  const commandRegex = /\s(.+)$/y;

  testString.match(branchRegex);
  boolRegex.lastIndex = branchRegex.lastIndex;
  const boolMatch = testString.match(boolRegex);
  commandRegex.lastIndex = boolRegex.lastIndex;
  const commandMatch = testString.match(commandRegex);

  return commandMatch == null ? null : `bool: ${boolMatch[1]}, command: ${commandMatch[1]}`
};

parseBranchingStatement(testIfString, ifRegex); // -> 'bool: a == 2:, command: print(a)'
parseBranchingStatement(testWhileString, whileRegex); // -> 'bool: a == 2:, command: print(a)'

parseBranchingStatement(testStringFail, ifRegex); // -> null
```

Without using sticky flags, we could write something pretty much the same, but it would actually fail on certain cases

```javascript
const testIfString = 'if a == 2: print(a)';
const testWhileString = 'while a == 2: print(a)';
const testStringFail = 'a == 2 if: print(a)';

const ifRegex = /if/;
const whileRegex = /while/;

const parseBranchingStatement = (testString, branchRegex) => {
  const boolRegex = /\s([^:]+):/;
  const commandRegex = /\s(.+)$/;

  testString.match(branchRegex);
  const boolMatch = testString.match(boolRegex);
  const commandMatch = testString.match(commandRegex);

  return commandMatch == null ? null : `bool: ${boolMatch[1]}, command: ${commandMatch[1]}`
};

parseBranchingStatement(testIfString, ifRegex); // -> 'bool: a == 2, command: a == 2: print(a)'
parseBranchingStatement(testWhileString, whileRegex); // -> 'bool: a == 2, command: a == 2: print(a)'

parseBranchingStatement(testStringFail, ifRegex); // -> 'bool: == 2 if, command: == 2 if: print(a)'
```

So if you don't want to do things like

```javascript
const testIfString = 'if a == 2: print(a)';
const testWhileString = 'while a == 2: print(a)';
const testStringFail = 'a == 2 if: print(a)';

const ifRegex = /^if\s([^:]+):\s(.+)$/;
const whileRegex = /^while\s([^:]+):\s(.+)$/;

const ifResult = testIfString.match(ifRegex);
const whileResult = testWhileString.match(whileRegex);

console.log(`bool: ${ifResult[1]}, command: ${ifResult[2]}`); // -> bool: a == 2, command: print(a)
console.log(`bool: ${whileResult[1]}, command: ${whileResult[2]}`); // -> bool: a == 2, command: print(a)

testStringFail.match(ifRegex); // -> null
```

you should just use the sticky flag since it's much easier.

### Native solutions suck

Just like last time, let's discuss how we can build our own functionality, because reasons! To start off, let's really think about what the sticky flag provides us. As we've seen above, using the sticky flag, we attempt to match based strictly on where our lastIndex is set to. Here's another example of this:

```javascript
const regex = /bc/y;
regex.lastIndex = 4;
'abcabc'.match(regex); // -> [ 'bc', index: 4, input: 'abcabc' ]
```

A non-generalized way that sort of this same regex without using stickiness would be like this. I went ahead and did the extra bit of work to make the output the same as the sticky regex.

```javascript
const regex = /^....(bc)/;
var result = 'abcabc'.match(regex);
console.log(result); // -> [ 'abcabc', 'bc', index: 0, input: 'abcabc' ]
result.splice(0, 1);
result.index = 4;
console.log(result); // -> [ 'bc', index: 4, input: 'abcabc' ]
```

And now let's create a good-enough generalized solution:

```javascript
fakeSticky = (pattern, testString, flags='', pos=0) => {
    // for the example above,
    // this will build the pattern ^.{4}(bc)
    const newPattern = '^.{' + pos + '}(' + pattern.source + ')';
    const regex = new RegExp(newPattern, flags);
    const result = testString.match(regex);
    if (result !== null) {
        result.splice(0, 1);
        result.index = pos;
    }
    return result;
}
```

Here are some example usages:

```javascript
fakeSticky(/bc/, 'abcabc', '', 1) // -> [ 'bc', index: 1, input: 'abcabc' ]
fakeSticky(/bc/, 'abcabc', '', 3) // -> null
fakeSticky(/bc/, 'abcabc', '', 4) // -> [ 'bc', index: 4, input: 'abcabc' ]
```

I'm pretty sure there is at least one case where the above function doesn't behave properly, but I can't quite seem to find one. Also something I learned by trying to get it to fail:

```javascript
/^^a/.test('a') // -> true
/^.^a/.test('a') // -> false
```