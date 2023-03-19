# Deno "Curry Cache" Library

A deno library by @codemonument which allows currying of a function to cache it's result. 
Has an interface to allow providing your own store!

## TODOs 

=> Integrate new ES Decorators into the lib! (Avaliable when Typescript 5.0 hits deno!)
Allow functions & methods to be annotatet with @CurryCache() to be able to add caching functionality more easily!

=> Add support for generator functions, like 
```ts
function* helloWorldGenerator() {
  yield "Hello World!";
  yield "Hello World 2!";
  yield "Hello World 3!";
}

const cachedHelloWorld = curryCache(helloWorldGenerator().next, {
  storageEngine,
  overrideCacheKeyFactory: (
    { inputFunctionName }: { inputFunctionName: string },
  ) => inputFunctionName,
});

  const res1 = cachedHelloWorld([]);
 // DOES NOT WORK CURRENTLY, cure to cachedHelloWorld not being able to call .next() on the generator internally!
```