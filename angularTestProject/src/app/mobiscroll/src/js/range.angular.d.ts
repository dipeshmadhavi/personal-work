import { ElementRef, NgZone, NgControl, EventEmitter, MbscInputService, MbscOptionsService, ControlValueAccessor, ViewContainerRef } from './frameworks/angular';
import { RangePicker, MbscRangeOptions } from './presets/range';
import { MbscCalBase } from './classes/calbase.angular';
export { MbscRangeOptions };
export declare class MbscRangeStartComponent implements ControlValueAccessor {
    host: ElementRef;
    parent: MbscRangeComponent;
    zone: NgZone;
    control: NgControl;
    theme: string;
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    disabled: boolean;
    placeholder: string;
    readonly element: any;
    rangeIndex: 0 | 1;
    oldAccessor: any;
    constructor(host: ElementRef, parent: MbscRangeComponent, zone: NgZone, control: NgControl);
    checkAccessor(): void;
    handleChange(): void;
    ngAfterViewInit(): void;
    onChange: any;
    onTouch: any;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    initialSet: boolean;
    writeValue(v: any): void;
}
export declare class MbscRangeEndComponent extends MbscRangeStartComponent {
    rangeIndex: 0 | 1;
    constructor(el: ElementRef, parent: MbscRangeComponent, zone: NgZone, control: NgControl);
}
export declare class MbscRange extends MbscCalBase {
    optionService: MbscOptionsService;
    _wrapper: boolean;
    instance: RangePicker;
    _startInput: string | HTMLElement;
    _endInput: string | HTMLElement;
    autoCorrect: boolean;
    controls?: Array<'time' | 'date' | 'calendar'>;
    endInput: string | HTMLElement;
    maxRange: number;
    minRange: number;
    showSelector: boolean;
    startInput: string | HTMLElement;
    fromText: string;
    toText: string;
    onSetDate: EventEmitter<{
        date: Date;
        active: 'start' | 'end';
        control: 'calendar' | 'date' | 'time';
        inst: any;
    }>;
    onDayChange: EventEmitter<{
        date: Date;
        marked?: any;
        selected?: 'start' | 'end';
        target: HTMLElement;
        inst: any;
    }>;
    start: MbscRangeStartComponent;
    end: MbscRangeEndComponent;
    options: MbscRangeOptions;
    value: Array<any>;
    onChangeEmitter: EventEmitter<Array<any>>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: Array<any>): void;
    readonly optionExtensions: any;
    initControl(): void;
    ngAfterContentInit(): void;
    handleChange(): void;
}
export declare class MbscRangeComponent extends MbscRange {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscRangeOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscRangeModule {
}
