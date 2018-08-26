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
  selectAllCourseData(): Promise<CourseModel[]> {
    return this.courseRepository.selectAll();
  }
  selectAllCourseDataSync(): CourseModel[] {
    return this.courseRepository.selectAllSync();
  }

  saveCourseData(courseData: CourseModel): Promise<CourseModel> {
    return this.courseRepository.save(courseData);
  }

  updateCourseData(oldCourseData: CourseModel, newCourseData: CourseModel) {
    this.courseRepository.update(oldCourseData, newCourseData);
    this.courseRepository.compactDatabase();
  }

  deleteCourseData(courseData: CourseModel) {
    this.courseRepository.delete(courseData);
    this.courseRepository.compactDatabase();
  }

  selectAllResumeCourseData(): Promise<ResumePlayerModel[]> {
    return this.resumeCourseRepository.selectAll();
  }

  saveResumeCourseData(
    courseData: ResumePlayerModel
  ): Promise<ResumePlayerModel> {
    return this.resumeCourseRepository.save(courseData);
  }

  updateResumeCourseData(
    oldResumeCourseData: ResumePlayerModel,
    newResumeCourseData: ResumePlayerModel
  ) {
    this.resumeCourseRepository.update(
      oldResumeCourseData,
      newResumeCourseData
    );
    this.resumeCourseRepository.compactDatabase();
  }

  deleteResumeCourseData(resumePlayerData: ResumePlayerModel) {
    this.resumeCourseRepository.delete(resumePlayerData);
    this.courseRepository.compactDatabase();
  }
}
