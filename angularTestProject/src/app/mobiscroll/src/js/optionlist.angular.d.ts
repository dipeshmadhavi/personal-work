import { ElementRef, QueryList, NgZone, MbscOptionsService } from './frameworks/angular';
import { Optionlist, MbscOptionlistOptions } from './classes/optionlist';
import { MbscNotifyItemService } from './classes/scrollview-base.angular';
import { MbscNavItemBase, MbscNavigationBase } from './classes/navigation-base.angular';
export { MbscOptionlistOptions };
export declare class MbscOptionItem extends MbscNavItemBase {
    constructor(notifyItemService: MbscNotifyItemService, _elem: ElementRef);
}
export declare class MbscOptionlist extends MbscNavigationBase {
    optionService: MbscOptionsService;
    instance: Optionlist;
    select: 'single' | 'multiple' | 'off';
    addRemoveObserver: number;
    constructor(initialElem: ElementRef, zone: NgZone, notifyItemService: MbscNotifyItemService, optionService: MbscOptionsService);
    items: QueryList<MbscNavItemBase>;
    initControl(): void;
    ngOnDestroy(): void;
}
export declare class MbscOptionlistModule {
}
