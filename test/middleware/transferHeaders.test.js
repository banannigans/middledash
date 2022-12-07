const express = require('express');
const request = require('supertest');
const { transferHeaders } = require('../../src/middleware/transferHeaders');

describe('transferHeaders test', () => {
  let app;

  beforeAll(() => {
    app = express();
  });

  it('should transfer specified individual header', async () => {
    expect.assertions(2);

    const headerTransferrer = transferHeaders({ requiredHeaders: ['foo1, foo2'] });

    app.use(headerTransferrer);
    app.get('/', (req, res, next) => {
      res.sendStatus(200);
    });

    const result = await request(app)
      .get('/')
      .set('foo1', 'bar1')
      .set('foo2', 'bar2');

    expect(result.res.headers.foo1).toEqual('bar1');
    expect(result.res.headers.foo2).toEqual('bar2');
  });

  it('should call next if given a header not in request headers ', async () => {
    expect.assertions(1);

    const headerTransferrer = transferHeaders({ requiredHeaders: ['foo3'] });

    app.use(headerTransferrer);
    app.use((err, req, res, next) => {
      res.sendStatus(400);
    });
    
    app.get('/', (req, res, next) => {
      res.sendStatus(200);
    });

    const result = await request(app).get('/');

    expect(result.res.statusCode).toEqual(400);
  });

  it('should mask error', async () => {
    expect.assertions(1);

    const headerTransferrer = transferHeaders({ requiredHeaders: ['foo3'] });

    app.use(headerTransferrer);
    app.use((err, req, res, next) => {
      res.sendStatus(400);
    });
    app.get('/', (req, res, next) => {
      res.sendStatus(200);
    });

    const result = await request(app).get('/');

    expect(result.res.statusCode).toEqual(400);
  });
});
