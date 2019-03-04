import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { WatchmanConfig } from './watchman.config';
import { WatchEvent } from './watch-events.model';

@Injectable()
export class WatchmanService {
  private $_startWatching = new Subject<boolean>();
  private $_timeout = new Subject<boolean>();

  private readonly o$_Events: Observable<any>;
  private o$_idleTime: Observable<any>;
  private o$_watch: Observable<any>;
  private $$_idle: Subscription;

  private isTimerInactive: boolean;
  private timeout: number = 60;
  private idleTime: number = 120;
  private isTimedout: boolean;

  private watchEvents: WatchEvent[] = [
    { event: window, eventName: 'mousemove' },
    { event: window, eventName: 'resize' },
    { event: document, eventName: 'keydown' }
  ];

  constructor(@Optional() config: WatchmanConfig) {
    this.setWatchmanConfig(config);
    this.o$_Events = this.setUpWatchEvents([]);
    this.o$_idleTime = Observable.from(this.o$_Events);
  }

  setUpWatchEvents(watchEvents: WatchEvent[]) {
    let eventStreams = null;
    if (watchEvents) {
      this.watchEvents.concat(watchEvents);
    }
    eventStreams = this.watchEvents.map(watchEvent => {
      return Observable.fromEvent(watchEvent.event, watchEvent.eventName);
    });
    return Observable.merge(...eventStreams);
  }

  watch() {
    this.$$_idle = this.o$_idleTime
      .bufferTime(100)
      .filter(arr => !arr.length && !this.isTimerInactive)
      .switchMap(() => {
        this.isTimerInactive = true;
        return Observable.interval(1000)
          .takeUntil(
            Observable.merge(
              this.o$_Events,
              Observable.timer(this.idleTime * 1000).do(() =>
                this.$_startWatching.next(true)
              )
            )
          )
          .finally(() => (this.isTimerInactive = false));
      })
      .subscribe();
    this.setTimer(this.timeout);
  }

  stopWatching() {
    this.stopTimer();
    if (this.$$_idle) {
      this.$$_idle.unsubscribe();
    }
  }

  private setTimer(timeout: number) {
    this.o$_watch = Observable.interval(1000)
      .take(timeout)
      .map(() => 1)
      .scan((a, n) => a + n)
      .map(count => {
        if (count === timeout) {
          this.$_timeout.next(true);
        }
        return count;
      });
  }

  resetTimer() {
    this.stopTimer();
    this.isTimedout = false;
  }

  stopTimer() {
    this.$_startWatching.next(false);
  }

  afterIdleTime(): Observable<number> {
    return this.$_startWatching
      .distinctUntilChanged()
      .switchMap(start => (start ? this.o$_watch : Observable.of(null)));
  }

  onTimeout(): Observable<boolean> {
    return this.$_timeout.filter(timeout => !!timeout).map(() => {
      this.isTimedout = true;
      return true;
    });
  }

  getWatchmanConfig(): WatchmanConfig {
    return {
      idleTime: this.idleTime,
      timeout: this.timeout
    };
  }

  private setWatchmanConfig(config: WatchmanConfig) {
    if (config) {
      this.idleTime = config.idleTime;
      this.timeout = config.timeout;
    }
  }
  getFormattedTime(seconds) {
    // Hours, minutes and seconds
    if (seconds === NaN) {
      return '00:00';
    }
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    var secs = seconds % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var formattedTime = '';

    if (hrs > 0) {
      formattedTime += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    formattedTime += '' + mins + ':' + (secs < 10 ? '0' : '');
    formattedTime += '' + secs;
    return formattedTime;
  }
}
