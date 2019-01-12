const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const session = require('koa-session');
const app = new Koa();

app.keys = ['test12345'];

app.use(errorHandler());

function errorHandler() {
  return (async (ctx, next) => {
    try {
      await next();
    } catch(err) {
      console.log(err.message);
    }
  });
}

app.use(bodyParser({
  formLimit: '40b', 
}));

const port = process.argv[2] || 3000;
app.listen(port);

console.log(`Listening on port ${port}`);

/*
app.use((ctx, next) => {
  const start = Date.now();
  console.log(`start: ${start}`);
  return next().then(() => {
    const now = Date.now();
    console.log(`now: ${now}`);
    const ms = now - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
*/

app.use(async (ctx, next) => {
  console.log('alan1');
  const start = Date.now();
  await next();
  console.log('alan2');
  const now = Date.now();
  const ms = now - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  console.log(`type: ${ctx.request.type}`);
  console.log(`accepts: ${ctx.request.accepts('text/plain')}`);
  console.log(`path: ${ctx.request.path}`);
  console.log(`query: ${JSON.stringify(ctx.request.query)}`);
  console.log(`host: ${ctx.request.host}`);
  //ctx.response.body = 'hello world';
  console.log(ctx.request.rawBody);
  console.log(ctx.request.body);

  /*if (ctx.path === '/json') {
    ctx.response.body = {
      foo: 'bar',
    }
  } else if (ctx.path === '/stream') {
    console.log(process.argv[3]);
    ctx.response.body = fs.createReadStream(process.argv[3]);
  }*/

  /*if (ctx.request.is('application/json')) {
    ctx.response.body = ctx.request.body;
  } else if (ctx.request.is('application/x-www-form-urlencoded')) {
    ctx.response.body = ctx.request.rawBody;
  }*/

  /*ctx.response.type = 'application/json';

  if (ctx.response.is('application/json')) {
    console.log('is application/json');
    ctx.response.body = ctx.request.body;
  } else {
    console.log('is not application/json');
    ctx.response.body = ctx.request.rawBody;
  }*/

});

app.use(responseTime());
app.use(upperCase());

/*
app.use(async (ctx, next) => {
  ctx.response.body = 'hello koa';
  let views = parseInt(ctx.cookies.get('views', { signed: true }), 10) || 0;
  let expires = new Date(Date.now() + (1 * 60 * 60 * 1000));
  ctx.cookies.set('views', views + 1, { signed: true, expires: expires });
});
*/

app.use(session(app));
app.use(ctx => {
  if (ctx.path === '/favicon.ico') {
    console.log('favicon path');
    return;
  }

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
});

function responseTime() {
  return (async (ctx, next) => {
    const now = Date.now();
    await next();
    const elapsed = Date.now() - now;
    ctx.response.set('X-Response-Time', elapsed + 'ms');
  });
}

function upperCase() {
  return (async (ctx, next) => {
    await next();
    ctx.response.body = ctx.response.body.toUpperCase();
    //throw new Error("upperCase()");
  });
}

/*
app.use(async (ctx, next) => {
  console.log('alan3');
  const result = await next();
  console.log(result);
});

app.use(async (ctx, next) => {
  console.log('alan4');
  return "alan5";
});
*/
