'use client';

import { EventModel } from '@bryntum/schedulerpro-thin';
import { Duration } from '@bryntum/core-thin';
import Address from './Address';

export default class Task extends EventModel {
    declare address: Address;
    declare marker: mapboxgl.Marker;
    declare preamble: Duration;
    declare postamble: Duration;
    declare duration: number;

    static fields = [
        { name : 'address', type : 'object' },
        // in this demo, default duration for tasks will be 1 hour (instead of days)
        { name : 'duration', type : 'number', defaultValue : 1 },
        { name : 'durationUnit', typ : 'number', defaultValue : 'h' }
    ];

    get shortAddress() {
        return (this.address?.display_name || '').split(',')[0];
    }
}
