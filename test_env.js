const { z } = require('zod');
const process = require('process');
require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co';
console.log(url);
