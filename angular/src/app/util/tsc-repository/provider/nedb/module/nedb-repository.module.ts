import { NgModule } from '@angular/core';
import { NeDBConnectionManager } from '../service/nedb-manager.service';
import { NeDBService } from '../service/nedb.service';

@NgModule({
  providers: [NeDBConnectionManager, NeDBService]
})
export class NeDBRepositoryModule {}
