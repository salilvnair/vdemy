export class PlayList {
  folderName: string;
  fileContent: FileContent[];
}

export class FileContent {
  fileName: string;
  fileLocation: string;
  totalDuration?: number;
  resumeFromTime?: number;
  played?: boolean = false;
}
