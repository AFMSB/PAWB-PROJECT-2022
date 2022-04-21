# PAW PROJECT 2022

## GoLang - Backend

**Useful Commands:**
#### `cd APIGOLANGMAP`
#### `docker-compose up`

Default URL: [http://localhost:8081/api/v1/](http://localhost:8081/api/v1/)

## React JS - Frontend

**Useful Commands:**

#### `cd react-project`
#### `npm install`
#### `npm run build`
#### `npm start`

**Set Default Variables:**

#### `cd react-project/src/index.js`
#### `BASE_URL = "http://localhost:3000/api/v1";`
###
#### `cd react-project/src/setupProxy.js`
    app.use("/api/v1/", // General Routes URL
        createProxyMiddleware({
            target: "http://localhost:8081", // API URL
            changeOrigin: true,
        })
    );

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.