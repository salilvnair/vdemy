import { Database } from "@salilvnair/ngpa";

@Database('app-conf')
export class AppConfigurationModel {
  _id: string;
  app:string ='vdemy';
  videoFormats: string[];
  allowedOtherFormats: string[];
}