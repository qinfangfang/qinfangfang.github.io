// 获取Html输出内容
export const getHtml = (html = '') => {
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

