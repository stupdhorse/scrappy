import { Scrapper } from './scrapper.js';

async function main() {
    const scrapper = new Scrapper();
    const offers = await scrapper.fetchData({
        location: 'warszawa',
        districtId: '355',
});
    console.log('Znalezione oferty:', offers);
}

main();