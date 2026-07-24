import { cache } from 'react';
import { getSettings as dbGetSettings, getPostBySlug as dbGetPostBySlug } from './database';

export const getSettings = cache(dbGetSettings);
export const getPostBySlug = cache(dbGetPostBySlug);

