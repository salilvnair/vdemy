import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { UtilityModule } from './utility.module';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WatchmanModule } from '../util/watchman/watchman.module';
const IMPORT_EXPORT_ARRAY = [
  NgxElectronModule,
  UtilityModule,
  MaterialModule,
  FlexLayoutModule
];

@NgModule({
  imports: [IMPORT_EXPORT_ARRAY],
  exports: [IMPORT_EXPORT_ARRAY]
})
export class ExternalLibraryModules {}
