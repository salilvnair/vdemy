# Vdemy ![GitHub release](https://img.shields.io/github/release/salilvnair/vdemy.svg?style=plastic)

Vdemy is the offline video player specially designed to get a udemy look alike feel.

## Changelog

----------------------------------------------------------------------------------------------------------------------------
 #### Released _`Version 3.0.0`_
----------------------------------------------------------------------------------------------------------------------------
> #### get it from here [3.0.0](https://github.com/salilvnair/vdemy/releases/tag/v3.0.0)

| # | Features                                                                                         | Comments     |
|---|-----------------------------------------------------------------------|--------------|
| 1  | Vdemy now supports Udemy login and direct play of the courses which you have subscribed in Udemy.                                          |NA
| 2 | Exactly same look and feel of udemy video player built right into Vdemy. |Q&A and Bookmark bar is still under development!
| 3 | Multi session login is supported first time ever for Udemy. |NA
|4| Enjoy all of the Vdemy 2.0.0 features on a signle menu click called "Offline". |NA
|5| Offline download of Udemy subsribed videos coming soon in upcoming releases. | 3.x.x or 4.x.x

----------------------------------------------------------------------------------------------------------------------------
 #### _`Version 2.0.0`_
----------------------------------------------------------------------------------------------------------------------------
> #### get it from here [2.0.0](https://github.com/salilvnair/vdemy/releases/tag/v2.0.0)

| # | Features                                                                                         | Comments     |
|---|-----------------------------------------------------------------------|--------------|
| 1  | New config tab where user can config video formats and other formats like HTML etc.                                          |NA
| 2 | Course preview tiles now shows the course completion percentage on hover.|old courses prior to this version will be impacted by this change
| 3 | Offline course thumbnail and author image support now if user passes the course folder with course.png and author.png inside root folder it will be taken as the default image url.|jpg is also 
|4| Upgraded project to angular 7|NA
|5| Multiple UI level enhancement and performace improvements.|NA


----------------------------------------------------------------------------------------------------------------------------
#### _`Version 1.0.0`_
----------------------------------------------------------------------------------------------------------------------------


| #          | Features                                                                                         | Comments     |
|------------------|--------------------------------------------------------------------------------------------------|--------------|
|   1        |Drag and drop course folder downloaded from Udemy to watch it offline later.|NA|
|2|Udemy look alike collection(dashboard) where a new course can be added with thumbnail and icon|NA|
|3|Last played state(time) can be resumed on a later point of time.|NA
|4|Responsive design.                                                                      |NA

----------------------------------------------------------------------------------------------------------------------------

## _For Developers & Contributors_:
> Download the repository
``` bash
git clone https://github.com/salilvnair/vdemy.git
```
> Install node modules
``` bash
npm install
ng serve
```
> On a different terminal run
``` bash
npm run electron
```

-  _`@ngxeu/cli`_ to run electron build and publish releases tp github.
- _`@ngxeu/core , @ngxeu/notifier`_ to show update available dialog whenever there is an update.

----------------------------------------------------------------------------------------------------------------------------

## Project dependencies
1. electron
2. electron-builder
2. angular and angular material
3. NeDB(as database dependency)

----------------------------------------------------------------------------------------------------------------------------

## Tools used
1.  Angular CLI 7
2.  Visual studio code

----------------------------------------------------------------------------------------------------------------------------
