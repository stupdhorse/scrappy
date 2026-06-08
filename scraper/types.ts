export interface OlxFilters{
    location?: string;
    query?: string;
    districtId?: string,

    priceFrom?: number,
    priceTo?: number,
    areaFrom?: number,
    areaTo?: number,

    rooms?: string[],
    floor?: string[],
    furniture?: string;   
    buildType?: string[];
    pets?: string;        
    elevator?: string;    
    parking?: string[];
}

export interface OlxOffer{
    title: string,
    url: string
}