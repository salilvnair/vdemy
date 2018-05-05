import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditCourseDialog } from './course/edit-course/edit-course-dialog';
import * as CommonConstant from '../shared/constant/common.constant';
import { CourseModel } from './course/model/course.model';
import { DashboardService } from './service/dashboard.service';
import { WatchmanService } from '../util/watchman/watchman.service';
import { TimeoutDialogService } from '../auth/timeout/timeout-dialog.service';
import { DashboardDataService } from './service/dashboard-data.service';
import { PlayList } from '../player/model/playlist.model';
import { ResumePlayerModel } from '../player/model/resume-player.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  dashboardData: CourseModel[] = [];
  timeoutDialogOpened = false;
  collectionDataInitialized = false;
  countdown = 0;
  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private watchmanService: WatchmanService
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.dashboardData = this.dashboardService.courseData;
    var self = this;
    if (this.dashboardService.courseData.length == 0) {
      this.dashboardData = [];
      var courseData = this.dashboardService.getCourseData();
      this.dashboardData = courseData.concat();
      this.dashboardService.setCourseData(this.dashboardData);
    }
    if (this.dashboardService.resumePlayerCourseData.length == 0) {
      let resumePlayerCourseData: ResumePlayerModel[] = [];
      this.dashboardService.selectAllResumeCourseData().then(courses => {
        courses.forEach(elem => {
          resumePlayerCourseData.push(elem);
        });
        //console.log(resumePlayerCourseData);
        self.dashboardService.setResumePlayerCourseData(resumePlayerCourseData);
      });
    }
  }
  ngAfterViewChecked(): void {
    if (!this.collectionDataInitialized) {
      this.initCollectionDataOnLoad();
    }
  }

  initCollectionDataOnLoad() {
    if (this.dashboardData && this.dashboardData.length > 0) {
      //console.dir(this.dashboardData.length);
      this.dashboardData.forEach(dashboardItr => {
        //console.dir(dashboardItr);
        const element = document.getElementById(
          'course-avatar_' + dashboardItr._id
        );
        //console.log(dashboardItr._id);
        element.style.backgroundImage = 'url("' + dashboardItr.avatar + '")';
        this.collectionDataInitialized = true;
      });
    }
  }

  editCourse(id) {
    // console.log('editing collection:' + id);
    this.openEditCourseDialog(id);
  }
  updateCoursePlayList(id) {
    //open dialog with drag and drop course data
  }

  openEditCourseDialog(id) {
    let selectedData = this.findCourseFromDashboard(id);
    let oldData = { ...selectedData };
    let dialogRef = this.dialog.open(EditCourseDialog, {
      width: '650px',
      data: selectedData
    });
    var self = this;
    dialogRef.afterClosed().subscribe(editCourseResponseData => {
      //debugger;
      /* adding below method because the avatar image is set from css class 
        and isn't binded with any property */
      console.log(editCourseResponseData);
      if (
        editCourseResponseData.responseType ===
        CommonConstant.EDIT_COURSE_UPDATE_TYPE
      ) {
        self.changeAvater(editCourseResponseData.data);
        self.updateCourseData(oldData, editCourseResponseData.data);
      } else if (
        editCourseResponseData.responseType ===
        CommonConstant.EDIT_COURSE_CANCEL_TYPE
      ) {
        self.changeCourseData(editCourseResponseData.data);
      }
    });
  }

  updateCourseData(existingData, editedCourseData) {
    console.dir('existingData', existingData);
    console.dir('editedCourseData', editedCourseData);
    if (editedCourseData._id != undefined) {
      this.dashboardService.updateCourseData(existingData, editedCourseData);
    }
  }
  findCourseFromDashboard(id) {
    return this.dashboardData.find(function(dashboardItr, index) {
      return dashboardItr._id === id;
    });
  }

  findCourseIndexFromDashboard(id) {
    let arrayIndex = 0;
    this.dashboardData.find(function(dashboardItr, index) {
      arrayIndex = index;
      //console.log('arrayIndex', arrayIndex);
      return dashboardItr._id === id;
    });
    return arrayIndex;
  }

  changeCourseData(editedCourseData) {
    let editedIndex = this.findCourseIndexFromDashboard(editedCourseData._id);
    this.dashboardData[editedIndex].avatar = editedCourseData.avatar;
    this.dashboardData[editedIndex].title = editedCourseData.title;
    this.dashboardData[editedIndex].subtitle = editedCourseData.subtitle;
    this.dashboardData[editedIndex].thumbnail = editedCourseData.thumbnail;
    this.changeAvater(editedCourseData);
  }

  getExistingData(id) {
    //debugger;
    let editedIndex = this.findCourseIndexFromDashboard(id);
    let courseModel: CourseModel = new CourseModel();
    courseModel = Object.assign(courseModel, this.dashboardData[editedIndex]);
    return courseModel;
  }

  changeAvater(editedCourseData) {
    let element = document.getElementById(
      'course-avatar_' + editedCourseData._id
    );
    element.style.backgroundImage = 'url("' + editedCourseData.avatar + '")';
  }

  removeCourse(id) {
    const newDashboardData = this.removeCourseFromDashboard(id);
    this.dashboardData = newDashboardData;
    this.dashboardService.removeCourseData(id);
  }

  removeCourseFromDashboard(id) {
    return this.dashboardData.filter(function(dashboardItr) {
      return dashboardItr._id !== id;
    });
  }
}
