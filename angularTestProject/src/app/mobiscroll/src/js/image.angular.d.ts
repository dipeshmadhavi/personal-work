import { MbscScrollerBase, EventEmitter, ElementRef, NgZone, NgControl, MbscInputService, MbscListService, OnInit, OnDestroy, AfterViewInit, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { ImageScroller, MbscImageOptions } from './presets/image';
export { MbscImageOptions };
export declare class MbscImage extends MbscScrollerBase implements OnInit {
    optionService: MbscOptionsService;
    instance: ImageScroller;
    defaultValue: Array<number>;
    enhance: boolean;
    inputClass: string;
    invalid: Array<any>;
    labels: Array<string>;
    placeholder: string;
    showInput: boolean;
    wheelArray: Array<any>;
    options: MbscImageOptions;
    target: any;
    value: string;
    onChangeEmitter: EventEmitter<string>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    initControl(): void;
    setNewValue(v: any): void;
}
export declare class MbscImageComponent extends MbscImage implements OnInit {
    listService: MbscListService;
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscImageOptions;
    wheelArray: Array<any>;
    label: string;
    placeholder: string;
    itemWrapper: ElementRef;
    showInput: boolean;
    inlineOptionsObj: {
        itemSelector: string;
        showInput: boolean;
    };
    addRemoveHandler: number;
    setElement(): void;
    constructor(initialElem: ElementRef, zone: NgZone, listService: MbscListService, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    initControl(): void;
    ngOnDestroy(): void;
}
export declare class MbscImageItem implements AfterViewInit, OnDestroy {
    listService: MbscListService;
    value: string | number;
    icon: string;
    constructor(listService: MbscListService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscImageModule {
}
