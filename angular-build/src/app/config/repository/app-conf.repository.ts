import { Injectable } from '@angular/core';
import { AppConfigurationModel } from '../model/app-conf.model';
import { NeDBRepository } from '@salilvnair/ngpa';


@Injectable()
export class AppConfRepository extends NeDBRepository<AppConfigurationModel> {
  returnEntityInstance(): AppConfigurationModel {
    return new AppConfigurationModel();
  }
}
