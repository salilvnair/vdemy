import { NeDBRepository } from '../../util/tsc-repository/core/nedb';
import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';

@Injectable()
export class CourseRepository extends NeDBRepository<CourseModel> {
  returnEntityInstance(): CourseModel {
    return new CourseModel();
  }
}
