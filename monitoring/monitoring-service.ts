import { redisClient } from "../common/redis.js";
import { telegramService } from "../notification/index.js";
import { Scrapper } from "../scraper/scrapper-service.js";
import type { OlxFilters } from "../scraper/types.js";
import cron from 'node-cron';

let currentFilters: OlxFilters = {};
let cronTask: cron.ScheduledTask | null = null;

const scrapper = new Scrapper();

const OFFER_LIFETIME = 7 * 24 * 60 * 60; // 7 days in seconds

async function checkForNewOffers() {
    try{
        const offers = await scrapper.fetchData(currentFilters);

        for(const offer of offers){
            const redisKey = `olx:offer:${offer.url}`;
            const isNew = await redisClient.set(redisKey, '1', {NX: true, EX: OFFER_LIFETIME});
            if(isNew){
                const message = `<b>New offer:</b>\n${offer.title}\n<a href="${offer.url}">See offer</a>`;
                await telegramService.notify(message);
            }
        }
    }
    catch(error){
        console.error('Error checking for new offers:', error);
    }
}

export const monitoringService = {
    getFilters: () => currentFilters,
    updateFilters: (updatedFilters: OlxFilters) => {
        currentFilters = updatedFilters;
    },
    start: (): void => {
        if(cronTask){
            console.warn('Monitoring is already running.');
            return;
        }
        cronTask = cron.schedule('5 * * * *', checkForNewOffers);
        checkForNewOffers();
    },
    stop: (): void => {
        if(!cronTask){
            console.warn('Monitoring is not running.');
            return;
        }
        cronTask.stop();
        cronTask = null;
    }
};