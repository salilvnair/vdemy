import { NgModule } from '@angular/core';
import { NeDBConnectionManager } from '../service/nedb-manager.service';

@NgModule({
  providers: [NeDBConnectionManager]
})
export class NeDBRepositoryModule {}
