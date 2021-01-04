import { MbscScrollerBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { Timespan, MbscTimespanOptions } from './presets/timespan';
export { MbscTimespanOptions };
export declare class MbscTimespan extends MbscScrollerBase {
    optionService: MbscOptionsService;
    instance: Timespan;
    defaultValue: number;
    max: number;
    min: number;
    steps: Array<number>;
    useShortLabels: boolean;
    wheelOrder: string;
    labels: Array<string>;
    labelsShort: Array<string>;
    options: MbscTimespanOptions;
    value: number;
    onChangeEmitter: EventEmitter<number>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: number): void;
    initControl(): void;
}
export declare class MbscTimespanComponent extends MbscTimespan {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscTimespanOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscTimespanModule {
}
