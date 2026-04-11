import { createClient } from 'redis';
import 'dotenv/config';

let client; 

export default async function exeRedisClient() {
  if (client) return client; // reusing existing client

  client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),

      connectTimeout: 10000, //  avoid timeout crashes

      reconnectStrategy: (retries) => {
        console.log("Retrying Redis connection:", retries);
        return Math.min(retries * 100, 3000); // exponential backoff,capping delay at 3 second
      }
    }
  });

  client.on('error', (err) => {
    console.log('Redis Client Error', err);
  });

  client.on("end", () => {
    console.log("Redis connection closed");
  });

  client.on("reconnecting", () => {
    console.log("Redis reconnecting...");
  });

  await client.connect();
  console.log("Redis server running");

  return client;
}