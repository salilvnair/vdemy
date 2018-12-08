import { NeDBRepository } from '../../util/tsc-repository/core/nedb';
import { Injectable } from '@angular/core';
import { AppConfigurationModel } from '../model/app-conf.model';


@Injectable()
export class AppConfRepository extends NeDBRepository<AppConfigurationModel> {
  returnEntityInstance(): AppConfigurationModel {
    return new AppConfigurationModel();
  }
}
