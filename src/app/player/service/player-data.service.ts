import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PlayList } from '../model/playlist.model';
import { CoursePlayListStatusRepository } from '../repository/course-playlist-status.repository';
import { CoursePlayListStatusModel } from '../model/course-playlist-status.model';
const RESUME_COURSE_PLAYLIST_COLUMN_COURSE_ID = 'courseId';
@Injectable()
export class PlayerDataService {
  constructor(
    private coursePlayListStatusRepository: CoursePlayListStatusRepository
  ) {}

  selectCoursePlayListStatusSync(courseId: string): CoursePlayListStatusModel {
    return this.coursePlayListStatusRepository.selectOneByColumnSync(
      RESUME_COURSE_PLAYLIST_COLUMN_COURSE_ID,
      courseId
    );
  }
  saveCoursePlayListStatus(coursePlayListStatus: CoursePlayListStatusModel) {
    this.coursePlayListStatusRepository.save(coursePlayListStatus);
  }
  updateCoursePlayListStatus(
    oldCoursePlayListStatus: CoursePlayListStatusModel,
    newCoursePlayListStatus: CoursePlayListStatusModel
  ) {
    this.coursePlayListStatusRepository.update(
      oldCoursePlayListStatus,
      newCoursePlayListStatus
    );
    this.coursePlayListStatusRepository.compactDatabase();
  }
}
