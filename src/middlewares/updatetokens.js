import moment from 'moment';
import Token from '../models/token.model.js';

export const updateExpiredTokensMiddleware = async (req, res) => {
    try {
        const result = await Token.updateMany(
            {expire_date: {$lt: moment().toISOString()}, status: {$ne: 'expired'}},
            {status: 'expired'}
        );
        //console.log(`${result.nModified} tokens were updated to 'expired'`);
    } catch (error) {
        console.error('Failed to update expired tokens:', error);
    }
};
