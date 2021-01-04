import { ElementRef, MbscBase, MbscOptionsService, NgZone } from './frameworks/angular';
import { Card, MbscCardOptions } from './classes/cards';
import { MbscListviewService } from './listview.angular';
export { MbscCardOptions };
export declare class MbscCard extends MbscBase {
    optionsService: MbscOptionsService;
    lvService: MbscListviewService;
    instance: Card;
    _collapsibleInput: any;
    _open: boolean;
    collapsibleInput: any;
    open: boolean;
    constructor(host: ElementRef, optionsService: MbscOptionsService, lvService: MbscListviewService, zone: NgZone);
    initControl(): void;
}
export declare class MbscCardComponent extends MbscCard {
    optionsService: MbscOptionsService;
    options: MbscCardOptions;
    constructor(host: ElementRef, optionsService: MbscOptionsService, lvService: MbscListviewService, zone: NgZone);
}
export declare class MbscCardHeader {
}
export declare class MbscCardContent {
}
export declare class MbscCardFooter {
}
export declare class MbscCardTitle {
}
export declare class MbscCardSubtitle {
}
export declare class MbscCardModule {
}
