
import { VdemyUpdaterConfig } from "./vdemy-updater.model";
import { NgxElectronUpdater } from "@ngxeu/core";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})
export class VdemyUpdater extends NgxElectronUpdater<VdemyUpdaterConfig>{
    entityInstance(): VdemyUpdaterConfig {
        return new VdemyUpdaterConfig();
    }

    appName():string {
        return "vdemy";
    }
}