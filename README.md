# middledash

Middledash is a library of convenience ExpressJS middleware functions.

## Table of Contents
- [Table of Contents](#Table-of-Contents)
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
`transferHeaders` accepts a header name and transfers that header from the request object to the response object:

```
app.use(transferHeaders('x-correlation-id'));
```

`transferHeaders` accepts an arbitrary number of arguments:
```
app.use(transferHeaders('foo', 'bar'));
```