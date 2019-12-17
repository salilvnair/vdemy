import { NgModule, Injector } from '@angular/core';
import { VdemyModule } from './module/vdemy.module';
import { VdemyOfflineComponent } from './vdemy-offline.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [VdemyOfflineComponent],
  imports: [VdemyModule],
  entryComponents: [VdemyOfflineComponent]
})
export class VdemyOfflineModule { 
  constructor(private injector: Injector ){
    const vdemyOffline = createCustomElement(VdemyOfflineComponent, { injector });
    // Register the custom element with the browser.
    customElements.define('vdemy-offline', vdemyOffline);

  
  }
}
