<h1 align="center">A simplified Jira clone built with React and Node</h1>
<h2 align="center">cloned from <a href="https://github.com/oldboyxx/jira_clone">oldboyxx/jira_clone</a> </h2>
<h2 align="center">Adapted to work with celestial's RTK definitions</h2>
<div align="center">Auto formatted with Prettier, tested with Cypress 🎗</div>

<h3 align="center">
  <a href="https://jira.ivorreic.com/">Visit the original live app</a>
</h3>

![App screenshot](https://i.ibb.co/W3qVvCn/jira-optimized.jpg)

## About
This is a simplified Jira clone, cloned from [oldboyxx/jira_clone](https://github.com/oldboyxx/jira_clone), and adapted to work with celestial's RTK definitions. This is an example application to demonstrate the simplicity of using celestial's RTK definitions to manage the state of a React application. 

## Setting up development environment 🛠

- Install [postgreSQL](https://www.postgresql.org/) if you don't have it already and create a database named `jira_development`.
- `git clone https://github.com/oldboyxx/jira_clone.git`
- Create an empty `.env` file in `/api`, copy `/api/.env.example` contents into it, and fill in your database username and password.
- `npm run install-dependencies`
- `cd api && npm start`
- `cd client && npm start` in another terminal tab
- App should now be running on `http://localhost:8080/`

## Generating RTK definitions
`npx celestial ./openapispec.json ./client/src/celestial`