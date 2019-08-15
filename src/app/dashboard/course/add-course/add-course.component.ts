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
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit, OnDestroy {
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public snackBar: MatSnackBar,
    private electronService: ElectronService
  ) {}

  AUTHOR_IMAGE = 'author';
  COURSE_IMAGE = 'course';
  LOCAL_FILE_URL = 'file://';

  color = 'primary';
  mode = 'indeterminate';
  value = 0;

  courseData: CourseModel;
  playList: PlayList[];
  courseContentsAdded: boolean = false;

  @ViewChild('fileupload') private fileupload: ElementRef;

  currentDropIcon = 'create_new_folder';

  currentDropText = 'Drag & Drop';

  totalCourseDuration: number = 0;

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
    let progressElem: HTMLDivElement = <HTMLDivElement>(
      document.querySelector('.progress__container')
    );
    progressElem.classList.remove('hide');
    var self = this;
    var timer = setInterval(() => {
      self.mode = 'determinate';
      self.value = self.value + 10;
      //console.log(self.value);
      if (self.value == 110) {
        progressElem.classList.add('hide');
        clearInterval(timer);
      }
    }, 500);
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
    this.courseContentsAdded = true;
    this.currentDropIcon = document.querySelector('.dropzone__icon').innerHTML;
    this.currentDropText = document.querySelector('.dropzone__text').innerHTML;
  }

  addCourse() {
    const action = 'OK';
    if (!this.courseContentsAdded && this.playList.length == 0) {
      let message = 'Please drag and drop course content folder!';
      this.snackBar.open(message, action);
      return false;
    } else if (this.playList.length == 0) {
      let message =
        'There is no video format defined in the configuration, \n please goto Config tab and add allowed video formats for the imports!';

      this.snackBar.open(message, action);
      return false;
    }
    let currentCourseDataList = this.dashboardService.courseData;
    let nextId = currentCourseDataList.length + 1;
    //console.log(nextId);
    this.courseData.playListTotalVideoDuration = this.totalCourseDuration;
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

  isCourseThumbnailOrAvatar(fileExtention: string, fileItem: File) {
    if (
      fileExtention == 'png' ||
      fileExtention == 'jpeg' ||
      fileExtention == 'jpg'
    ) {
      if (fileItem.name.indexOf(this.COURSE_IMAGE) > -1) {
        this.courseData.thumbnail = this.LOCAL_FILE_URL + fileItem.path;
      }
      if (fileItem.name.indexOf(this.AUTHOR_IMAGE) > -1) {
        this.courseData.avatar = this.LOCAL_FILE_URL + fileItem.path;
      }
    }
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

  getVideoDurationByFileName(filePath: string) {
    //debugger;
    let vdoUtil = this.electronService.remote.getGlobal(
      CommonConstant.NODEJS_GLOBAL_UTILS
    ).vdoUtil;
    let currentVideoDuration = vdoUtil.getVideoDuration(filePath);
    currentVideoDuration = Math.floor(currentVideoDuration);
    //console.log(Math.floor(currentVideoDuration));
    this.totalCourseDuration = this.totalCourseDuration + currentVideoDuration;
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
          if (self.isVideoFormat(fileExtention.toLowerCase())) {
            self.getVideoDurationByFileName(fileItem.path);
          }
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
        self.isCourseThumbnailOrAvatar(fileExtention, fileItem);
      });
    } else if (item.isDirectory) {
      var directoryPath = path + item.name;
      self.readDirectory(item, directoryPath);
    }
  }

   readDirectory = (item, directoryPath) => {
     var self = this;
     var dirReader = item.createReader();

     var entryReader = () => {
      dirReader.readEntries(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          self.traverseFileTree(entries[i], directoryPath + '/', false);
        }
        if (entries.length>0) entryReader();
      });
     }
     entryReader();
  }

}
