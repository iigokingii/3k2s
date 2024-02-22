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

    client.set(`incr`, 0);
    
    const incrExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
          client.incr('incr');
        }
    });
    console.log(`INCR requests executed in ${incrExecutionTime} ms`);
    
    const decrExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
          client.decr('incr');
        }
    });
    console.log(`DECR requests executed in ${decrExecutionTime} ms`);


    client.quit().then(() => {
        console.log('Redis connection closed');
    }).catch((err) => {
        console.log('connection error:', err);
    });
}).catch((err) => {
    console.log('connection error:', err);
}); 