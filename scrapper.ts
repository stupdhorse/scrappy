import axios from 'axios';
import * as cheerio from 'cheerio';
import { buildUrl } from './urlBuilder.js';
import type { OlxOffer, OlxFilters } from './types.js';
import { config } from './config.js';

export class Scrapper {
    private readonly headers = config.scraper.headers;

    public async fetchData(filters: OlxFilters): Promise<OlxOffer[]> {
        const url: string = buildUrl(filters);
        try {
            const response = await axios.get(url, { headers: this.headers });
            return this.extractOffersFromData(response.data);
        }
        catch(error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    private extractOffersFromData(html: string): OlxOffer[] {
        const $ = cheerio.load(html);
        const scriptContent = $('#olx-init-config').html();

        if (!scriptContent) return [];

        const regex = /window\.__PRERENDERED_STATE__\s*=\s*"(.*?)";/;
        const match = scriptContent.match(regex);

        if (match && match[1]) {
            const rawString: string = match[1];
            let data: any;
            try {
                const decodedString: string = JSON.parse(`"${rawString}"`);
                data = JSON.parse(decodedString);
            }
            catch(error) {
                console.error('Error parsing JSON:', error);
                return [];
            }
            
            const ads: any[] = data?.listing?.listing?.ads || [];
            const results: OlxOffer[] = [];
            
            for (const ad of ads) {
                const title: string = ad?.title;
                const adUrl: string = ad?.url;

                results.push({
                    title,
                    url: adUrl
                });
            }
            
            return results;
        }
        
        return [];
    }
}