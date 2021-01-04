import { MbscBase, OnInit, ControlValueAccessor, EventEmitter, NgControl, ElementRef, MbscOptionsService, MbscInputService, NgZone } from './frameworks/angular';
import { Input as FormInput, MbscFormOptions } from './classes/input';
export declare class MbscFormBase extends MbscBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    color: string;
    options: MbscFormOptions;
    disabled: boolean;
    name: string;
    _initElem: ElementRef;
    constructor(hostElem: ElementRef, _formService: MbscOptionsService, zone: NgZone);
    ngOnInit(): void;
}
export declare class MbscFormValueBase extends MbscFormBase implements ControlValueAccessor {
    protected _control: NgControl;
    protected _noOverride: boolean;
    _value: any;
    _readonly: boolean;
    readonly: any;
    innerValue: any;
    onChange: (value: any) => any;
    onTouch: (ev?: any) => any;
    value: any;
    error: boolean;
    errorMessage: string;
    valueChangeEmitter: EventEmitter<string>;
    constructor(hostElem: ElementRef, _formService: MbscOptionsService, _control: NgControl, _noOverride: boolean, zone: NgZone);
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(v: any): void;
    refresh(): void;
}
export declare class MbscInputBase extends MbscFormValueBase {
    autocomplete: 'on' | 'off';
    autocapitalize: string;
    autocorrect: string;
    spellcheck: string;
    autofocus: string;
    minlength: number;
    maxlength: number;
    required: string;
    icon: string;
    iconAlign: string;
    type: string;
    passwordToggle: boolean;
    iconShow: string;
    iconHide: string;
    iconUpload: boolean;
    inputStyle: string;
    labelStyle: string;
    placeholder: string;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _control: NgControl, noOverride: boolean, zone: NgZone);
}
export declare class MbscInput extends MbscInputBase {
    protected _inputService: MbscInputService;
    instance: FormInput;
    min: number;
    max: number;
    step: number;
    pattern: string;
    accept: string;
    multiple: string;
    controlNg: boolean;
    dropdown: boolean;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _inputService: MbscInputService, _control: NgControl, zone: NgZone);
    initControl(): void;
}
export declare class MbscInputModule {
}
