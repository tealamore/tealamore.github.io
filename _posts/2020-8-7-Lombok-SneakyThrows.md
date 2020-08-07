---
layout: post
title: Lombok's @SneakyThrows - When and why it should be used
excerpt: Let's discuss how to use checked exceptions, when checked exceptions get in the way of us working, and how we can utilize Lombok's @SneakyThrows to handle checked exceptions.
---

`@SneakyThrows` is a nifty annotation created by the folks working on Lombok. Using this annotation enables us to throw a checked exception without forcing the caller to catch that exception. 

## What's the point? 

In Java when throwing a checked exception, the caller of the method must catch any and all checked exceptions thrown from that method. However, the JVM itself doesn't actually care. In the eyes of the JVM, an exception is an exception and exceptions can be thrown or caught at anytime. 

In this example, we have a method called `readFile()`. For this example this method always throws an `IOException`, which is a checked exception.

```java
public File readFile() throws IOException {
    throw new IOException();
}
```

This shows the before and after of integrating `@SneakyThrows` into our call to `readFile()`

```java
public void doSomething() {
    try {
        readFile();
    } catch (IOException e) {
        e.printStackTrace();
    }
}

@SneakyThrows
public void doSomething() {
    readFile();
}
```

## How does it work under the hood?

Java 8 introduced a new rule related to type inferences. When a function says that it `throws E`, the type `E` is inferred to be a `RuntimeException`. `@SneakyThrows` uses this. Their code looks similar to something like 

```java
public RuntimeException sneakyThrow(Throwable t) {
    this.sneakyThrowInner(t);
}

private <T extends Throwable> T sneakyThrowInner(Throwable t) throws T {
    throw (T) t;
}
```

## When should you Try using this? 

If you read many articles about `@SneakyThrows`, they'll probably talk about the brokenness of checked exceptions. I, personally, don't think the issue with checked exceptions is purely black and white. 

From a UX perspective, I feel it's beneficial to make sure the users of your library are aware of the exceptions that could be thrown that we, the library writers, believe they, the library users, could potentially recover from. Now you could argue that we should throw unchecked exceptions and just document what could be thrown, but, for real, who actually reads the docs? 

Nevertheless. Now that we've got that out of the way and seen that checked exceptions might not be pure evil, let's continue to discuss why we'd use `@SneakyThrows`.

In my opinion, there's really only one case where a `@SneakyThrows` should be used, but do remember that all rules have exceptions (puns). 

1. Using an interface that doesn't allow throwing exceptions.

Let's define a `Processor` interface that has a function `process`

```java
public interface Processor {
    void process();
}
```

and a `FileProcessor` class. This is how we'd handle the checked exception without a `@SneakyThrows`

```java 
public class FileProcessor implements Processor {
    @Override
    public void process() {
        try {
            doesSomething();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void doesSomething() throws IOException {
        new File("").getCanonicalPath();
    }
}
```

and this is how we'd handle it with a `@SneakyThrows`

```java 
public class FileProcessor implements Processor {
    @Override
    @SneakyThrows
    public void process() {
        doesSomething();
    }

    private void doesSomething() throws IOException {
        new File("").getCanonicalPath();
    }
}
```

It is quite a bit cleaner that way and as we'll cover later on, using the `@SneakyThrows` would allow us to catch the `IOException` elsewhere in our service. 

## So what's the Catch?

Because of how java works, we cannot have a catch block that catches a checked exception that isn't thrown by the method we're calling. 

For example, if we do

```java
@SneakyThrows
public File readFileButSneakilyThrow() {
    throw new IOException();
}


public void doSomething() {
    try {
        something();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

We get the error

```text
Exception 'java.io.IOException' is never thrown in the corresponding try block
```

This is a problem because unless you're comfortable having an exception bubble all the way up to whoever called your application, you will need to catch that exception and handle it in some way, even if that handling is just returning a 500 and calling it a day. But if we're using `@SneakyThrows` for a checked exception, we can't directly catch the checked exception except in something like a Global Exception Handler.

However, we can indirectly catch a sneakily thrown checked exception, if we catch `Exception` or `Throwable`. 

```java
@SneakyThrows
public File readFileButSneakilyThrow() {
    throw new IOException();
}

public void doSomething() {
    try {
        readFileButSneakilyThrow();
    } catch (Exception e) {
        if (e instanceof IOException) {
            handleIOException();
        }
    }
}
```

Do note that Intellij got real mad and said it was impossible for `e` to be of type `IOException`, so you'll always have to deal with those warnings yelling at you if you do it this way.

---

Also, if we want to write some tests that cover our logic handling a sneakily thrown exception, we'd have to do a slightly more roundabout process to mock the response of our mocked object. When using `when().thenThrow()` from Mockito, the only checked exceptions we can throw are ones that are explicitly listed as being thrown by the method. 

```java
@Test
public void mockThrowSneakilyThrownCheckedException() {
    when(fileProcessor.process()).thenThrow(new IOException());
}
```

fails with the error

```text
org.mockito.exceptions.base.MockitoException: 
Checked exception is invalid for this method!
Invalid: java.io.IOException
```

To get around this, we need to use Mockito's `when().thenAnswer()`

```java 
@Test
public void mockThrowSneakilyThrownCheckedException() {
    when(fileProcessor.process()).thenAnswer(invocation -> new IOException());
}
```

## Finally

So as we've now seen, we can trick java into letting us treat checked exceptions like unchecked ones, but like with all powerful things, we need to be cautious how we use them.
