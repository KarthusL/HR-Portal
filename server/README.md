# HR-Project-Server

This part was finished by Zhenhao and Yifu.

Zhenhao is responsible for building email.js services and implementing HR-related API, authorization API, and middleware.

Yifu is responsible for building database and s3 services and implementing regular employee-related API and shared API, which can be used for HR and regular employees.

## 　 Development Version

### 1.1 　 Install [Node.js](https://nodejs.org/en)

### 1.2 　 Install dependencies

```sh
cd server
npm i
```

### 1.3 　 Run the server

To start the server

```sh
npm run server
```

To stop the server

```sh
CTRL C
```

To test the server API via [Postman](https://www.postman.com/):

1. Go to Postman » Import » Upload Files
2. Upload the file `HR-Project.postman_collection.json` in the project directory
