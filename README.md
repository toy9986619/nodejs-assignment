# nodejs-assignment

使用 node.js + vue.js 製作的 TodoList 網頁

- 前端: vue.js
- 後端: express

## 環境需求

- node.js
- express 4
- vue.js 2.6
- bootstrap 4
- webpack 4
- babel 7
- dotenv

## 建置環境

 套件下載

```bash
npm install
```

於 [Google Developer Console](https://console.developers.google.com/) 申請 OAuth 2 Token

將 .env.example 複製一份，並更名為 .env file。填入 OAuth2 Client_ID 與 Secret，這兩個敏感資訊使用**dotenv** 套件進行載入

```bash
# .env file
CLIENT_ID={your-oath2-client-id}
CLIENT_SECRET={your-oath2-client-secret}
```

執行 express

```bash
npm start
# or
node index.js
```

## npm 指令

- dev: 開發時使用，先進行一次 webpack 打包後再執行 node index.js
- build: 單純 webpack 打包 js 檔案
- start: 等同 node index.js，運行 express 與 hot reload