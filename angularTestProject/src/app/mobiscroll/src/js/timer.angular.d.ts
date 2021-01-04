import { MbscScrollerBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { Timer, MbscTimerOptions } from './presets/timer';
export { MbscTimerOptions };
export declare class MbscTimer extends MbscScrollerBase {
    optionService: MbscOptionsService;
    instance: Timer;
    autostart: boolean;
    maxWheel: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds' | 'fract';
    mode: 'countdown' | 'stopwatch';
    step: number;
    targetTime: number;
    useShortLabels: boolean;
    hideText: string;
    labels: Array<string>;
    labelsShort: Array<string>;
    lapText: string;
    resetText: string;
    startText: string;
    stopText: string;
    onLap: EventEmitter<{
        ellapsed: number;
        lap: number;
        laps: Array<number>;
        inst: any;
    }>;
    onFinish: EventEmitter<{
        time: number;
        inst: any;
    }>;
    onReset: EventEmitter<{
        inst: any;
    }>;
    onStart: EventEmitter<{
        inst: any;
    }>;
    onStop: EventEmitter<{
        ellapsed: number;
        inst: any;
    }>;
    options: MbscTimerOptions;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: any): void;
    protected handleChange(): void;
    initControl(): void;
}
export declare class MbscTimerComponent extends MbscTimer {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscTimerOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscTimerModule {
}
