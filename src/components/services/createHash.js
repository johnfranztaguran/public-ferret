import crypto from 'crypto';

const createHash = data => crypto.createHmac('sha256', '').update(data).digest('hex');

export default createHash;