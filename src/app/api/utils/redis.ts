/*
|-----------------------------------------
| setting up Redis for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { createClient, RedisClientOptions, RedisClientType, SetOptions } from 'redis';

const REDIS_USER = process.env.REDIS_USER;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

let client: RedisClientType | null = null;

const getClient = (): RedisClientType => {
  if (client && client.isOpen) {
    return client;
  }

  const clientOptions: RedisClientOptions = {
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  };
  if (REDIS_USER) {
    clientOptions.username = REDIS_USER;
  }
  if (REDIS_PASSWORD) {
    clientOptions.password = REDIS_PASSWORD;
  }

  client = createClient(clientOptions) as RedisClientType;

  client.on('error', err => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Connected to Redis successfully!'));
  client.on('reconnecting', () => console.log('Reconnecting to Redis...'));
  client.on('end', () => console.log('Disconnected from Redis.'));

  return client;
};

export const connectRedis = async (): Promise<void> => {
  const currentClient = getClient();
  if (!currentClient.isOpen) {
    try {
      await currentClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      throw err;
    }
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (client && client.isOpen) {
    try {
      await client.quit();
      client = null;
    } catch (err) {
      console.error('Error disconnecting from Redis:', err);
    }
  }
};

interface RedisSetOptions extends SetOptions {
  EX?: number;
  PX?: number;
}

export const setRedisData = async (key: string, value: string, options?: RedisSetOptions): Promise<string | null> => {
  const currentClient = getClient();
  if (!currentClient.isOpen) {
    console.error('Redis client is not connected. Call connectRedis() first.');
    return null;
  }
  try {
    const result = await currentClient.set(key, value, options);
    return result;
  } catch (err) {
    console.error(`Error setting Redis data for key "${key}":`, err);
    throw err;
  }
};

export const getRedisData = async (key: string): Promise<string | null> => {
  const currentClient = getClient();
  if (!currentClient.isOpen) {
    console.error('Redis client is not connected. Call connectRedis() first.');
    return null;
  }
  try {
    const result = await currentClient.get(key);
    return result;
  } catch (err) {
    console.error(`Error getting Redis data for key "${key}":`, err);
    throw err;
  }
};
