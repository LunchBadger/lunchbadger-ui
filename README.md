# LunchBadger Core

Core required for development
Just put core inside `plugins/` directory of container to start development

Core module provides reusable components for rest of the modules.
Also this is the source for other plugins to register (it provides Plugin store).

## Installation
Simply run `npm install` inside the main catalog.
This command will create symbolic link to node_modules directory from container so modules are not duplicated.

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

## Creating plugins

### Register plugins

#### Tools
#### Panels
#### Quadrants
#### Connection strategies
