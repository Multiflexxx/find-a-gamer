# find-a-gamer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.

# Setup 
- Setup angular project with style-type sass or migrate from css to scss for existing project : `ng new name –-style=sccs`
- Install 4 packeges:
  - `npm install node-sass --save-dev`
  - `npm install bulma --save-dev`
  - `ng add @angular/material`
  - `npm install --save @fortaewsome/fontawesome-free`
- Add js and css path to angular.json 
  - Style: `./node_modules/@fortawesome/fontawesome-free/js/all.js`
  - Script: `./node_modules/@fortawesome/fontawesome-free/js/all.js`

The last step may not be necessary.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
