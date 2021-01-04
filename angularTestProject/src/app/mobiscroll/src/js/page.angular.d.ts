import { MbscBase, ElementRef, OnInit, MbscOptionsService, NgZone } from './frameworks/angular';
import { Page, MbscPageOptions } from './classes/page';
export { MbscPageOptions };
export declare class MbscPage extends MbscBase implements OnInit {
    optionsService: MbscOptionsService;
    instance: Page;
    options: MbscPageOptions;
    context: string | HTMLElement;
    initElem: ElementRef;
    constructor(hostElement: ElementRef, optionsService: MbscOptionsService, zone: NgZone);
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscNote {
    initialElem: ElementRef;
    readonly classNames: string;
    color: string;
    constructor(initialElem: ElementRef);
}
export declare class MbscAvatar {
    draggable: boolean;
    src: string;
    alt: string;
}
export declare class MbscPageModule {
}
