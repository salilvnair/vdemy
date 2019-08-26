import { NeDBRepository } from "@salilvnair/ngpa";
import { Injectable } from '@angular/core';
import { CourseModel } from '../course/model/course.model';

@Injectable()
export class CourseRepository extends NeDBRepository<CourseModel> {
  returnEntityInstance(): CourseModel {
    return new CourseModel();
  }
}
