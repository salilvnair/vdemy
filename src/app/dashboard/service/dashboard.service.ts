import { Injectable } from '@angular/core';
import { ICourseModel } from '../course/model/course.model';

@Injectable()
export class DashboardService {
  private courseData: ICourseModel[] = [];
  public playCourseId: number = 1;

  getCourseData() {
    return this.courseData;
  }

  setCoursedata(courseData: ICourseModel) {
    this.courseData.push(courseData);
  }

  setPlayCourseId(id: number) {
    this.playCourseId = id;
  }
}
