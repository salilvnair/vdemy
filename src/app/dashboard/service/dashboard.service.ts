import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';
import { PlayList } from '../../player/model/playlist.model';
import { ResumePlayerModel } from '../../player/model/resume-player.model';

@Injectable()
export class DashboardService {
  private courseData: CourseModel[] = [];
  private resumePlayerCourseData: ResumePlayerModel[] = [];
  public playCourseId: number = 1;

  getCourseData() {
    return this.courseData;
  }

  addCoursedata(courseData: CourseModel) {
    this.courseData.push(courseData);
  }

  setCoursePlayListData(playList: PlayList[]) {
    this.courseData[
      this.findCourseIndexFromDashboard(this.playCourseId, this.courseData)
    ].coursePlayList = playList;
  }

  setPlayCourseId(id: number) {
    this.playCourseId = id;
  }

  removeCourseData(id) {
    this.courseData = this.courseData.filter(function(dashboardItr) {
      return dashboardItr.id !== id;
    });
  }

  addResumeCourseInfo(resumePlayerData: ResumePlayerModel) {
    resumePlayerData.courseId = this.playCourseId;
    if (this.resumePlayerCourseData.length > 0) {
      var index = this.findCourseIndexFromDashboard(
        this.playCourseId,
        this.courseData
      );
      this.resumePlayerCourseData[index] = resumePlayerData;
    } else {
      this.resumePlayerCourseData.push(resumePlayerData);
    }
  }
  getResumeCourseInfo() {
    if (this.resumePlayerCourseData.length > 0) {
      return this.resumePlayerCourseData[
        this.findCourseIndexFromDashboard(this.playCourseId, this.courseData)
      ];
    }
    return new ResumePlayerModel();
  }

  findCourseIndexFromDashboard(id, dashboardData: CourseModel[]) {
    let arrayIndex = 0;
    dashboardData.find(function(dashboardItr, index) {
      arrayIndex = index;
      return dashboardItr.id === id;
    });
    return arrayIndex;
  }
}
