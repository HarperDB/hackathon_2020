# Open Research Platform MVP

Developed by Ethan Arrowood

This repository contains an MVP application for our concept of an open research platform.

The fundamental feature is anonymization of posts. A researcher can create a post and make it _anonymous_ until they'd like to release it with their name. Because posts are retrieved from a server, we can strip away the researchers name before sending it back to the client so it is truly anonymous. Furthermore, a researcher can modify their own post and deanonymize it at any time.

## Set Up

- In both the **client** and **server** directory creat a **.env** file with a shared property `HDB_URL` which is set to the HarperDB Cloud database url.
- In the **client/.env** file add an additional property `API_URL` set to the URL of the API served from **server**.

## How its built

The app is built using TypeScript and Node.js. The client is built using React, Parcel, and Bootstrap, the server is built using Fastify.

The app is based on 3 high level entities: Users, Researchers, Posts. Users are the native HarperDB User objects, these are linked to Researcher profiles which can manage Post entites.

## Key Features

While there is a lot of things to share in the code of this application, these are some of the key features we want to highlight.

### Cient Auth

The client stores the user's session in a custom authentication context that is cached locally with localStorage. The authentication is controlled by HarperDB and uses a custom Sign Up and Sign In flow. The context is provided at the top level of the app so any page or component that needs to use it can import and call the `useAuth` hook:

```ts
import { useAuth } from 'utils/auth'

const { user } = useAuth()
```

### Client Bundler

The client is bundled with a beta module: Parcel 2. Parcel is fast and very easy to configure. The `index.html` file directly imports `index.tsx` and `App.scss` and Parcel is smart enough to load the necessary bundler modules in order to process them.

### Server Fastify v3

The server uses the new, Fastify version 3 release candidate. This major release contains a big TypeScript definition rewrite so the server can be more type safe.

### Server HarperDB Service

The server is based mainly on HarperDB (of course), and it does so through a service contained in the `HarperService.ts` file. This file exports a class that contains many CRUD-like methods for the different entities in the app.

