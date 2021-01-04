import { mobiscroll } from '../core/dom';
import { $, extend, MbscCoreOptions } from '../core/core';
import { MbscFrameOptions } from '../classes/frame';
import { AfterViewInit, Component, ContentChild, ContentChildren, Directive, DoCheck, ElementRef, EventEmitter, forwardRef, Inject, Injectable, Input, ModuleWithProviders, NgModule, NgZone, OnChanges, OnDestroy, OnInit, Optional, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef, Injector, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ControlValueAccessor, FormsModule } from '@angular/forms';
import { Observable } from '../util/observable';
import { MbscFormValueBase } from '../input.angular';
export declare class MbscRouterToken {
}
export declare class MbscOptionsService {
    private _options;
    options: any;
}
export declare class MbscInputService {
    private _controlSet;
    isControlSet: boolean;
    private _componentRef;
    input: MbscFormValueBase;
}
export declare class MbscListService {
    private addRemoveObservable;
    notifyAddRemove(item: any): void;
    onAddRemove(): Observable<any>;
}
declare class MbscBase implements AfterViewInit, OnDestroy {
    initialElem: ElementRef;
    protected zone: NgZone;
    options: MbscCoreOptions;
    cssClass: string;
    theme: string;
    themeVariant: 'auto' | 'dark' | 'light';
    lang: string;
    rtl: boolean;
    responsive: object;
    onInit: EventEmitter<{
        inst: any;
    }>;
    onDestroy: EventEmitter<{
        inst: any;
    }>;
    inlineOptionsObj: any;
    pendingValue: any;
    getInlineEvents(): void;
    themeClassesSet: boolean;
    setThemeClasses(): void;
    clearThemeClasses(): void;
    getThemeClasses(): string;
    instance: any;
    element: any;
    protected setElement(): void;
    constructor(initialElem: ElementRef, zone: NgZone);
    ngAfterViewInit(): void;
    startInit(): void;
    getIonInput(): any;
    initControl(): void;
    ngOnDestroy(): void;
    updateOptions(newOptions: any, optionChanged: boolean, invalidChanged: boolean, dataChanged: boolean): void;
    ngOnChanges(changes: SimpleChanges): void;
}
declare abstract class MbscValueBase extends MbscBase {
    abstract setNewValue(v: any): void;
    constructor(initialElem: ElementRef, zone: NgZone);
    initialValue: any;
    protected setNewValueProxy(v: any): void;
}
declare abstract class MbscCloneBase extends MbscValueBase implements DoCheck, OnInit {
    constructor(initElem: ElementRef, zone: NgZone);
    cloneDictionary: any;
    makeClone(setting: string, value: Array<any>): void;
    ngDoCheck(): void;
    ngOnInit(): void;
}
declare abstract class MbscControlBase extends MbscCloneBase implements ControlValueAccessor {
    protected control: NgControl;
    _inputService: MbscInputService;
    _view: ViewContainerRef;
    labelStyle: 'stacked' | 'inline' | 'floating';
    inputStyle: 'underline' | 'box' | 'outline';
    showOnFocus: boolean;
    showOnTap: boolean;
    disabled: boolean;
    readonly optionExtensions: any;
    readonly enableManualEdit: boolean;
    _needsTimeout: boolean;
    onChange: (value: any) => any;
    onTouch: (ev?: any) => any;
    onChangeEmitter: EventEmitter<any>;
    protected handleChange(element?: any): void;
    oldAccessor: any;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService, _view: ViewContainerRef);
    overwriteAccessor(): void;
    ngAfterViewInit(): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(v: any): void;
}
declare abstract class MbscFrameBase extends MbscControlBase implements OnInit {
    options: MbscFrameOptions;
    dropdown: boolean;
    anchor: string | HTMLElement;
    animate: boolean | 'fade' | 'flip' | 'pop' | 'swing' | 'slidevertical' | 'slidehorizontal' | 'slidedown' | 'slideup';
    buttons: Array<any>;
    closeOnOverlayTap: boolean;
    context: string | HTMLElement;
    display: 'top' | 'bottom' | 'bubble' | 'inline' | 'center';
    showInput: boolean;
    focusOnClose: boolean | string | HTMLElement;
    focusTrap: boolean;
    headerText: string | boolean | ((formattedValue: string) => string);
    scrollLock: boolean;
    touchUi: boolean;
    onBeforeClose: EventEmitter<{
        valueText: string;
        button: string;
        inst: any;
    }>;
    onBeforeShow: EventEmitter<{
        inst: any;
    }>;
    onCancel: EventEmitter<{
        valuteText: string;
        inst: any;
    }>;
    onClose: EventEmitter<{
        valueText: string;
        inst: any;
    }>;
    onFill: EventEmitter<{
        inst: any;
    }>;
    onMarkupReady: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onPosition: EventEmitter<{
        target: HTMLElement;
        windowWidth: number;
        windowHeight: number;
        inst: any;
    }>;
    onShow: EventEmitter<{
        target: HTMLElement;
        valueText: string;
        inst: any;
    }>;
    readonly inline: boolean;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService, view: ViewContainerRef);
    ngOnInit(): void;
}
declare abstract class MbscScrollerBase extends MbscFrameBase {
    circular: boolean | Array<boolean>;
    height: number;
    layout: 'liquid' | 'fixed';
    maxWidth: number | Array<number>;
    minWidth: number | Array<number>;
    multiline: number;
    readonly: boolean | Array<boolean>;
    rows: number;
    showLabel: boolean;
    showScrollArrows: boolean;
    wheels: Array<any>;
    width: number | Array<number>;
    validate: (event: {
        values: Array<any>;
        index: number;
        direction: number;
    }, inst: any) => (void | {
        disabled?: Array<any>;
        valid?: Array<any>;
    });
    cancelText: string;
    clearText: string;
    selectedText: string;
    setText: string;
    formatValue: (data: Array<any>) => string;
    parseValue: (valueText: string) => any;
    onWheelChange: EventEmitter<{
        valueText?: string;
        inst: any;
    }>;
    onSet: EventEmitter<{
        valueText?: string;
        inst: any;
    }>;
    onItemTap: EventEmitter<{
        inst: any;
    }>;
    onClear: EventEmitter<{
        inst: any;
    }>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, _inputService: MbscInputService, view: ViewContainerRef);
}
declare function deepEqualsArray(a1: Array<any>, a2: Array<any>): boolean;
declare function isDateEqual(d1: any, d2: any): boolean;
declare function emptyOrTrue(val: any): boolean;
declare const INPUT_TEMPLATE = "<mbsc-input *ngIf=\"!inline || showInput\" \n    [controlNg]=\"false\" [name]=\"name\" [theme]=\"theme\" [label-style]=\"labelStyle\" [input-style]=\"inputStyle\" [disabled]=\"disabled\" [dropdown]=\"dropdown\" [placeholder]=\"placeholder\"\n    [error]=\"error\" [errorMessage]=\"errorMessage\" \n    [icon]=\"inputIcon\" [icon-align]=\"iconAlign\">\n    <ng-content></ng-content>\n</mbsc-input>";
export { $, extend, mobiscroll, deepEqualsArray, isDateEqual, emptyOrTrue, INPUT_TEMPLATE, MbscBase, MbscValueBase, MbscCloneBase, MbscControlBase, MbscFrameBase, MbscScrollerBase, AfterViewInit, CommonModule, Component, ContentChild, ContentChildren, ControlValueAccessor, Directive, DoCheck, ElementRef, EventEmitter, FormsModule, forwardRef, Inject, Injectable, Input, ModuleWithProviders, NgControl, NgModule, NgZone, Observable, OnChanges, OnDestroy, OnInit, Optional, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef, Injector, ChangeDetectionStrategy, ChangeDetectorRef };
