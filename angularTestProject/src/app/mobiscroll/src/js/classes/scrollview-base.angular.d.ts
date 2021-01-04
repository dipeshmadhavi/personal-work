import { MbscBase, EventEmitter, ElementRef, NgZone, Observable, AfterViewInit, OnDestroy } from '../frameworks/angular';
export declare class MbscNotifyItemService {
    private _instanceObservable;
    private _addRemoveObservable;
    inst: any;
    notifyInstanceReady(instance: any): void;
    notifyAddRemove(item: any): void;
    onInstanceReady(): Observable<any>;
    onAddRemove(): Observable<any>;
}
export declare class MbscScrollItemBase implements AfterViewInit, OnDestroy {
    notifyItemService: MbscNotifyItemService;
    _elem: ElementRef;
    id: string;
    _instance: any;
    readonly nativeElement: any;
    instanceObserver: number;
    constructor(notifyItemService: MbscNotifyItemService, _elem: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscScrollViewBase extends MbscBase {
    notifyItemService: MbscNotifyItemService;
    context: string | HTMLElement;
    itemWidth: number;
    layout: 'liquid' | 'fixed' | number;
    mousewheel: boolean;
    snap: boolean;
    threshold: number;
    paging: boolean;
    onItemTap: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onMarkupReady: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onAnimationStart: EventEmitter<{
        inst: any;
    }>;
    onAnimationEnd: EventEmitter<{
        inst: any;
    }>;
    onMove: EventEmitter<{
        inst: any;
    }>;
    onGestureStart: EventEmitter<{
        inst: any;
    }>;
    onGestureEnd: EventEmitter<{
        inst: any;
    }>;
    constructor(initialElem: ElementRef, zone: NgZone, notifyItemService: MbscNotifyItemService);
}
