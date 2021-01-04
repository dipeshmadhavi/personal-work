import { MbscFrameBase, ElementRef, NgZone, NgControl, EventEmitter, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { Color, MbscColorOptions } from './classes/color';
export { MbscColorOptions };
export declare class MbscColor extends MbscFrameBase {
    optionService: MbscOptionsService;
    instance: Color;
    clear: boolean;
    data: Array<string | {
        color: string;
    }>;
    defaultValue: string;
    enhance: boolean;
    format: 'hex' | 'rgb' | 'hsl';
    inputClass: string;
    mode: 'preset' | 'refine';
    navigation: 'horizontal' | 'vertical';
    preview: boolean;
    previewText: boolean;
    rows: number;
    valueText: string;
    select: 'single' | 'multiple' | number;
    onSet: EventEmitter<{
        valueText: string;
        inst: any;
    }>;
    onClear: EventEmitter<{
        inst: any;
    }>;
    onItemTap: EventEmitter<{
        target: HTMLElement;
        selected: boolean;
        index: number;
        value: string;
        inst: Color;
    }>;
    onPreviewItemTap: EventEmitter<{
        target: HTMLElement;
        index: number;
        value: string;
        inst: Color;
    }>;
    options: MbscColorOptions;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    refreshData(newData: any): void;
    initControl(): void;
    isMulti: boolean;
    setNewValue(v: any): void;
    ngOnInit(): void;
}
export declare class MbscColorComponent extends MbscColor {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscColorOptions;
    placeholder: string;
    data: Array<string | {
        color: string;
    }>;
    enhance: boolean;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
}
export declare class MbscColorModule {
}
