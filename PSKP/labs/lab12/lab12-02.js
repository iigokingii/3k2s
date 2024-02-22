const redis = require('redis');

const REQUEST_NUMBER = 10000;

function measureTime(callback) {
    const start = process.hrtime();
    callback();
    const end = process.hrtime(start);
    const executionTime = (end[0] * 1e9 + end[1]) / 1e6;
    return executionTime;
  }

const client = redis.createClient();
client.connect().then(() => {
    console.log('Client connected to Redis');
    
    const setExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
          client.set(`${i}`, `set${i}`);
        }
    });
    console.log(`SET requests executed in ${setExecutionTime} ms`);

    const getExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
          client.get(`${i}`);
        }
      });
    console.log(`GET requests executed in ${getExecutionTime} ms`);

    const delExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
          client.del(`${i}`);
        }
    });

    console.log(`DEL requests executed in ${delExecutionTime} ms`);

    client.quit().then(() => {
        console.log('Redis connection closed');
    }).catch((err) => {
        console.log('connection error:', err);
    });
}).catch((err) => {
    console.log('connection error:', err);
}); 