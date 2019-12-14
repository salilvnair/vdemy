import { Database } from "@salilvnair/ngpa";

@Database('resumecourse')
export class ResumePlayerModel {
  _Id: string;
  courseId: string = '';
  playListIndex: number = 0;
  fileIndex: number = 0;
  resumeFromTime: number = 0;
  playerSpeed: number = 1;
}
