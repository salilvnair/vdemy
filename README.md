# Vdemy ![GitHub release](https://img.shields.io/github/release/salilvnair/vdemy.svg?style=plastic)

Vdemy is the offline video player specially designed to get a udemy look alike feel.

## Changelog

| Version          | Features                                                                                         | Comments     |
|------------------|--------------------------------------------------------------------------------------------------|--------------|
|   1.0.0          |--Drag and drop course folder downloaded from Udemy to watch it offline later.<br><br>--Udemy look alike collection(dashboard) where a new course can be added with thumbnail and icon.<br><br>--Last played state(time) can be resumed on a later point of time.<br><br>--Responsive design.                                                                      |NA

## Getting Started
> Run the below commands in the terminal or cmd promt
``` bash
cd ./vdemy/angular
npm install
ng build --prod

cd ./vdemy/electron
npm install
#for macOS
npm run pack-m  
#for windows
npm run pack-w or npm run pack-w64

```
> After that you can find the exe or deb or pkg in the vdemy/eletron/dist folder

## Project dependencies
1. electron
2. electron-builder
2. angular and angular material
3. NeDB(as database dependency)

## Tools used
1.  Angular CLI(1.7.2)
2.  Visual studio code
