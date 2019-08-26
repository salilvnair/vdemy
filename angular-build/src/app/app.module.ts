import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { VdemyModule } from './module/vdemy.module';

@NgModule({
  declarations: [AppComponent],
  imports: [VdemyModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
