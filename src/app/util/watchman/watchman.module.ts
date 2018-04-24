import { ModuleWithProviders, NgModule } from '@angular/core';
import { WatchmanService } from './watchman.service';
import { WatchmanConfig } from './watchman.config';

@NgModule({
  providers: [WatchmanService]
})
export class WatchmanModule {
  static init(config: WatchmanConfig): ModuleWithProviders {
    return {
      ngModule: WatchmanModule,
      providers: [{ provide: WatchmanConfig, useValue: config }]
    };
  }
}
