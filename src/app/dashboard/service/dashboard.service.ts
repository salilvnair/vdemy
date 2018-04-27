import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';

@Injectable()
export class DashboardService {
  private courseData: CourseModel[] = [];
  public playCourseId: number = 1;

  getCourseData() {
    return this.courseData;
  }

  setCoursedata(courseData: CourseModel) {
    this.courseData.push(courseData);
  }

  setPlayCourseId(id: number) {
    this.playCourseId = id;
  }
}
