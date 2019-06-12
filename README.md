# TSB Admin UI

The admin UI to access data exposed by the [TSB-metadata-generator](https://github.com/wbkd/TSB-metadata-generator).

## Requirements

- Node.js (recommended => v10)
- a running [TSB-metadata-generator](https://github.com/wbkd/TSB-metadata-generator) instance.

## Installation

Clone the repository, enter the root project folder and then run the following:

```sh
$ npm install
```

## Development

Builds the application and starts a webserver with hot loading.
Runs on [localhost:8080](http://localhost:8080/)

```sh
$ npm run start
```

## Build

Bundles a minified version of the application in the build folder.

```sh
$ npm run build
```

## Data import/export

The data is served by [TSB-metadata-generator](https://github.com/wbkd/TSB-metadata-generator) and can be imported or exported using the appropriate endpoints or the UI provided in the settings view (under `/einstellungen`).
