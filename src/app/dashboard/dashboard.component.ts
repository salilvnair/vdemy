import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditCourseDialog } from './course/edit-course/edit-course-dialog';
import * as CommonConstant from '../shared/constant/common.constant';
import { ICourseModel } from './course/model/course.model';
import { DashboardService } from './service/dashboard.service';
import { WatchmanService } from '../util/watchman/watchman.service';
import { TimeoutDialogService } from '../auth/timeout/timeout-dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dashboardData: ICourseModel[] = [
    // {
    //   id: 1,
    //   thumbnail:
    //     'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   avatar: 'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   title: 'The Complete ASP.NET MVC 5 Course',
    //   subtitle: 'MVC 5 Course',
    //   description:
    //     'The Complete ASP.NET MVC 5 Course-The Complete ASP.NET MVC 5 Course-',
    //   coursePlayList: []
    // },
    // {
    //   id: 2,
    //   thumbnail:
    //     'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   avatar: 'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   title: 'The Complete ASP.NET MVC 5 Course',
    //   subtitle: 'MVC 5 Course',
    //   description:
    //     'The Complete ASP.NET MVC 5 Course-The Complete ASP.NET MVC 5 Course-',
    //   coursePlayList: []
    // },
    // {
    //   id: 3,
    //   thumbnail:
    //     'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   avatar: 'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   title: 'The Complete ASP.NET MVC 5 Course',
    //   subtitle: 'MVC 5 Course',
    //   description:
    //     'The Complete ASP.NET MVC 5 Course-The Complete ASP.NET MVC 5 Course-',
    //   coursePlayList: []
    // },
    // {
    //   id: 4,
    //   thumbnail:
    //     'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   avatar: 'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   title: 'The Complete ASP.NET MVC 5 Course',
    //   subtitle: 'MVC 5 Course',
    //   description:
    //     'The Complete ASP.NET MVC 5 Course-The Complete ASP.NET MVC 5 Course-',
    //   coursePlayList: []
    // },
    // {
    //   id: 5,
    //   thumbnail:
    //     'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   avatar: 'https://udemy-images.udemy.com/course/480x270/806922_6310_3.jpg',
    //   title: 'The Complete ASP.NET MVC 5 Course',
    //   subtitle: 'MVC 5 Course',
    //   description:
    //     'The Complete ASP.NET MVC 5 Course-The Complete ASP.NET MVC 5 Course-',
    //   coursePlayList: []
    // }
  ];
  timeoutDialogOpened = false;
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
    this.dashboardData = this.dashboardService.getCourseData();
  }

  ngAfterViewInit() {
    this.initCollectionDataOnLoad();
  }

  initCollectionDataOnLoad() {
    if (this.dashboardData) {
      this.dashboardData.forEach(dashboardItr => {
        const element = document.getElementById(
          'course-avatar_' + dashboardItr.id
        );
        element.style.backgroundImage = 'url("' + dashboardItr.avatar + '")';
      });
    }
  }

  editCourse(id) {
    // console.log('editing collection:' + id);
    this.openEditCourseDialog(id);
  }

  openEditCourseDialog(id) {
    let selectedData = this.findCourseFromDashboard(id);
    let dialogRef = this.dialog.open(EditCourseDialog, {
      width: '650px',
      data: selectedData
    });

    dialogRef.afterClosed().subscribe(editCourseResponseData => {
      debugger;
      /* adding below method because the avatar image is set from css class 
        and isn't binded with any property */
      console.log(editCourseResponseData);
      if (
        editCourseResponseData.responseType ===
        CommonConstant.EDIT_COURSE_UPDATE_TYPE
      ) {
        this.changeAvater(editCourseResponseData.data);
      } else if (
        editCourseResponseData.responseType ===
        CommonConstant.EDIT_COURSE_CANCEL_TYPE
      ) {
        this.changeCourseData(editCourseResponseData.data);
      }
    });
  }

  findCourseFromDashboard(id) {
    return this.dashboardData.find(function(dashboardItr, index) {
      return dashboardItr.id === id;
    });
  }

  findCourseIndexFromDashboard(id) {
    let arrayIndex = 0;
    this.dashboardData.find(function(dashboardItr, index) {
      arrayIndex = index;
      console.log('arrayIndex', arrayIndex);
      return dashboardItr.id === id;
    });
    return arrayIndex;
  }

  changeCourseData(editedCourseData) {
    let editedIndex = this.findCourseIndexFromDashboard(editedCourseData.id);
    this.dashboardData[editedIndex].avatar = editedCourseData.avatar;
    this.dashboardData[editedIndex].title = editedCourseData.title;
    this.dashboardData[editedIndex].subtitle = editedCourseData.subtitle;
    this.dashboardData[editedIndex].thumbnail = editedCourseData.thumbnail;
    this.changeAvater(editedCourseData);
  }

  changeAvater(editedCourseData) {
    let element = document.getElementById(
      'course-avatar_' + editedCourseData.id
    );
    element.style.backgroundImage = 'url("' + editedCourseData.avatar + '")';
  }

  removeCourse(id) {
    const newDashboardData = this.removeCourseFromDashboard(id);
    this.dashboardData = newDashboardData;
  }

  removeCourseFromDashboard(id) {
    return this.dashboardData.filter(function(dashboardItr) {
      return dashboardItr.id !== id;
    });
  }
}
