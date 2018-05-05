import { CourseRepository } from '../repository/course.repository';
import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';
import { ResumeCourseRepository } from '../repository/resume-course.repository';
import { ResumePlayerModel } from '../../player/model/resume-player.model';
@Injectable()
export class DashboardDataService {
  constructor(
    private courseRepository: CourseRepository,
    private resumeCourseRepository: ResumeCourseRepository
  ) {}
  getCourseData(): Promise<CourseModel[]> {
    //console.log('getting from db');
    return this.courseRepository.selectAll();
  }

  getResumeCourseData(): Promise<ResumePlayerModel[]> {
    return this.resumeCourseRepository.selectAll();
  }
}
