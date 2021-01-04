import { MbscFrameBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { Numpad, MbscNumpadOptions, MbscNumpadDateOptions, MbscNumpadTimeOptions, MbscNumpadDecimalOptions, MbscNumpadTimespanOptions } from './classes/numpad';
export { MbscNumpadOptions, MbscNumpadDateOptions, MbscNumpadTimeOptions, MbscNumpadDecimalOptions, MbscNumpadTimespanOptions };
export declare abstract class MbscNumpadBase extends MbscFrameBase {
    optionService: MbscOptionsService;
    instance: Numpad;
    allowLeadingZero: boolean;
    deleteIcon: string;
    fill: 'ltr' | 'rtl';
    leftKey: {
        text: string;
        variable?: string;
        value?: string;
    };
    mask: string;
    placeholderChar: string;
    rightKey: {
        text: string;
        variable?: string;
        value?: string;
    };
    template: string;
    validate: (data: {
        values: Array<any>;
        variables: any;
    }, inst: any) => ({
        disabled: Array<any>;
        invalid: boolean;
    });
    onSet: EventEmitter<{
        valueText: string;
        inst: any;
    }>;
    onClear: EventEmitter<{
        inst: any;
    }>;
    cancelText: string;
    clearText: string;
    setText: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscNumpad extends MbscNumpadBase {
    options: MbscNumpadOptions;
    protected preset: string;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: any): void;
    initControl(): void;
}
export declare class MbscNumpadComponent extends MbscNumpad {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscNumpadOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscNumpadDecimal extends MbscNumpad {
    value: any;
    decimalSeparator: string;
    defaultValue: number;
    invalid: Array<any>;
    scale: number;
    min: number;
    max: number;
    prefix: string;
    returnAffix: boolean;
    suffix: string;
    thousandsSeparator: string;
    options: MbscNumpadDecimalOptions;
    onChangeEmitter: EventEmitter<number>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscNumpadDecimalComponent extends MbscNumpadDecimal {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscNumpadDecimalOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscNumpadDate extends MbscNumpadBase {
    value: Date | '';
    dateFormat: string;
    dateOrder: string;
    delimiter: string;
    defaultValue: string;
    invalid: Array<any>;
    min: Date;
    max: Date;
    options: MbscNumpadDateOptions;
    onChangeEmitter: EventEmitter<Date>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: Date): void;
    initControl(): void;
}
export declare class MbscNumpadDateComponent extends MbscNumpadDate {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscNumpadDateOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscNumpadTime extends MbscNumpadBase {
    value: string;
    defaultValue: string;
    invalid: Array<any>;
    max: Date;
    min: Date;
    timeFormat: string;
    options: MbscNumpadTimeOptions;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: string): void;
    initControl(): void;
}
export declare class MbscNumpadTimeComponent extends MbscNumpadTime {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscNumpadTimeOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscNumpadTimespan extends MbscNumpad {
    value: number | '';
    defaultValue: number;
    invalid: Array<any>;
    min: number;
    max: number;
    options: MbscNumpadTimespanOptions;
    onChangeEmitter: EventEmitter<number>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscNumpadTimespanComponent extends MbscNumpadTimespan {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscNumpadTimespanOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscNumpadModule {
}
