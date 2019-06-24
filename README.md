# middledash

Middledash is a library of convenience ExpressJS middleware functions.

## Table of Contents
- [Setup](#Setup)
- [Middleware](#Middleware)
  - [transferHeaders](#transferHeaders)

## Setup
To use `middledash`, run the following command in your project's root directory:

```
npm install middledash
```

## Middleware
The following middleware is provided by middledash:

### transferHeaders
`transferHeaders` accepts an arbitrary number of header names and transfers those respective headers from the request object to the response object. In case of a missing header, middledash calls `next` with HTTP code `400`.

```
// Example
app.use(transferHeaders('x-correlation-id')); // single header
app.use(transferHeaders('foo1', 'foo2', 'foo3'));     // arbitrary number of headers
```