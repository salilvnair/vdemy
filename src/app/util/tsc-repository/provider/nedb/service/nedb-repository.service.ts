import { ITypeScriptWriteRespository } from '../../../service/tsw-respository.service';
import { ITypeScriptReadRespository } from '../../../service/tsr-repository.service';
import { NeDBError } from '../model/nedb-error.model';
import { Component, Injectable } from '@angular/core';
import { JsonCommonUtil } from '../util/json-common.util';
import { NeDBConnectionManager } from './nedb-manager.service';
import { NeDBConfig } from '../model/nedb-config.model';
import * as NeDBConstant from '../constant/nedb.constant';
import * as TSCConstant from '../../../constant/tsc.constant';
import { MY_PROPERTY_DECORATOR_KEY } from '../decorator/identifier.metadata';
import { ElectronService } from 'ngx-electron';
import { NeDBService } from './nedb.service';
@Injectable()
export abstract class NeDBRepository<T>
  implements ITypeScriptWriteRespository<T>, ITypeScriptReadRespository<T> {
  private initializedNeDB: boolean = false;
  private initializedNeDBConfig: boolean = false;
  constructor(
    private neDBConnectionManager: NeDBConnectionManager,
    private neDBService: NeDBService
  ) {
    this.init();
  }
  private neDB;
  private neDBConfig: NeDBConfig;
  abstract returnEntityInstance(): T;
  private init() {
    //debugger;
    if (!this.initializedNeDBConfig) {
      this.initNeDBConfig();
      this.initializedNeDBConfig = true;
    }
    if (!this.initializedNeDB) {
      this.initNeDb();
      this.initializedNeDB = true;
    }
  }
  private initNeDb() {
    if (this.neDBConfig.createExplicitDB) {
      this.initExplicitDB();
    } else {
      this.initAppDefinedDB();
    }
  }

  public setPersistance(inMemory: boolean) {
    if (inMemory) {
      this.neDB = this.neDBConnectionManager.getInMemoryInstance();
    } else {
      this.initExplicitDB();
    }
  }

  private initExplicitDB() {
    this.neDB = this.neDBConnectionManager.getDefinedInstance(
      this.getDatabaseFolderName(),
      this.getDatabaseNameFromRepo()
    );
  }

  private initAppDefinedDB() {
    this.neDB = this.neDBConnectionManager.getInstance();
  }

  private getDatabaseNameFromRepo() {
    let value: string = Reflect.getMetadata(
      'Database',
      this.returnEntityInstance().constructor
    );
    if (value) {
      return value.toLocaleLowerCase();
    }
    return value;
  }

  private getDatabaseFolderName() {
    //get the it from appRoot/ts-repo/config/nedb.config.json
    return NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME;
  }

  private initNeDBConfig() {
    //get the it from appRoot/ts-repo/config/nedb.config.json
    this.neDBConfig = this.neDBConnectionManager.getNeDBConfig();
  }

  compactDatabase() {
    this.neDB.persistence.compactDatafile();
  }

  find(entity: T): Promise<T[]> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.find(entity, { multi: true }, function(err, entityDatas) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityDatas);
      });
    });
    //throw new Error('Method not implemented.');
  }
  selectAll(): Promise<T[]> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.find({}, function(err, entityDatas) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityDatas);
      });
    });
    //throw new Error('Method not implemented.');
  }
  selectAllSync(): T[] {
    return this.neDBService.selectAllSync(this.getDatabaseNameFromRepo());
  }

  findOne(id: string): Promise<T> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.find({ _id: id }, function(err, entityData) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityData);
      });
    });
    //throw new Error('Method not implemented.');
  }
  update(oldEntity: T, newEntity: T): Promise<T> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.update(oldEntity, newEntity, {}, function(err, entityData) {
        if (err !== null) {
          console.dir(err);
          return reject(err);
        }
        resolve(entityData);
      });
    });
  }
  save(entity: T): Promise<T> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.insert(entity, function(err, entityData) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityData);
      });
    });
  }

  generateUniqueId(entity: T) {
    const metadata = Reflect.getMetadata(
      MY_PROPERTY_DECORATOR_KEY,
      entity.constructor
    );
  }

  // update(id: string, entity: T): Promise<T> {
  //   return this.save(entity);
  //   //throw new Error('Method not implemented.');
  // }
  delete(
    entity: T,
    removeNullValues?: boolean,
    removeEmptyValues?: boolean
  ): Promise<number> {
    var self = this;
    if (removeNullValues) {
      JsonCommonUtil.removeNullValues(entity);
    } else if (removeEmptyValues) {
      JsonCommonUtil.removeEmptyValues(entity);
    }
    if (removeEmptyValues && removeNullValues) {
      JsonCommonUtil.removeNEValues(entity);
    }
    return new Promise(function(resolve, reject) {
      self.neDB.remove(entity, { multi: true }, function(err, deleteCount) {
        if (err !== null) return reject(err);
        resolve(deleteCount);
      });
    });
    //throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<number> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.remove({ _id: id }, function(err, deleteCount) {
        if (err !== null) return reject(err);
        resolve(deleteCount);
      });
    });
    //throw new Error("Method not implemented.");
  }
  deleteAll(): Promise<number> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.remove({}, { multi: true }, function(err, deleteCount) {
        if (err !== null) return reject(err);
        resolve(deleteCount);
      });
    });
    //throw new Error("Method not implemented.");
  }
}
