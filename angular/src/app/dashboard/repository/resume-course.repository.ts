import { NeDBRepository } from "@salilvnair/ngpa";
import { Injectable } from '@angular/core';
import { ResumePlayerModel } from '../../player/model/resume-player.model';

@Injectable()
export class ResumeCourseRepository extends NeDBRepository<ResumePlayerModel> {
  returnEntityInstance(): ResumePlayerModel {
    return new ResumePlayerModel();
  }
}
