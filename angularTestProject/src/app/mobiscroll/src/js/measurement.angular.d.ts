import { MbscScrollerBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import './presets/temperature';
import './presets/distance';
import './presets/speed';
import './presets/force';
import './presets/mass';
import { MbscMeasurementOptions, Measurement } from './presets/measurement';
import { Temperature, MbscTemperatureOptions } from './presets/temperature';
import { Distance, MbscDistanceOptions } from './presets/distance';
import { Speed, MbscSpeedOptions } from './presets/speed';
import { Mass, MbscMassOptions } from './presets/mass';
import { Force, MbscForceOptions } from './presets/force';
export { MbscMeasurementOptions, MbscTemperatureOptions, MbscDistanceOptions, MbscSpeedOptions, MbscMassOptions, MbscForceOptions };
export declare class MbscMeasurementBase extends MbscScrollerBase {
    optionService: MbscOptionsService;
    max: number;
    min: number;
    defaultValue: string;
    invalid: Array<any>;
    scale: number;
    step: number;
    defaultUnit: string;
    unitNames: any;
    units: Array<string>;
    wholeText: string;
    fractionText: string;
    signText: string;
    protected preset: string;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    setNewValue(v: string): void;
    initControl(): void;
}
export declare class MbscMeasurementChild extends MbscMeasurementBase {
    convert: boolean;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscMeasurement extends MbscMeasurementBase {
    instance: Measurement;
    convert: (val: number, unit1: string, unit2: string) => number;
    options: MbscMeasurementOptions;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscMeasurementComponent extends MbscMeasurement {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscMeasurementOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscTemperature extends MbscMeasurementChild {
    instance: Temperature;
    options: MbscTemperatureOptions;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscTemperatureComponent extends MbscTemperature {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscTemperatureOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscDistance extends MbscMeasurementBase {
    instance: Distance;
    options: MbscDistanceOptions;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscDistanceComponent extends MbscDistance {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscDistanceOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscSpeed extends MbscMeasurementBase {
    instance: Speed;
    options: MbscSpeedOptions;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscSpeedComponent extends MbscSpeed {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscSpeedOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscForce extends MbscMeasurementBase {
    instance: Force;
    options: MbscForceOptions;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscForceComponent extends MbscForce {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscForceOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscMass extends MbscMeasurementBase {
    instance: Mass;
    options: MbscMassOptions;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
}
export declare class MbscMassComponent extends MbscMass {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscMassOptions;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscMeasurementModule {
}
