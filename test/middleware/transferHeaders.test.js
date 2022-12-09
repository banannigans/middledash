const bodyParser = require('body-parser');
const express = require('express');
const request = require('supertest');
const { transferHeaders } = require('../../src/middleware/transferHeaders');

describe('transferHeaders test', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());
  });
  test('should transfer specified required and optional headers', async () => {
    expect.assertions(3);
    app.use(transferHeaders({ requiredHeaders: 'foo1', optionalHeaders: 'foo2' }));

    app.get('/test', (req, res) => {
      res.sendStatus(200);
    });

    await request(app)
      .get('/test')
      .set('foo1', 'bar1')
      .set('foo2', 'bar2')
      .then(response => {
        expect(response.statusCode).toStrictEqual(200);
        expect(response.headers.foo1).toMatch(/bar1/);
        expect(response.headers.foo2).toMatch(/bar2/);
      });
  });

  it('should call next with masked error', async () => {
    expect.assertions(2);

    app
      .use(transferHeaders({ requiredHeaders: 'foo3', optionalHeaders: '' }))
      .set('Accept', 'application/json')
      .get('/', (req, res, next) => {
        res.sendStatus(200);
      });

    const result = await request(app).get('/');

    expect(result.statusCode).toEqual(400);
    expect(result.text).toMatch(/Bad Request/);
  });

  it('should not mask missing required header', async () => {
    expect.assertions(2);

    app
      .use(
        transferHeaders({
          requiredHeaders: 'foo4',
          hideMissingHeader: false,
        })
      )
      .get('/', (req, res, next) => {
        res.sendStatus(200);
      });

    const result = await request(app)
      .get('/')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.text).toMatch(/header foo4 is undefined/);
    expect(result.res.statusCode).toEqual(400);
  });
  it('should not error on missing optional header', async () => {
    expect.assertions(3);

    app
      .use(
        transferHeaders({
          requiredHeaders: 'foo5',
          hideMissingHeader: false,
        })
      )
      .get('/', (req, res, next) => {
        res.sendStatus(200);
      });

    const result = await request(app)
      .get('/')
      .set('foo5', 'bar5')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.res.statusCode).toEqual(200);
    expect(result.headers.foo5).toEqual('bar5');
    expect(result.headers.foo6).toBe(undefined);
  });
  it('should throw when parsing headers with improper typing', async () => {
    expect.assertions(1);
    try {
      const middleware = transferHeaders({});
      middleware({
        headers: () => {
          throw Error('implementation');
        },
      });
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
  });
});
