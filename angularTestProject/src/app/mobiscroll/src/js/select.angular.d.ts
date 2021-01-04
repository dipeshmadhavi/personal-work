import { MbscScrollerBase, ElementRef, NgZone, NgControl, EventEmitter, OnInit, MbscInputService, MbscOptionsService, ViewContainerRef } from './frameworks/angular';
import { Select, MbscSelectOptions } from './presets/select';
export { MbscSelectOptions };
export declare class MbscSelect extends MbscScrollerBase implements OnInit {
    optionService: MbscOptionsService;
    instance: Select;
    counter: boolean;
    data: Array<{
        text?: string;
        value?: any;
        group?: string;
        html?: string;
        disabled?: boolean;
    }> | {
        url: string;
        dataField?: string;
        dataType?: 'json' | 'jsonp';
        processResponse?: (data: any) => Array<{
            text?: string;
            value?: any;
            group?: string;
            html?: string;
            disabled?: boolean;
        }>;
        remoteFilter?: boolean;
    };
    dataText: string;
    dataGroup: string;
    dataValue: string;
    filter: boolean;
    filterPlaceholderText: string;
    filterEmptyText: string;
    group: boolean | {
        header?: boolean;
        groupedWheel?: boolean;
        clustered?: boolean;
    };
    groupLabel: string;
    inputClass: string;
    invalid: Array<any>;
    label: string;
    placeholder: string;
    showInput: boolean;
    onFilter: EventEmitter<{
        filterText: string;
        inst: Select;
    }>;
    options: MbscSelectOptions;
    target: any;
    value: any;
    onChangeEmitter: EventEmitter<any>;
    constructor(initialElement: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService, view: ViewContainerRef);
    refreshData(newData: any): void;
    initControl(): void;
    protected setElement(): void;
    isMulti: boolean;
    ngOnInit(): void;
    setNewValue(v: any): void;
}
export declare class MbscSelectComponent extends MbscSelect {
    inputIcon: string;
    iconAlign: 'left' | 'right';
    name: string;
    error: boolean;
    errorMessage: string;
    options: MbscSelectOptions;
    data: Array<{
        text?: string;
        value?: any;
        group?: string;
        html?: string;
        disabled?: boolean;
    }> | {
        url: string;
        dataField?: string;
        dataType?: 'json' | 'jsonp';
        processResponse?: (data: any) => Array<{
            text?: string;
            value?: any;
            group?: string;
            html?: string;
            disabled?: boolean;
        }>;
        remoteFilter?: boolean;
    };
    dropdown: boolean;
    placeholder: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, optionService: MbscOptionsService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
}
export declare class MbscSelectModule {
}
