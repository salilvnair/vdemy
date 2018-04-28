import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WatchmanModule } from './util/watchman/watchman.module';
import { VdemyModule } from './module/vdemy.module';

@NgModule({
  declarations: [AppComponent],
  imports: [VdemyModule, WatchmanModule.init({ idleTime: 300, timeout: 90 })],
  bootstrap: [AppComponent]
})
export class AppModule {}
