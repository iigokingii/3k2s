const redis = require('redis');

const client = redis.createClient();
client.connect().then(() => {
    console.log('Client connected to Redis');
    client.quit().then(() => {
        console.log('Redis connection closed');
    }).catch((err) => {
        console.log('connection error:', err);
    });
}).catch((err) => {
    console.log('connection error:', err);
}); 