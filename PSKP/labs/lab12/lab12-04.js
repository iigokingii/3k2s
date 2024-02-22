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
        
    const hsetExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
            client.hSet(i.toString(),`id:${i}`,`${JSON.stringify({val:`val-${i}`})}`);
        }
      });
      console.log(`HSET requests executed in ${hsetExecutionTime} ms`);
    
      const hgetExecutionTime = measureTime(() => {
        for (let i = 0; i < REQUEST_NUMBER; i++) {
            client.hGet(i.toString(), `id:${i}`);
        }
      });
      console.log(`HGET requests executed in ${hgetExecutionTime} ms`);


    client.quit().then(() => {
        console.log('Redis connection closed');
    }).catch((err) => {
        console.log('connection error:', err);
    });

    // client.flushAll().then(()=>{
    //     console.log('Redis flushed:');
    // }).catch((err) => {
    //         console.error('Error flushing Redis:', err);
    //     });

}).catch((err) => {
    console.log('connection error:', err);
}); 