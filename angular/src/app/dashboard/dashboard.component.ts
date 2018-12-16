import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditCourseDialog } from './course/edit-course/edit-course-dialog';
import * as CommonConstant from '../shared/constant/common.constant';
import { CourseModel } from './course/model/course.model';
import { DashboardService } from './service/dashboard.service';
import { ResumePlayerModel } from '../player/model/resume-player.model';
import { PlayerDataService } from '../player/service/player-data.service';
import { CoursePlayListStatusModel } from '../player/model/course-playlist-status.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dashboardData: CourseModel[] = [];
  timeoutDialogOpened = false;
  collectionDataInitialized = false;
  countdown = 0;
  courseCompletionPercentage = [];
  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private playerDataService: PlayerDataService
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
  ngAfterViewInit(): void {
    this.initCollectionDataOnLoad();
  }

  initCollectionDataOnLoad() {
    if (this.dashboardData && this.dashboardData.length > 0) {
      this.dashboardData.forEach(dashboardItr => {
        this.initializeCourseAuthorImage(dashboardItr);
        this.initializePercentageContainer(dashboardItr._id);
        this.collectionDataInitialized = true;
      });
    }
  }

  initializeCourseAuthorImage(dashboardData) {
    const element = document.getElementById(
      'course-avatar_' + dashboardData._id
    );
    element.style.backgroundImage = 'url("' + dashboardData.avatar + '")';
  }

  initializePercentageContainer(courseId) {
    this.findCoursePercentageCompleted(courseId);
    var percentageCompleted = this.getCoursePercentage(courseId);
    const percentageContentElem = document.getElementById(
      'percentageContent_' + courseId
    );
    percentageContentElem.innerText = percentageCompleted + '';
    const percentageHolderElem = document.getElementById(
      'percentageHolder_' + courseId
    );
    percentageHolderElem.style.width = percentageCompleted + '';

    this.getColorByPercentage(courseId);
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
      //console.log(editCourseResponseData);
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
    //console.log('existingData', existingData);
    //console.log('editedCourseData', editedCourseData);
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
    this.dashboardData[editedIndex].description = editedCourseData.description;
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
    const newDashboardData = [...this.removeCourseFromDashboard(id)];
    this.dashboardData = newDashboardData;
    this.dashboardService.removeCourseData(id);
  }

  removeCourseFromDashboard(id) {
    return this.dashboardData.filter(function(dashboardItr) {
      return dashboardItr._id !== id;
    });
  }

  findCoursePercentageCompleted(courseId) {
    let coursePlaylistStatus: CoursePlayListStatusModel = this.playerDataService.selectCoursePlayListStatusSync(
      courseId
    );
    let selectedCourseData: CourseModel = this.findCourseFromDashboard(
      courseId
    );
    var percentageCompleted = 0;
    if (coursePlaylistStatus) {
      if (coursePlaylistStatus.totalDurationCompleted) {
        percentageCompleted =
          (coursePlaylistStatus.totalDurationCompleted /
            selectedCourseData.playListTotalVideoDuration) *
          100;
        percentageCompleted = Math.floor(percentageCompleted);
      }
    }

    let courseCompletion = {};
    courseCompletion['courseId'] = courseId;
    courseCompletion['percentageCompleted'] = percentageCompleted;
    this.courseCompletionPercentage.push(courseCompletion);
  }

  getCoursePercentage(courseId) {
    //console.log(courseId);
    if (
      this.dashboardService.courseCompletionPercentage &&
      this.dashboardService.courseCompletionPercentage.length > 0
    ) {
      if (
        this.findCoursePercentFromDashboard(
          courseId,
          this.dashboardService.courseCompletionPercentage
        )
      ) {
        var courseCompletion = this.calculateCoursePecentage(
          courseId,
          this.dashboardService.courseCompletionPercentage
        );
        let selectedCourseData: CourseModel = this.findCourseFromDashboard(
          courseId
        );
        var percentageCompleted =
          (courseCompletion / selectedCourseData.playListTotalVideoDuration) *
          100;
        percentageCompleted = Math.floor(percentageCompleted);
        return percentageCompleted + '%';
      } else if (this.courseCompletionPercentage.length > 0) {
        return (
          this.calculateCoursePecentage(
            courseId,
            this.courseCompletionPercentage
          ) + '%'
        );
      }
    } else if (this.courseCompletionPercentage.length > 0) {
      return (
        this.calculateCoursePecentage(
          courseId,
          this.courseCompletionPercentage
        ) + '%'
      );
    }
    return '0%';
  }

  calculateCoursePecentage(courseId, courseCompletionPercentage) {
    var coursePercentage = this.findCoursePercentFromDashboard(
      courseId,
      courseCompletionPercentage
    );
    if (coursePercentage) {
      var completionPerc = coursePercentage['percentageCompleted'];
      if (completionPerc != undefined) {
        return completionPerc;
      }
    }
    return 0;
  }

  findCoursePercentFromDashboard(courseId, courseCompletionPercentage) {
    return courseCompletionPercentage.find(function(courseCompletion) {
      return courseCompletion.courseId === courseId;
    });
  }

  getColorByPercentage(courseId) {
    const percentageContentElem = document.getElementById(
      'percentageContent_' + courseId
    );
    if (percentageContentElem) {
      var percText = percentageContentElem.innerText;
      if (percText.indexOf('%') > -1) {
        percText = percText.replace('%', '');
        //console.log(percText);
        const percentageCompleted = +percText;
        //console.log(percentageCompleted);
        if (percentageCompleted > 50) {
          percentageContentElem.style.color = '#fff';
        } else {
          percentageContentElem.style.color = '#3f51b5';
        }
      }
    }
    percentageContentElem.style.color = '#3f51b5';
  }
}
