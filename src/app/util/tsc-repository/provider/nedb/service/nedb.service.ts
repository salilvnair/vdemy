import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import * as TSCConstant from '../../../constant/tsc.constant';
import * as NeDBConstant from '../constant/nedb.constant';
import { MY_PROPERTY_DECORATOR_KEY } from '../decorator/identifier.metadata';
@Injectable()
export class NeDBService<T> {
  constructor(private electronService: ElectronService) {}
  selectAllSync(databaseName: string): T[] {
    var self = this;
    var rows: T[] = [];
    var app = this.electronService.remote.require('electron').app;
    var path = this.electronService.remote.require('path');
    var configPathDetail = path.join(
      app.getAppPath(),
      TSCConstant.TSS_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      databaseName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
    );
    var fs = this.electronService.remote.require('fs');
    var data = fs.readFileSync(configPathDetail, 'utf8');
    if (data == '' || data == null) {
      return rows;
    }
    var arr: string[] = data.trim().split(/\r|\n/);
    //console.dir(arr);
    var changeintoarrayString = JSON.stringify(arr);
    arr.forEach(el => {
      var eld = JSON.parse(el);
      //console.dir(eld);
      rows.push(eld);
    });
    return rows;
  }

  selectOneSync(id: string, databaseName: string): T {
    var row: T = Object.assign(null);
    var rows: T[] = this.selectAllSync(databaseName);
    if (rows.length > 0) {
      rows.find(function(rowItr, index) {
        return rowItr['_id'] === id;
      });
    }
    return row;
  }
  selectOneByColumnSync(
    columnName: string,
    columnValue: string,
    databaseName: string
  ): T {
    debugger;
    var row: T = <T>{};
    var rows: T[] = this.selectAllSync(databaseName);
    if (rows.length > 0) {
      var index = rows.findIndex(rowItr => rowItr[columnName] === columnValue);
      if (index > -1) {
        row = rows[index];
      }
      // row = rows.find(function(rowItr, index) {
      //   return rowItr[columnName] === columnValue;
      // });
    }
    return row;
  }
  generateUniqueId(entity: T) {
    const metadata = Reflect.getMetadata(
      MY_PROPERTY_DECORATOR_KEY,
      entity.constructor
    );
  }
}
