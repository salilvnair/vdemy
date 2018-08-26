import { NeDBRepository } from '../../util/tsc-repository/core/nedb';
import { Injectable } from '@angular/core';
import { ResumePlayerModel } from '../../player/model/resume-player.model';

@Injectable()
export class ResumeCourseRepository extends NeDBRepository<ResumePlayerModel> {
  returnEntityInstance(): ResumePlayerModel {
    return new ResumePlayerModel();
  }
}
