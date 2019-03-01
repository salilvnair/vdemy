import { Database } from "@salilvnair/ngpa";

@Database('courseplayliststatus')
export class CoursePlayListStatusModel {
  _id: string;
  playListStatus: PlayListStatusModel[];
  courseId: string;
  totalDurationCompleted: number;
}
export class PlayListStatusModel {
  playListIndex: number;
  fileIndex: number;
  played: boolean = false;
}
