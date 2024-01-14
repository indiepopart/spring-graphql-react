# Building a GraphQL API with Spring for GraphQL

This repository contains a GraphQL demo, with an API server application and a React client for displaying a list of companies. The tutorial for creating this example is available on [Okta Developer Blog]().

**Prerequisites:**

- [Node.js v20.10.0](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [npm 10.2.3](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Java OpenJDK 17](https://jdk.java.net/java-se-ri/17)
- [Docker 24.0.7](https://docs.docker.com/desktop/)
- [Auth0 account](https://auth0.com/signup)
- [Auth0 CLI 1.3.0](https://github.com/auth0/auth0-cli#installation)


## Getting Started

To install this example, run the following commands:

```bash
git clone https://github.com/oktadev/auth0-spring-graphql-react-example.git spring-graphql-react
cd spring-graphql-react
```

## Run the Spring Boot GraphQL server

The following steps apply to the server application `spring-graphql-api`.

```shell
cd spring-graphql-api
```

### Set up the seed data

Download the following seed files to an empty folder:

- [CompanyDataAmericans.csv](https://guides.neo4j.com/ukcompanies/data/CompanyDataAmericans.csv)
- [LandOwnershipAmericans.csv](https://guides.neo4j.com/ukcompanies/data/LandOwnershipAmericans.csv)
- [PSCAmericans.csv](https://guides.neo4j.com/ukcompanies/data/PSCAmericans.csv)

Edit the file `compose.yml` and update the seed data csv folder path:

```yml
services:
  neo4j:
    image: neo4j:5
    volumes:
      - <csv-folder>:/var/lib/neo4j/import
```


### Run a local Neo4j database

Create the file `.env` at the server root folder with the following content:

__.env__
```shell
export NEO4J_PASSWORD=verysecret
```

### Create the server application in Auth0

Sign up at [Auth0](https://auth0.com/signup) and install the [Auth0 CLI](https://github.com/auth0/auth0-cli) that will help you create the tenant and the client applications.

In the command line login to Auth0 with the CLI:

```shell
auth0 login
```

The command output will display a device confirmation code and open a browser session to activate the device.

**NOTE**: My browser was not displaying anything, so I had to manually activate the device by opening the URL `https://auth0.auth0.com/activate?user_code={deviceCode}`.

On successful login, you will see the tenant, which you will use as the issuer later:

```
✪ Welcome to the Auth0 CLI 🎊

If you don't have an account, please create one here: https://auth0.com/signup.

Your device confirmation code is: KGFL-LNVB

 ▸    Press Enter to open the browser to log in or ^C to quit...

Waiting for the login to complete in the browser... ⣻Opening in existing browser session.
Waiting for the login to complete in the browser... done

 ▸    Successfully logged in.
 ▸    Tenant: dev-avup2laz.us.auth0.com
```

The next step is to create a client app, which you can do in one command:

```shell
auth0 apps create \
  --name "GraphQL Server" \
  --description "Spring Boot GraphQL Resource Server" \
  --type regular \
  --callbacks http://localhost:8080/login/oauth2/code/okta \
  --logout-urls http://localhost:8080 \
  --reveal-secrets
```

Once the app is created, you will see the OIDC app's configuration:

```
=== dev-avup2laz.us.auth0.com application created

  CLIENT ID            ***
  NAME                 GraphQL Server
  DESCRIPTION          Spring Boot GraphQL Resource Server
  TYPE                 Regular Web Application
  CLIENT SECRET        ***
  CALLBACKS            http://localhost:8080/login/oauth2/code/okta
  ALLOWED LOGOUT URLS  http://localhost:8080
  ALLOWED ORIGINS
  ALLOWED WEB ORIGINS
  TOKEN ENDPOINT AUTH
  GRANTS               implicit, authorization_code, refresh_token, client_credentials

 ▸    Quickstarts: https://auth0.com/docs/quickstart/webapp
 ▸    Hint: Emulate this app's login flow by running `auth0 test login ***`
 ▸    Hint: Consider running `auth0 quickstarts download ***`
```


Add the audience, clientId, issuer to the `application.properties` file:

```properties
okta.oauth2.issuer=https://<your-auth0-domain>/
okta.oauth2.client-id=<client-id>
okta.oauth2.audience=${okta.oauth2.issuer}api/v2/
```

Add the clientSecret to the `.env` file:

__.env__
```shell
export OKTA_OAUTH2_CLIENT_SECRET=<client-secret>
```

Again, in the server root folder, run the application with:

```shell
./gradlew bootRun
```

Wait for the logs to inform the seed data migrations have run (it might take a while):

```
2023-09-13T11:52:08.041-03:00  ... Applied migration 001 ("Constraint").
2023-09-13T11:52:12.121-03:00  ... Applied migration 002 ("Company").
2023-09-13T11:52:16.508-03:00  ... Applied migration 003 ("Person").
2023-09-13T11:52:22.635-03:00  ... Applied migration 004 ("PersonCompany").
2023-09-13T11:52:25.979-03:00  ... Applied migration 005 ("CompanyData").
2023-09-13T11:52:27.703-03:00  ... Applied migration 006 ("Land").
```


## Run the React client

The following steps apply to the React client application `react-graphql`.

```shell
cd react-graphql
```

### Create the client application in Auth0

With the Auth0 client, create an SPA application:

```shell
auth0 apps create \
  --name "React client for GraphQL" \
  --description "SPA React client for a Spring GraphQL API" \
  --type spa \
  --callbacks http://localhost:3000/callback \
  --logout-urls http://localhost:3000 \
  --origins http://localhost:3000 \
  --web-origins http://localhost:3000
```

Copy the file `.env.example` to `.env.local`. Set the auth0 domain, the client Id, audience and callback URL:

```shell
NEXT_PUBLIC_API_SERVER_URL=http://localhost:8080
NEXT_PUBLIC_AUTH0_DOMAIN=<your-auth0-domain>
NEXT_PUBLIC_AUTH0_CLIENT_ID=<client-id>
NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:3000/callback
NEXT_PUBLIC_AUTH0_AUDIENCE=https://<your-auth0-domain>/api/v2/
```

Run the application with:

```
npm install && npm run dev
```

Go to http://localhost:3000 and you should be redirected to the Auth0 universal login page. After login in, you should see a companies list.


## Help

Please post any questions as comments on the [blog post](), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
