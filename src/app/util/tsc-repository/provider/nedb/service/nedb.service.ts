import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import * as TSCConstant from '../../../constant/tsc.constant';
import * as NeDBConstant from '../constant/nedb.constant';
@Injectable()
export class NeDBService {
  constructor(private electronService: ElectronService) {}
  selectAllSync(databaseName: string) {
    var self = this;
    var app = this.electronService.remote.require('electron').app;
    var path = this.electronService.remote.require('path');
    var configPathDetail = path.join(
      app.getAppPath(),
      TSCConstant.TSS_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      databaseName + '.db'
    );
    var fs = this.electronService.remote.require('fs');
    var data = fs.readFileSync(configPathDetail, 'utf8');
    var arr: string[] = data.trim().split(/\r|\n/);
    console.dir(arr);
    var changeintoarrayString = JSON.stringify(arr);
    var config = [];
    arr.forEach(el => {
      var eld = JSON.parse(el);
      console.dir(eld);
      config.push(eld);
    });
    return config;
  }
}
