# react-gtk

[![Build Status](https://travis-ci.org/selaux/react-gtk.svg?branch=master)](https://travis-ci.org/selaux/react-gtk)

A experimental React renderer written in JavaScript. It can be bundled using webpack
to get an application bundle which can run in `gjs`, the Gnome projects JavaScript
runtime.

## Status

- [x] Rendering a simple application
- [x] Make inputs controlled by react
- [x] Handle dynamically added and removed children
- [ ] Support for all widgets
- [ ] Support for list models
- [ ] Automated mapping of property string values to GTK consts

## Dev Dependencies

We currently depend on gjs>=1.50.2, gtk3 and nodejs. You can choose to
conveniently install them using the Nix package manager:

```
nix-shell
```

This will drop you in a shell with all the dependencies installed.

__Note__: We use nodejs only for packaging. The application has to be run using
gjs, otherwise it will not work.

## Running the Example Application

Install dependencies:

```
npm i
```

Start the application:

```
npm start
```
