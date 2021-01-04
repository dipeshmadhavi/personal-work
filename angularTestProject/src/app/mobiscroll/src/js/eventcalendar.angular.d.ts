import { ElementRef, NgZone, EventEmitter, OnInit, MbscOptionsService } from './frameworks/angular';
import { Eventcalendar, MbscEventcalendarOptions } from './presets/eventcalendar';
import { MbscCalBase } from './classes/calbase.angular';
export { MbscEventcalendarOptions };
export declare class MbscEventcalendar extends MbscCalBase implements OnInit {
    optionService: MbscOptionsService;
    instance: Eventcalendar;
    data: Array<{
        start?: any;
        end?: any;
        d?: any;
        text?: string;
        color?: string;
        allDay?: boolean;
    }>;
    layout: 'liquid' | 'fixed';
    showEventCount: boolean;
    eventBubble: boolean;
    formatDuration: (start: Date, end: Date) => string;
    view: {
        calendar?: {
            type?: 'week' | 'month';
            size?: number;
            popover?: boolean;
            labels?: boolean;
        };
        eventList?: {
            type?: 'day' | 'week' | 'month' | 'year';
            size?: number;
            scrollable?: boolean;
        };
    };
    allDayText: string;
    eventText: string;
    eventsText: string;
    labelsShort: Array<string>;
    noEventsText: string;
    onEventSelect: EventEmitter<{
        event: any;
        date: Date;
        domEvent: any;
        inst: Eventcalendar;
    }>;
    onDayChange: EventEmitter<{
        events: Array<{
            start?: any;
            end?: any;
            d?: any | string | number;
            text?: string;
            color?: string;
            allDay?: boolean;
        }>;
        date: Date;
        marked?: any;
        selected?: 'start' | 'end';
        target: HTMLElement;
        inst: Eventcalendar;
    }>;
    onSetDate: EventEmitter<{
        date: Date;
        control?: 'calendar' | 'date' | 'time';
        inst: any;
    }>;
    options: MbscEventcalendarOptions;
    constructor(initialElem: ElementRef, zone: NgZone, optionService: MbscOptionsService);
    refreshData(newData: any): void;
    initControl(): void;
    ngOnInit(): void;
    setNewValue(): void;
}
export declare class MbscEventcalendarComponent extends MbscEventcalendar {
    data: Array<{
        start?: Date;
        end?: Date;
        d?: Date | string | number;
        text?: string;
        color?: string;
        allDay?: boolean;
    }>;
    options: MbscEventcalendarOptions;
    constructor(initialElem: ElementRef, zone: NgZone, optionService: MbscOptionsService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class MbscEventcalendarModule {
}
