# LunchBadger Compose Plugin

To develop, you require core of Lunch Badger application.
Just put the plugin inside plugins/ directory of container. 
Core is required to develop.

Development process require container to be started, because it also listens to plugin change.
Simply - you have to start container and each plugin separately to develop.

## Installation
Simply run `npm install` inside the main catalog

## Generator
It uses `generator-react-webpack` so you can use `yo react-webpack:component my/namespaced/components/name` command to generate new component for React

## Usage
```
# Start for development
npm start

# Just build the dist version and copy static files
npm run dist

# Make dist build with local configuration file
npm run dist:local

# Run unit tests
npm test

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint
```


