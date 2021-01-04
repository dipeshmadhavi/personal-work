import { ElementRef, NgZone, MbscOptionsService } from './frameworks/angular';
import { MbscScrollViewBase, MbscNotifyItemService, MbscScrollItemBase } from './classes/scrollview-base.angular';
import { ScrollView, MbscScrollViewOptions } from './classes/scrollview';
export { MbscScrollViewOptions };
export declare class MbscScrollView extends MbscScrollViewBase {
    optionService: MbscOptionsService;
    instance: ScrollView;
    options: MbscScrollViewOptions;
    addRemoveObserver: number;
    constructor(initialElem: ElementRef, zone: NgZone, notifyItemService: MbscNotifyItemService, optionService: MbscOptionsService);
    initControl(): void;
    ngOnDestroy(): void;
}
export declare class MbscScrollViewItem extends MbscScrollItemBase {
    constructor(initialElem: ElementRef, notifyItemService: MbscNotifyItemService);
}
export declare class MbscScrollViewComponent extends MbscScrollView {
    options: MbscScrollViewOptions;
    constructor(initialElem: ElementRef, zone: NgZone, notifyItemService: MbscNotifyItemService, optionService: MbscOptionsService);
}
export declare class MbscScrollViewItemComponent extends MbscScrollViewItem {
    constructor(initialElem: ElementRef, notifyItemService: MbscNotifyItemService);
}
export declare class MbscScrollViewModule {
}
