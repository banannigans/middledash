const express = require('express');
const request = require('supertest');
const { transferHeaders } = require('../../src/middleware/transferHeaders');

describe('transferHeaders test', () => {
  test('should transfer specified individual header', async () => {
    expect.assertions(3);
    const app = express();

    app.use(transferHeaders({ requiredHeaders: 'foo1, foo2' }));

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
  test('dummy', async () => {
    expect.assertions(1);
    const app = express();
    app.get('/foo', (req, res) => {
      res.sendStatus(403);
    });

    await request(app)
      .get('/foo')
      .then(response => {
        expect(response.statusCode).toEqual(403);
      });
  });

  it('should call next with masked error', async () => {
    expect.assertions(1);

    const app = express();

    app
      .use(transferHeaders({ requiredHeaders: 'foo3', optionalHeaders: '' }))
      .use((err, req, res, next) => {
        res.status(err.status).send(err.message);
      })
      .get('/', (req, res, next) => {
        res.sendStatus(200);
      });

    const result = await request(app).get('/');

    expect(result.statusCode).toEqual(400);
    expect(result.body).toMatch(/Bad Request/);
  });

  it('should not mask missing header', async () => {
    expect.assertions(1);
    const app = express();

    app
      .use(
        transferHeaders({
          requiredHeaders: 'foo3',
          hideMissingHeader: false,
        })
      )
      .use((err, req, res, next) => {
        res.status(err.status).send(err.message);
      })
      .get('/', (req, res, next) => {
        res.sendStatus(200);
      });

    const result = await request(app).get('/');

    expect(result.res.statusCode).toEqual(400);
    expect(result.body).toMatch(/header \w is undefined/);
  });
});
