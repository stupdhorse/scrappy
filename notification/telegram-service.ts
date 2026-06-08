import axios from "axios";
import { config } from "../common/config.js";

export function createTelegramService(botToken: string, chatId:string){
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    return{
        notify: async (message: string) => {
            if(!botToken || !chatId){
                console.error('Telegram bot token or chat ID is missing. Notification not sent.');
                return;
            }

            try{
                await axios.post(apiUrl, {
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                });
                return true;
            } catch (error) {
                console.error('Error sending Telegram notification:', error);
                return false;
            }
        }
    };
}

export const telegramService = createTelegramService(
    config.telegram.botToken,
    config.telegram.chatId
);