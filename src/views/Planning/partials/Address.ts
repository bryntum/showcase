'use client';

import { Model } from '@bryntum/core-thin';

export default class Address extends Model {
    declare place_id: string;
    declare display_name?: string;
    declare lat: number;
    declare lng: number;

    static override idField = 'place_id';

    static fields = [
        { name : 'place_id', type : 'string' },
        { name : 'display_name', type : 'string' },
        { name : 'lat', type : 'number' },
        { name : 'lon', type : 'number' }
    ];
}
