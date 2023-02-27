# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/YuliyaShu/nodejs2022Q4-service.git
```

```
git switch dev-docker
```

## Installing NPM modules

```
npm install
```

**Make copy of .env.example file and rename it to .env**


## Running application without Docker

```
npm run start
```

## Running application with Docker


- Download, install and run docker


- Start application

```
npm run start:docker
```

- Make prisma migrations with two scripts in new terminal (go inside the app and start migration)

```
docker exec -it app sh
```

```
npx prisma migrate deploy
```


After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.


## Script for vulnerabilities scanning

```
npm run docker:scan
```

## The image is pushed to DockerHub

https://hub.docker.com/repository/docker/yuliya73/nodejs_2022q4/tags?page=1&ordering=last_updated 

To get app image:

```
docker pull yuliya73/nodejs_2022q4:app
```

To get db image:

```
docker pull yuliya73/nodejs_2022q4:library
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
