import { MbscBase, MbscControlBase, NgZone, NgControl, ElementRef, EventEmitter, QueryList, OnInit, Observable, MbscInputService, MbscOptionsService, AfterViewInit, ChangeDetectorRef } from './frameworks/angular';
import { Form } from './classes/forms';
import { TextArea } from './classes/textarea';
import { Select } from './classes/select';
import { Button } from './classes/button';
import { CheckBox } from './classes/checkbox';
import { Switch } from './classes/switch';
import { Stepper } from './classes/stepper';
import { Progress } from './classes/progress';
import { Radio } from './classes/radio';
import { SegmentedItem } from './classes/segmented';
import { Slider } from './classes/slider';
import { Rating } from './classes/rating';
import { MbscFormOptions } from './classes/forms';
export { MbscFormOptions };
import { MbscInputBase, MbscFormValueBase, MbscFormBase, MbscInput } from './input.angular';
export { MbscInput };
export declare class MbscForm extends MbscBase implements OnInit {
    private _formService;
    private optionsObj;
    instance: Form;
    options: MbscFormOptions;
    enhance: boolean;
    context: string | HTMLElement;
    inputStyle: string;
    labelStyle: string;
    rootElem: ElementRef;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, zone: NgZone);
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscTextarea extends MbscInputBase {
    protected _inputService: MbscInputService;
    instance: TextArea;
    rows: number | string;
    wrap: 'hard' | 'soft' | 'off';
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _inputService: MbscInputService, _control: NgControl, zone: NgZone);
    initControl(): void;
}
export declare class MbscDropdown extends MbscFormValueBase {
    protected _inputService: MbscInputService;
    instance: Select;
    label: string;
    icon: string;
    iconAlign: string;
    value: any;
    inputStyle: string;
    labelStyle: string;
    constructor(hostElem: ElementRef, formService: MbscOptionsService, _inputService: MbscInputService, control: NgControl, zone: NgZone);
    initControl(): void;
    writeValue(v: any): void;
}
export declare class MbscButton extends MbscFormBase {
    instance: Button;
    _flat: boolean;
    _block: boolean;
    _outline: boolean;
    _classesObj: any;
    readonly cssClasses: any;
    classes: string;
    type: string;
    icon: string;
    flat: any;
    block: any;
    outline: any;
    constructor(hostElem: ElementRef, formService: MbscOptionsService, zone: NgZone);
    initControl(): void;
}
export declare class MbscCheckbox extends MbscFormValueBase {
    cdr: ChangeDetectorRef;
    instance: CheckBox;
    color: string;
    inputStyle: string;
    labelStyle: string;
    _colorClass: any;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, cdr: ChangeDetectorRef, formService: MbscOptionsService, control: NgControl, zone: NgZone);
    initControl(): void;
    writeValue(v: any): void;
}
export declare class MbscSwitch extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    instance: Switch;
    options: MbscFormOptions;
    disabled: boolean;
    name: string;
    color: string;
    error: boolean;
    errorMessage: string;
    value: boolean;
    onChangeEmitter: EventEmitter<boolean>;
    _initElem: ElementRef;
    _colorClass: any;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: boolean): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscStepper extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    instance: Stepper;
    _readonly: boolean;
    readonly: any;
    options: MbscFormOptions;
    value: number;
    name: string;
    min: number;
    max: number;
    step: number;
    val: string;
    disabled: boolean;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    onChangeEmitter: EventEmitter<number>;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscProgress extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    instance: Progress;
    options: MbscFormOptions;
    value: number;
    max: number;
    icon: string;
    iconAlign: string;
    val: string;
    disabled: boolean;
    stepLabels: Array<number>;
    readonly dataStepLabels: string | null;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscRadioService {
    private _name;
    name: string;
    private _multiSelect;
    multiSelect: boolean;
    private _lastValue;
    private _valueObservable;
    onValueChanged(): Observable<any>;
    changeValue(v: any): void;
    readonly getLastValue: any;
    private _color;
    color: string;
}
export declare class MbscRadioGroupBase extends MbscFormValueBase {
    _radioService: MbscRadioService;
    name: string;
    value: any;
    valueObserver: number;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService, control: NgControl, zone: NgZone);
    ngOnInit(): void;
    writeValue(v: any): void;
    updateOptions(): void;
    ngOnDestroy(): void;
}
export declare class MbscRadioGroup extends MbscRadioGroupBase {
    constructor(hostElement: ElementRef, formService: MbscOptionsService, radioService: MbscRadioService, control: NgControl, zone: NgZone);
}
export declare class MbscRadio extends MbscFormBase {
    private _radioService;
    instance: Radio;
    readonly checked: boolean;
    name: string;
    modelValue: any;
    color: string;
    value: any;
    error: boolean;
    errorMessage: string;
    _colorClass: any;
    readonly colorClass: any;
    clicked(e: any): void;
    valueObserver: number;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService, zone: NgZone);
    initControl(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscSegmentedGroup extends MbscRadioGroupBase {
    select: string;
    readonly multiSelect: boolean;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, radioService: MbscRadioService, control: NgControl, zone: NgZone);
    ngOnInit(): void;
}
export declare class MbscSegmented extends MbscFormBase {
    private _radioService;
    instance: SegmentedItem;
    readonly isChecked: boolean;
    name: string;
    modelValue: any;
    multiSelect: boolean;
    icon: string;
    value: any;
    checked: any;
    checkedChange: EventEmitter<any>;
    clicked(e: any): void;
    readonly cssClass: string;
    valueObserver: number;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService, zone: NgZone);
    initControl(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscSlider extends MbscControlBase {
    private _formService;
    instance: Slider;
    _lastValue: any;
    _dummy: Array<number>;
    readonly isMulti: boolean;
    readonly dummyArray: Array<number>;
    protected _inheritedOptions: any;
    _needsTimeout: boolean;
    options: MbscFormOptions;
    name: string;
    tooltip: boolean;
    highlight: boolean;
    live: boolean;
    valueTemplate: string;
    icon: string;
    val: string;
    max: number;
    min: number;
    step: number;
    disabled: boolean;
    stepLabels: string | Array<number>;
    readonly dataStepLabels: string | null;
    value: any;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    onChangeEmitter: EventEmitter<any>;
    inputElements: QueryList<ElementRef>;
    constructor(hostElement: ElementRef, _formService: MbscOptionsService, zone: NgZone, control: NgControl);
    reInitialize(): void;
    setNewValue(v: any): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscRating extends MbscControlBase implements OnInit {
    protected formService: MbscOptionsService;
    _inheritedOptions: any;
    instance: Rating;
    options: MbscFormOptions;
    name: string;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    empty: string;
    filled: string;
    _readonly: boolean;
    readonly: any;
    val: 'left' | 'right';
    template: string;
    value: number;
    onChangeEmitter: EventEmitter<number>;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, zone: NgZone, formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscFormGroup implements AfterViewInit {
    initialElem: ElementRef;
    collapsible: any;
    _open: boolean;
    open: boolean;
    inset: string;
    instance: any;
    element: any;
    constructor(initialElem: ElementRef);
    emptyOrTrue(v: any): boolean;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscFormGroupTitle {
}
export declare class MbscFormGroupContent {
}
export declare class MbscAccordion {
}
export declare class MbscFormsModule {
}
