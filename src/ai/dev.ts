import { config } from 'dotenv';
config();

import '@/ai/flows/generate-book-recommendations.ts';
import '@/ai/flows/summarize-book.ts';
import '@/ai/flows/generate-book-of-the-day.ts';
import '@/ai/flows/get-author-bibliography.ts';
import '@/ai/flows/generate-book-cover.ts';
