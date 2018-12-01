import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { NeDBConfig } from '../model/nedb-config.model';
import * as NeDBConstant from '../constant/nedb.constant';
import * as TSCConstant from '../../../constant/tsc.constant';
//import * as Datastore from 'nedb';
@Injectable()
export class NeDBConnectionManager {
  private dbSourceInstance;
  private dbFileName;
  constructor(private _electronService: ElectronService) {}

  getInstance() {
    return this.getDefinedInstance(
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DEFAULT_DB_FILE_NAME
    );
  }

  getDefinedInstance(databaseFolderName: string, databaseFileName) {
    var app = this._electronService.remote.require('electron').app;
    var path = this._electronService.remote.require('path');
    var pathDetail = path.join(
      app.getAppPath(),
      TSCConstant.TSS_FOLDER_NAME,
      databaseFolderName,
      databaseFileName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
    );
     var Datastore = this._electronService.remote.getGlobal(
       TSCConstant.NODEJS_GLOBAL_TSC_REPOSITORY
     ).nedb;
    //let db = new Datastore();
    var dbSourceInstance = new Datastore({
      filename: pathDetail,
      autoload: true
    });
    return dbSourceInstance;
  }

  getInMemoryInstance() {
    var Datastore = this._electronService.remote.getGlobal(
      TSCConstant.NODEJS_GLOBAL_TSC_REPOSITORY
    ).nedb;
    var dbSourceInstance = new Datastore();
  }

  public getNeDBConfig(): NeDBConfig {
    var app = this._electronService.remote.require('electron').app;
    var path = this._electronService.remote.require('path');
    var configPathDetail = path.join(
      app.getAppPath(),
      TSCConstant.TSS_FOLDER_NAME,
      TSCConstant.TSS_SUBFOLDER_CONFIG,
      TSCConstant.TSS_PROVIDER_CONFIG_NEDB
    );
    var fs = this._electronService.remote.require('fs');
    var config = JSON.parse(fs.readFileSync(configPathDetail, 'utf8'));
    return config;
  }
}
