import { ElementRef, MbscBase, MbscOptionsService, EventEmitter, NgZone } from './frameworks/angular';
import { Popup, MbscPopupOptions, MbscWidgetOptions } from './classes/popup';
export { MbscPopupOptions };
export { MbscWidgetOptions };
export declare class MbscPopup extends MbscBase {
    optionService: MbscOptionsService;
    instance: Popup;
    options: MbscPopupOptions;
    anchor?: string | HTMLElement;
    animate?: boolean | 'fade' | 'flip' | 'pop' | 'swing' | 'slidevertical' | 'slidehorizontal' | 'slidedown' | 'slideup';
    buttons?: Array<any>;
    closeOnOverlayTap?: boolean;
    context?: string | HTMLElement;
    disabled?: boolean;
    display?: 'top' | 'bottom' | 'bubble' | 'inline' | 'center';
    focusOnClose?: boolean | string | HTMLElement;
    focusTrap?: boolean;
    headerText?: string | boolean | ((formattedValue: string) => string);
    showOnFocus?: boolean;
    showOnTap?: boolean;
    touchUi?: boolean;
    okText: string;
    cancelText: string;
    onBeforeClose: EventEmitter<{
        valueText: string;
        button: string;
        inst: any;
    }>;
    onBeforeShow: EventEmitter<{
        inst: any;
    }>;
    onCancel: EventEmitter<{
        valueText: string;
        inst: any;
    }>;
    onClose: EventEmitter<{
        valueText: string;
        inst: any;
    }>;
    onDestroy: EventEmitter<{
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
    onSet: EventEmitter<{
        valueText?: string;
        inst: any;
    }>;
    constructor(initialElem: ElementRef, optionService: MbscOptionsService, zone: NgZone);
    ngAfterViewInit(): void;
}
export declare class MbscWidget extends MbscPopup {
}
export declare class MbscPopupModule {
}
