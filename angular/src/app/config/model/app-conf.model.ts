import { Database } from "../../util/tsc-repository/core/nedb";

@Database('app-conf')
export class AppConfigurationModel {
  _id: string;
  app:string ='vdemy';
  videoFormats: string[];
  allowedOtherFormats: string[];
}