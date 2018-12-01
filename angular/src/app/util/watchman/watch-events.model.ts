import { EventTargetLike } from 'rxjs/observable/FromEventObservable';

export class WatchEvent {
  event: EventTargetLike;
  eventName: string;
}
