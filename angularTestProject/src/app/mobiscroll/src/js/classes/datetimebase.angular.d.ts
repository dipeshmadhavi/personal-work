import { ElementRef, NgControl, NgZone, MbscInputService, MbscScrollerBase, ViewContainerRef } from '../frameworks/angular';
export declare abstract class MbscDatetimeBase extends MbscScrollerBase {
    defaultValue: Date | Array<Date>;
    invalid: Array<string | {
        start: Date;
        end: Date;
        d?: string;
    } | Date>;
    max: Date;
    min: Date;
    returnFormat: 'iso8601' | 'moment' | 'locale' | 'jsdate';
    steps: {
        hour?: number;
        minute?: number;
        second?: number;
        zeroBased?: boolean;
    };
    valid: Array<string | {
        start: Date;
        end: Date;
        d?: string;
    } | Date>;
    calendarSystem?: 'jalali' | 'hijri' | 'gregorian';
    ampmText: string;
    amText: string;
    dateFormat: string;
    dateWheels: string;
    dayNames: Array<string>;
    dayNamesShort: Array<string>;
    dayText: string;
    hourText: string;
    minuteText: string;
    monthNames: Array<string>;
    monthNamesShort: Array<string>;
    monthSuffix: string;
    monthText: string;
    nowText: string;
    pmText: string;
    secText: string;
    timeFormat: string;
    timeWheels: string;
    yearSuffix: string;
    yearText: string;
    constructor(initialElem: ElementRef, zone: NgZone, control: NgControl, inputService: MbscInputService, view: ViewContainerRef);
}
