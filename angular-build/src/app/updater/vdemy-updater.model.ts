import { ReleaseInfo, Provider } from "@ngxeu/core";


export class VdemyUpdaterConfig {
    @ReleaseInfo({
        user:"salilvnair",
        repo:"vdemy",
        provider:Provider.github
    }) 
    gitReleaseUrl:string;
    downloadSuffix:string;

}