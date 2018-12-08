import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  HostListener,
  OnDestroy
} from '@angular/core';

import { CourseModel } from '../model/course.model';
import { PlayList, FileContent } from '../../../player/model/playlist.model';
import { DashboardService } from '../../service/dashboard.service';
import { Router } from '@angular/router';
import * as CommonConstant from '../../../shared/constant/common.constant';
import { CommonUtility } from '../../../util/common/common.util';
import { AppConfigurationModel } from '../../../config/model/app-conf.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit, OnDestroy {
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  courseData: CourseModel;
  playList: PlayList[];

  @ViewChild('fileupload') private fileupload: ElementRef;

  currentDropIcon = 'create_new_folder';

  currentDropText = 'Drag & Drop';

  videoDuration: number = 0;

  allowedOtherFormats: string[] = [];

  videoFormats: string[] = [];

  ngOnInit() {
    this.initCourseData();
  }

  initCourseData() {
    this.courseData = new CourseModel();
    this.courseData.coursePlayList = [];
    this.playList = [];
  }

  ngOnDestroy() {
    // this.courseDataService.courseData = this.courseData;
  }

  onDrop(event) {
    event.preventDefault();
    this.process(event);
  }

  onDragLeave(event) {
    document.querySelector('.dropzone__icon').innerHTML = this.currentDropIcon;
    document.querySelector('.dropzone__text').innerHTML = this.currentDropText;
  }

  dragOver(event) {
    event.preventDefault();
    document.querySelector('.dropzone__icon').innerHTML = 'create_new_folder';
    document.querySelector('.dropzone__text').innerHTML = 'Drag & Drop';
  }

  process(event) {
    this.preProcess(event);
    this.processDrop(event);
    this.postProcess(event);
  }

  preProcess(event) {
    document.querySelector('.dropzone__icon').innerHTML = 'folder';
    var folder = event.dataTransfer.items[0].webkitGetAsEntry();
    if (folder.isDirectory) {
      var directoryPath = folder.name;
      document.querySelector('.dropzone__text').innerHTML = directoryPath;
    }
  }

  processDrop(event) {
    var length = event.dataTransfer.items.length;
    for (var i = 0; i < length; i++) {
      var entry = event.dataTransfer.items[i].webkitGetAsEntry();
      if (entry) {
        this.traverseFileTree(entry, '', false);
      }
    }
  }

  postProcess(event) {
    //console.log(this.playList);
    this.currentDropIcon = document.querySelector('.dropzone__icon').innerHTML;
    this.currentDropText = document.querySelector('.dropzone__text').innerHTML;
  }

  addCourse() {
    const message =
      'There is no video format defined in the configuration, \n please goto Config tab and add allowed video formats for the imports!';
    const action = 'OK';
    if (this.playList.length == 0) {
      this.snackBar.open(message, action);
      return false;
    }
    let currentCourseDataList = this.dashboardService.courseData;
    let nextId = currentCourseDataList.length + 1;
    //console.log(nextId);
    this.courseData.playListTotalVideoDuration = this.videoDuration;
    this.courseData.coursePlayList = this.playList;
    //sort the playList fileContent items in natural sort order
    this.courseData.coursePlayList.forEach(courseDataItr => {
      courseDataItr.fileContent.sort((a: FileContent, b: FileContent) => {
        return a.fileName.localeCompare(b.fileName, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
    });
    //sort the playList items in natural sort order
    this.courseData.coursePlayList.sort((a: PlayList, b: PlayList) => {
      return a.folderName.localeCompare(b.folderName, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });
    this.dashboardService.addCoursedata(this.courseData);
    this.dashboardService.courseAddedEventPublisher().subscribe(courseData => {
      //console.log(courseData);
      this.router.navigate(['/dashboard']);
    });
  }
  cancel() {
    this.router.navigate(['/dashboard']);
  }

  isVideoFormat(fileExtention: string) {
    if (this.videoFormats.length == 0) {
      this.loadAppConfFromDb();
    }
    if (this.videoFormats.indexOf(fileExtention.toLowerCase()) > -1) {
      return true;
    }
    return false;
  }

  loadAppConfFromDb() {
    let videoConfigurationModel: AppConfigurationModel = this.dashboardService.getAppConfiguration();
    this.allowedOtherFormats =
      videoConfigurationModel.allowedOtherFormats == undefined
        ? []
        : videoConfigurationModel.allowedOtherFormats;
    this.videoFormats =
      videoConfigurationModel.videoFormats == undefined
        ? []
        : videoConfigurationModel.videoFormats;
  }

  isAllowedOtherFormat(fileExtention: string) {
    if (this.allowedOtherFormats.length == 0) {
      this.loadAppConfFromDb();
    }
    // ingoreFileArray.push('srt');
    // ingoreFileArray.push('zip');
    // ingoreFileArray.push('txt');
    // ingoreFileArray.push('pdf');
    // ingoreFileArray.push('ds_store');//to ignore auto created file info file in mac os
    if (this.allowedOtherFormats.indexOf(fileExtention.toLowerCase()) > -1) {
      return true;
    }
    return false;
  }

  traverseFileTree(item, path, directSelect) {
    var self = this;
    path = path || '';
    var playListItem: PlayList = { fileContent: [], folderName: '' };
    if (item.isFile) {
      item.file(function(fileItem: File) {
        var foundIndex = 0;
        let fileExtention = CommonUtility.getFileExtension(fileItem.name);
        if (
          self.isVideoFormat(fileExtention.toLowerCase()) ||
          self.isAllowedOtherFormat(fileExtention.toLowerCase())
        ) {
          if (
            self.playList.filter(function(e, index) {
              foundIndex = index;
              return e.folderName === path;
            }).length > 0
          ) {
            self.playList[foundIndex].fileContent.push({
              fileName: fileItem.name,
              fileLocation: fileItem.path
            });
          } else {
            playListItem.folderName = path;
            playListItem.fileContent.push({
              fileName: fileItem.name,
              fileLocation: fileItem.path
            });
            self.playList.push(playListItem);
          }
        }
      });
    } else if (item.isDirectory) {
      var directoryPath = path + item.name;
      var dirReader = item.createReader();
      dirReader.readEntries(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          self.traverseFileTree(entries[i], directoryPath + '/', false);
        }
      });
    }
  }
}
