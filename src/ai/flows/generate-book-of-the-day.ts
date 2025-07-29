
'use server';

/**
 * @fileOverview A flow to generate the book of the day.
 *
 * - generateBookOfTheDay - A function that returns a book of the day.
 * - BookOfTheDay - The return type for the generateBookOfTheDay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookOfTheDaySchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  genre: z.string().describe('The genre of the book.'),
  summary: z
    .string()
    .describe('A short summary of the book, no more than 50 words.'),
  reason: z
    .string()
    .describe(
      'A compelling reason, no more than 30 words, why this book was chosen as the book of the day.'
    ),
});

export type BookOfTheDay = z.infer<typeof BookOfTheDaySchema>;

export async function generateBookOfTheDay(): Promise<BookOfTheDay> {
  return generateBookOfTheDayFlow();
}

const prompt = ai.definePrompt({
  name: 'generateBookOfTheDayPrompt',
  output: {schema: BookOfTheDaySchema},
  prompt: `You are a literary curator for a book recommendation app. Your task is to select a "Book of the Day".

Choose a book that is critically acclaimed, a hidden gem, or a timeless classic. Provide the book's title, author, genre, a short summary (under 50 words), and a compelling reason (under 30 words) for your choice.

Avoid overly popular or recently trending books. Aim for variety in your selections day to day.`,
});

const generateBookOfTheDayFlow = ai.defineFlow(
  {
    name: 'generateBookOfTheDayFlow',
    outputSchema: BookOfTheDaySchema,
  },
  async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        const {output} = await prompt();
        if (output) {
          return output;
        }
        throw new Error('No output from prompt.');
      } catch (e: any) {
        if (e.cause?.status === 503 && retries > 0) {
          console.log('Model is overloaded, retrying...');
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
        } else {
          throw e;
        }
      }
    }
    throw new Error('Model is overloaded, please try again later.');
  }
);

    