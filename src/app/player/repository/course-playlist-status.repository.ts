import { NeDBRepository } from "@salilvnair/ngpa";
import { CoursePlayListStatusModel } from '../model/course-playlist-status.model';

export class CoursePlayListStatusRepository extends NeDBRepository<
  CoursePlayListStatusModel
> {
  returnEntityInstance(): CoursePlayListStatusModel {
    return new CoursePlayListStatusModel();
  }
}
