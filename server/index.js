import express from 'express';
import fs from 'fs';
import path from 'path';
import xlsx from 'node-xlsx';
import dayjs from 'dayjs';

// 获取Html输出内容
const getHtml = (html = '') => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + Vue + TS</title>
        <style>
          .user-info-xlsx {
            max-width: 1200px;
            margin: 0 auto;
          }
          .user-info-xlsx .user-info-list .user-info-item {
            display: flex;
            align-items: center;
            min-height: 40px;
            color: #666;
            font-size: 12px;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;
            margin-top: -1px;
            padding: 10px 0;
          }
          .user-info-xlsx .user-info-list .user-info-item:nth-child(odd) {
            background-color: #f5f5f5;
          }

          .user-info-xlsx .user-info-list .user-info-item:first-child {
            font-size: 14px;
            color: #333;
            font-weight: bold;
            background-color: #f1f1f1;
          }

          .user-info-item .table-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            min-height: 40px;
            box-sizing: border-box;
            flex-wrap: wrap;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
    `
}

const app = express();
app.listen(3002, () => {
  console.log('listen>>>>>>3002');
});

const basePath = path.resolve();
const commonPath = '/server/userInfo.xlsx';


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
  const pathName = `${basePath}${commonPath}`;
  let list = xlsx.parse(pathName);
  let html = '<div class="user-info-xlsx"><div class="user-info-list">';
  if (list[0] && list[0].data && list[0].data.length) {
    const _data = list[0].data;
    _data.forEach((item) => {
      html += "<div class='user-info-item'>";
      (item || []).forEach((ele) => {
        html += `<div class="table-cell">${ele}</div>`;
      })
      html += '</div>';
    })
  }
  html += '</div></div>';
  res.status(200).send(getHtml(html));
})



// 表头
const TableHead = ['Name', 'Email', 'Your Country', 'Phone No', 'Message', 'CreateTime'];
const sheetOptions = { 'cols': [{ wch: 6 }, { wch: 7 }, { wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 40 }] };
const defaultData = ['qinfangfang', 'qinfangfang33@163.com', 'China', '18516578372', '用户留言', dayjs().format('YYYY-MM-DD HH:mm:ss')];

// 保存用户提交信息
export const saveUserInfo = (data = defaultData) => {
  // console.log('data>>>>>>', data);
  const pathName = `${basePath}${commonPath}`;
  let list = xlsx.parse(pathName);

  // console.log('list>>>>>', list, JSON.stringify(list[0].data));

  if (list && list[0] && list[0].data && list[0].data.length) {
    list = [...list[0].data, data];
  } else {
    list = [TableHead, data];
  }

  const NewData = [
    {
      name: '用户信息存储',
      data: list
    }
  ]
  fs.writeFileSync(pathName, xlsx.build(NewData), "binary");
}


// 处理提交的参数
const handleParmas = (params) => {
  if (!params) return [];
  let data = [];
  try {
    data = Object.values(params);
  } catch (error) {
    console.log('error>>>>>>', error);
  }
  return data;
}

app.post('/saveFormData', function (req, res) {
  // console.log('req>>>>', req.body);
  const query = req.body;
  if (!query.nowTime) {
    query.nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  }
  const params = handleParmas(query);

  saveUserInfo(params);

  res.status(200).send({
    message: 'success'
  });
  return;


  const pathName = basePath + '/server/data.txt';
  fs.readFileSync(pathName, 'utf-8', (err, dataStr) => {
    if (err) {
      console.log(`读取失败>>>>>>${err.message}`);
    } else {
      console.log(`读取成功>>>>>>`, dataStr);
      fs.writeFileSync(pathName, `${dataStr}  ${JSON.stringify(query)}`, (err) => {
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

// saveUserInfo();