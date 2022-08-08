import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.listen(3002, () => {
  console.log('listen>>>>>>3002');
});


// 允许跨域
app.all('*', function (req, res, next) {
  console.log(req.headers.origin)
  console.log(req.environ)
  // res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Powered-By", ' 3.2.1')
  if (req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/name', function (req, res) {
  res.send('POST request to homepage')
});

app.get('/getData', (req, res) => {
  const pathName = path.resolve() + '/server/data.txt';

  fs.readFile(pathName, 'utf-8', (err, dataStr) => {
    res.status(200).send(dataStr);
  })
})

app.post('/saveFormData', function (req, res) {
  console.log('req>>>>', req.body);
  const query = req.body;
  const pathName = path.resolve() + '/server/data.txt';

  fs.readFile(pathName, 'utf-8', (err, dataStr) => {
    if (err) {
      console.log(`读取失败>>>>>>${err.message}`);
    } else {
      console.log(`读取成功>>>>>>`, dataStr);
      fs.writeFile(pathName, `${dataStr}  ${JSON.stringify(query)}`, (err) => {
        if (err) {
          console.log(`写入失败`);
          res.status(502).send({
            message: 'fail'
          });
        } else {
          console.log(`写入成功`);
          res.status(200).send({
            message: 'success'
          });
        }
      })
    }
  });
});