import { MbscScrollerBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { MbscNumberOptions, NumberScroller } from './presets/number';
export { MbscNumberOptions };
export declare class MbscNumber extends MbscScrollerBase {
    optionService: MbscOptionsService;
    instance: NumberScroller;
    defaultValue: string;
    invalid: Array<any>;
    max: number;
    min: number;
    scale: number;
    step: number;
    wholeText: string;
    fractionText: string;
    signText: string;
    options: MbscNumberOptions;
    value: any;
    onChangeEmitter: EventEmitter<number>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: any): void;
    initControl(): void;
}
export declare class MbscNumberComponent extends MbscNumber {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscNumberOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscNumberModule {
}
