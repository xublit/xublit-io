# **Quick start guide**

This document will guide you through the process of creating a simple Node.js REST Server for a todo list app.

#### (i) Contents
   1.   [Getting started](#1-getting-started) -- Initial project setup
   2.   [App directory structure](#2-app-directory-structure) -- Creating the directory structure
   3.   [The `MongoDB` Module](#3-the-mongodb-module)
   4.   [The `RestServer` Module](#4-the-restserver-module)
   5.   [The `RelationalModels` module](#5-the-relationalmodels-module)
   6.   [Create our app models](#6-defining-our-app-models) -- Setting up the relational models
   7.   [Create REST server routes](#7-create-rest-server-routes) -- For our RESTful API
   8.   [Create REST route controllers](#8-create-rest-route-controllers) -- To handle the REST server's requests/responses

#### (ii) Xublit modules used in this guide
   -   [xublit-mongo-db](https://github.com/xublit/xublit-mongo-db) -- For **MongoDB** persistence
   -   [xublit-rest-server](https://github.com/xublit/xublit-rest-server) -- To power your REST server
   -   [xublit-relational-models](https://github.com/xublit/xublit-relational-models) -- Relational models module

If you want to skip the guide and get straight in to it, you can find the source for this example [xublit/demo-todo-app]() git repo.

****************************************

## **1. Getting started**

Before we begin, make sure you have all of the following:

- [Node.js](https://nodejs.org) installed & ready to go
- [MongoDB](https://mongodb.org) installed & ready to go
- An [internet](https://www.google.com.au/?q=what+is+internet) connection
- About 15 - 30 minutes of free time

#### 1.1 ) Create the project

We'll start by creating our project root directory and executing `npm init` from a shell/terminal session to create our package.json file.
```sh
$ mkdir ~/demo-todo-app
$ cd ~/demo-todo-app
$ npm init
```

Next, we're going to add the `xublit-io` npm nodule to our project using the `npm install` command.
```sh
$ npm install --save xublit-io
```

Then we'll set up our initial app directory structure -- don't worry, we'll explore the structure in greater detail in step 2.

Create your entry file `app.js` and two folders named `src`, and`etc`.  Your project's root directory should now look something like this.

```
|-- etc/
|-- src/
|-- app.js
|-- package.json
```

****************************************

## **2. App directory structure**

The directory structure for Xublit apps is intended to be simple and flexible.  

##### The key things to remember are:
   1.   **Configuration files** for your app's modules and environments live in the `etc` directory
   2.   The **source code** for your app belongs in the `src` directory
   3.   Default directory names can be changed by passing additional properties

#### Example dir structure from [Demo Todo App](https://github.com/xublit/demo-todo-app)
```
|-- etc/
    |-- env/
        |-- local.yaml
        |-- production.yaml
    |-- mongodb/
        |-- schemas/
            |-- todo.yaml
            |-- todoList.yaml
    |-- restServer/
        |-- routes/
            |-- todos.yaml
            |-- todoLists.yaml
|-- src/
    |-- todo/
        |-- todoModel.js
        |-- todoModelFactory.js
        |-- todoRouteController.js
    |-- todoList/
        |-- todoListModel.js
        |-- todoListModelFactory.js
        |-- todoListRouteController.js
    |--  thingsTodo.js
|-- app.js
|-- package.json
```

****************************************

## **3. The `MongoDB` module**

For a detailed guide on using this module, see the [xublit/xublit-mongo-db](https://github.com/xublit/xublit-mongo-db) repo.

#### 3.1 ) Install the module

First step is installing the `xublit-mongo-db` npm module using `npm install`.

```sh
$ npm install --save xublit-mongo-db
``` 

#### 3.2 ) Configure the module

Next we'll add the configuration for it by adding the following lines to our `local` environment config file at `etc/env/local.yaml`.

```yaml
mongoDb:
    hostname: localhost
    store: xublit_demo_todo
```

#### 3.3 ) Create the `$mongodb` injectable

A quick way to *provide* a configured injectable instance of an installed module is by using the [provide()]() method on the XublitApp object.

```js
thingsToDoApp.provide('$mongoDb', {
    asSingletonInstanceOf: 'XublitMongoDb',
    usingConfiguration: 'mongoDb',
});
```

****************************************

## **4. The `RestServer` module**

For a detailed guide on using this module, see the [xublit/xublit-rest-server](https://github.com/xublit/xublit-rest-server) repo.

#### 4.1 ) Install the module

Again the first step here is installing the `xublit-rest-server` npm module using `npm install`.

```sh
$ npm install --save xublit-rest-server
``` 

#### 4.2 ) Configure the module

Now we'll define the configuration for it in our `local` environment config file located at `etc/env/local.yaml`.

```yaml
restServer:
    port: 7331
    hostname: 127.0.0.1
    maxTcpBacklogSize: 500
```

#### 4.3 ) Create the `$restServer` injectable

Once again we're using the `provide()` method on our app object to define an injectable -- this time referenced as `$restServer`.

```js
thingsToDoApp.provide('$restServer', {
    asSingletonInstanceOf: 'XublitRestServer',
    usingConfiguration: 'restServer',
});
```

****************************************

## **5. The `RelationalModels` module**

For a detailed guide on using this module, see the [xublit/xublit-rest-server](https://github.com/xublit/xublit-rest-server) repo.