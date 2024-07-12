import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

const apiKey = process.env.WC_DC_API_KEY;

export default async function sendDirectCast(recipientFid: number, message: string) {
    const url = "https://api.warpcast.com/v2/ext-send-direct-cast";
    const idempotencyKey = uuidv4();

    try {
        const response = await axios.put(url, {
            recipientFid,
            message,
            idempotencyKey
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response:', response.data);
        if (response?.data?.result?.success) return true;

        return false;
    } catch (error) {
        console.error('Error sending direct cast:', error);
        return false;
    }
}