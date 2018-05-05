import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';
import { PlayList } from '../../player/model/playlist.model';
import { ResumePlayerModel } from '../../player/model/resume-player.model';
import { CourseRepository } from '../repository/course.repository';
//import { Subject } from 'rxjs/Subject';
import { ResumeCourseRepository } from '../repository/resume-course.repository';

@Injectable()
export class DashboardService {
  courseData: CourseModel[] = [];
  //private courseDataSubject = new Subject<CourseModel[]>();
  resumePlayerCourseData: ResumePlayerModel[] = [];
  public playCourseId: string = '';
  constructor(
    private courseRepository: CourseRepository,
    private resumeCourseRepository: ResumeCourseRepository
  ) {}
  // courseDataPublisher() {
  //   return this.courseDataSubject.asObservable();
  // }
  getCourseData(): CourseModel[] {
    return this.courseData;
  }
  setCourseData(courseData: CourseModel[]) {
    this.courseData = courseData;
    //this.courseDataSubject.next(courseData);
  }
  addCoursedata(courseData: CourseModel) {
    this.courseData.push(courseData);
    //instead pushing here alone push and store it in db
    //courseModel will be pushed
    //console.dir(courseData);
    this.courseRepository.save(courseData);
  }

  setCoursePlayListData(playList: PlayList[]) {
    this.courseData[
      this.findCourseIndexFromDashboard(this.playCourseId, this.courseData)
    ].coursePlayList = playList;
  }

  setPlayCourseId(id: string) {
    this.playCourseId = id;
  }

  removeCourseData(id) {
    var self = this;
    this.courseData = this.courseData.filter(function(dashboardItr) {
      if (dashboardItr._id == id) {
        //var dashboardRemoveObj: Course = Object.create(dashboardItr);
        //console.dir(dashboardItr);
        self.courseRepository.delete(dashboardItr);
      }
      return dashboardItr._id !== id;
    });
    this.resumePlayerCourseData = this.resumePlayerCourseData.filter(function(
      resumePlayerData
    ) {
      if (resumePlayerData.courseId == id) {
        //var dashboardRemoveObj: Course = Object.create(dashboardItr);
        //console.dir(resumePlayerData);
        self.resumeCourseRepository.delete(resumePlayerData);
      }
      return resumePlayerData.courseId !== id;
    });
  }

  updateCourseData(oldCourseData: CourseModel, newCourseData: CourseModel) {
    this.courseRepository.update(oldCourseData, newCourseData);
  }

  setResumePlayerCourseData(resumePlayerCourseData: ResumePlayerModel[]) {
    this.resumePlayerCourseData = resumePlayerCourseData;
  }

  addResumeCourseInfo(resumePlayerData: ResumePlayerModel) {
    resumePlayerData.courseId = this.playCourseId;
    if (this.resumePlayerCourseData.length > 0) {
      var index = this.findCourseIndexFromDashboard(
        this.playCourseId,
        this.courseData
      );
      if (index > this.resumePlayerCourseData.length - 1) {
        this.resumePlayerCourseData.push(resumePlayerData);
        this.resumeCourseRepository.save(resumePlayerData);
      } else {
        //debugger;
        let oldResumePlayerCourseData = this.resumePlayerCourseData[index];
        console.log(oldResumePlayerCourseData);
        console.log(resumePlayerData);
        this.resumeCourseRepository.update(
          oldResumePlayerCourseData,
          resumePlayerData
        );
        this.resumePlayerCourseData[index] = resumePlayerData;
      }
    } else {
      this.resumePlayerCourseData.push(resumePlayerData);
      this.resumeCourseRepository.save(resumePlayerData);
    }
  }
  getResumeCourseInfo() {
    // debugger;
    if (this.resumePlayerCourseData.length > 0) {
      var index = this.findCourseIndexFromDashboard(
        this.playCourseId,
        this.courseData
      );
      if (index > this.resumePlayerCourseData.length - 1) {
        return new ResumePlayerModel();
      }
      return this.resumePlayerCourseData[index];
    }
    return new ResumePlayerModel();
  }

  findCourseIndexFromDashboard(id, dashboardData: CourseModel[]) {
    let arrayIndex = 0;
    dashboardData.find(function(dashboardItr, index) {
      arrayIndex = index;
      return dashboardItr._id === id;
    });
    return arrayIndex;
  }
}
