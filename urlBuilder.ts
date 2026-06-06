import type { OlxFilters } from './types.js';
import { config } from './config.js';

export function buildUrl(filters: OlxFilters): string{
    let basePath = config.scraper.baseUrl;
    if(filters.location){
        basePath += `${filters.location}/`;
    }
    if(filters.query){
        basePath += `q-${encodeURIComponent(filters.query)}/`
    }
    const url = new URL(basePath);
if (filters.districtId) {
        url.searchParams.append('search[district_id]', filters.districtId.toString());
    }
    if (filters.priceFrom) url.searchParams.append('search[filter_float_price:from]', filters.priceFrom.toString());
    if (filters.priceTo) url.searchParams.append('search[filter_float_price:to]', filters.priceTo.toString());
    if (filters.areaFrom) url.searchParams.append('search[filter_float_m:from]', filters.areaFrom.toString());
    if (filters.areaTo) url.searchParams.append('search[filter_float_m:to]', filters.areaTo.toString());
    if (filters.furniture) url.searchParams.append('search[filter_enum_furniture][0]', filters.furniture);
    if (filters.pets) url.searchParams.append('search[filter_enum_pets][0]', filters.pets);
    if (filters.elevator) url.searchParams.append('search[filter_enum_winda][0]', filters.elevator);

const appendArrayFilter = (paramName: string, values?: string[]) => {
        if (values && values.length > 0) {
            values.forEach((value, index) => {
                url.searchParams.append(`search[${paramName}][${index}]`, value);
            });
        }
    }

    appendArrayFilter('filter_enum_rooms', filters.rooms);
    appendArrayFilter('filter_enum_floor_select', filters.floor);
    appendArrayFilter('filter_enum_builttype', filters.buildType);
    appendArrayFilter('filter_enum_parking', filters.parking);
    return url.toString();
}