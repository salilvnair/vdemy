import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';
import { PlayList } from '../../player/model/playlist.model';
import { ResumePlayerModel } from '../../player/model/resume-player.model';
import { CourseRepository } from '../repository/course.repository';
//import { Subject } from 'rxjs/Subject';
import { DashboardDataService } from './dashboard-data.service';
import { ResumeCourseRepository } from '../repository/resume-course.repository';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DashboardService {
  public courseData: CourseModel[] = [];
  private courseDataSubject = new Subject<CourseModel>();
  public resumePlayerCourseData: ResumePlayerModel[] = [];
  public playCourseId: string = '';
  constructor(private dashboardDataService: DashboardDataService) {}

  //course data related services
  getCourseData(): CourseModel[] {
    return this.dashboardDataService.selectAllCourseDataSync();
  }
  setCourseData(courseData: CourseModel[]) {
    this.courseData = courseData;
  }
  addCoursedata(courseData: CourseModel) {
    var self = this;
    this.dashboardDataService
      .saveCourseData(courseData)
      .then(savedCourseData => {
        self.courseData.push(savedCourseData);
        self.courseDataSubject.next(savedCourseData);
      });
  }
  courseAddedEventPublisher() {
    return this.courseDataSubject.asObservable();
  }
  updateCourseData(oldCourseData: CourseModel, newCourseData: CourseModel) {
    this.dashboardDataService.updateCourseData(oldCourseData, newCourseData);
  }
  removeCourseData(id) {
    var self = this;
    this.courseData = this.courseData.filter(function(courseDataItr) {
      if (courseDataItr._id == id) {
        self.dashboardDataService.deleteCourseData(courseDataItr);
      }
      return courseDataItr._id !== id;
    });
    this.resumePlayerCourseData = this.resumePlayerCourseData.filter(function(
      resumePlayerData
    ) {
      if (resumePlayerData.courseId == id) {
        self.dashboardDataService.deleteResumeCourseData(resumePlayerData);
      }
      return resumePlayerData.courseId !== id;
    });
  }
  setCoursePlayListData(playList: PlayList[]) {
    this.courseData[
      this.findCourseIndexFromDashboard(this.playCourseId, this.courseData)
    ].coursePlayList = playList;
  }
  setPlayCourseId(id: string) {
    this.playCourseId = id;
  }

  //resume playlist data related services
  selectAllResumeCourseData(): Promise<ResumePlayerModel[]> {
    return this.dashboardDataService.selectAllResumeCourseData();
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
        this.dashboardDataService.saveResumeCourseData(resumePlayerData);
      } else {
        let oldResumePlayerCourseData = this.resumePlayerCourseData[index];
        this.dashboardDataService.updateResumeCourseData(
          oldResumePlayerCourseData,
          resumePlayerData
        );
        this.resumePlayerCourseData[index] = resumePlayerData;
      }
    } else {
      this.resumePlayerCourseData.push(resumePlayerData);
      this.dashboardDataService.saveResumeCourseData(resumePlayerData);
    }
  }
  getResumeCourseData() {
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

  //util function to find course index from CourseData
  findCourseIndexFromDashboard(id, courseData: CourseModel[]) {
    let arrayIndex = 0;
    courseData.find(function(courseItr, index) {
      arrayIndex = index;
      return courseItr._id === id;
    });
    return arrayIndex;
  }
}
