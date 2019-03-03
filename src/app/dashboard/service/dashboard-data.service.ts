import { CourseRepository } from '../repository/course.repository';
import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';
import { ResumeCourseRepository } from '../repository/resume-course.repository';
import { ResumePlayerModel } from '../../player/model/resume-player.model';
import { AppConfRepository } from '../../config/repository/app-conf.repository';
import { AppConfigurationModel } from '../../config/model/app-conf.model';

const VIDEO_CONF_COLUMN_APP = 'app';
const VIDEO_CONF_COLUMN_APP_VALUE = 'vdemy';
@Injectable()
export class DashboardDataService {
  constructor(
    private courseRepository: CourseRepository,
    private resumeCourseRepository: ResumeCourseRepository,
    private appConfRepository: AppConfRepository
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

  selectAppConf() {
    return this.appConfRepository.selectOneByColumnSync(
      VIDEO_CONF_COLUMN_APP,
      VIDEO_CONF_COLUMN_APP_VALUE
    );
  }
  saveAppConfData(
    appConf: AppConfigurationModel
  ): Promise<AppConfigurationModel> {
    return this.appConfRepository.save(appConf);
  }
  updateAppConfData(
    oldConf: AppConfigurationModel,
    newConf: AppConfigurationModel
  ) {
    this.appConfRepository.update(oldConf, newConf);
    this.appConfRepository.compactDatabase();
  }
}
