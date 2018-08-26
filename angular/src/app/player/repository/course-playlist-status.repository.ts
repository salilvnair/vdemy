import { NeDBRepository } from '../../util/tsc-repository/core/nedb/index';
import { CoursePlayListStatusModel } from '../model/course-playlist-status.model';

export class CoursePlayListStatusRepository extends NeDBRepository<
  CoursePlayListStatusModel
> {
  returnEntityInstance(): CoursePlayListStatusModel {
    return new CoursePlayListStatusModel();
  }
}
