import NodeCache from "node-cache";
import LoggerService from "../logger/logger.service.js";

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const cacheMiddleware = (req, res, next) => {
    console.log('Cache middleware triggered');

    const cookies = req.cookies || {};

    if (!cookies['USERSESSION']) {
        LoggerService.info('No USERSESSION cookie found, skipping cache');
        res.status(400).json({ error: 'USERSESSION cookie is required' });
    }

    const requestBody = JSON.stringify(req.body);
    
    const cacheKey = `${cookies['USERSESSION']}${
        Buffer.from(requestBody).toString('base64')
    }`;

    const cachedContent = cache.get(cacheKey);

    if (!cachedContent) {
        LoggerService.info('Cache miss', { cacheKey });
        req.locals = { cacheKey, cache };
    }

    next();
};