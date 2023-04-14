import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent implements OnInit, OnDestroy {
  @Input()
  public timePassed!: number;

  @Output()
  public timePassedChange: EventEmitter<number>;

  @Input()
  public maxDuration!: number;

  @Input()
  public animationFolderPath!: string;

  @Input()
  public imageCount!: number;

  private animationFolderBasePath: string;
  private millisecondsBetweenEachTick: number;
  private timeout?: NodeJS.Timer;

  public constructor() {
    this.timePassedChange = new EventEmitter();
    this.animationFolderBasePath = 'assets/images/animations/';
    this.millisecondsBetweenEachTick = 50;
  }

  public ngOnDestroy(): void {
    clearInterval(this.timeout);
  }

  public ngOnInit(): void {
    this.timeout = setInterval(() => {
      this.timePassed += this.millisecondsBetweenEachTick;
      if (this.timePassed >= this.maxDuration) {
        this.timePassed -= this.maxDuration;
      }
    }, this.millisecondsBetweenEachTick);
  }

  public getImagePath(): string {
    const imageNumber = Math.floor(this.timePassed / this.maxDuration * this.imageCount) + 1;
    return this.animationFolderBasePath + this.animationFolderPath + imageNumber.toString() + '.png';
  }
}
