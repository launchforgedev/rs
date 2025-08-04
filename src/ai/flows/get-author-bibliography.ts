
'use server';

/**
 * @fileOverview A flow to get an author's bibliography.
 *
 * - getAuthorBibliography - A function that returns a list of books by an author.
 * - GetAuthorBibliographyInput - The input type for the getAuthorBibliography function.
 * - GetAuthorBibliographyOutput - The return type for the getAuthorBibliography function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAuthorBibliographyInputSchema = z.object({
  author: z.string().describe('The name of the author.'),
});
export type GetAuthorBibliographyInput = z.infer<typeof GetAuthorBibliographyInputSchema>;

const BookSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  genre: z.string().describe('The genre of the book.'),
  summary: z
    .string()
    .describe('A short summary of the book, no more than 50 words.'),
  year: z.number().describe('The year the book was published.'),
});

const GetAuthorBibliographyOutputSchema = z.object({
  books: z.array(BookSchema).describe('A list of books by the author.'),
});
export type GetAuthorBibliographyOutput = z.infer<typeof GetAuthorBibliographyOutputSchema>;

export async function getAuthorBibliography(
  input: GetAuthorBibliographyInput
): Promise<GetAuthorBibliographyOutput> {
  return getAuthorBibliographyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAuthorBibliographyPrompt',
  input: {schema: GetAuthorBibliographyInputSchema},
  output: {schema: GetAuthorBibliographyOutputSchema},
  prompt: `You are a literary expert and librarian. Given an author's name, provide a list of their notable published books. For each book, include the title, author, genre, publication year, and a short summary of no more than 50 words.

Author: {{{author}}}`,
});

const getAuthorBibliographyFlow = ai.defineFlow(
  {
    name: 'getAuthorBibliographyFlow',
    inputSchema: GetAuthorBibliographyInputSchema,
    outputSchema: GetAuthorBibliographyOutputSchema,
  },
  async input => {
    let retries = 3;
    while (retries > 0) {
      try {
        const {output} = await prompt(input);
        if (output) {
          return output;
        }
        throw new Error('No output from prompt.');
      } catch (e: any) {
        if (e.cause?.status === 503 && retries > 1) {
          console.log(`Model is overloaded, retrying... (${retries - 1} attempts left)`);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.error("Failed to get author bibliography after multiple retries:", e);
          // Return empty list on failure to prevent crash
          return { books: [] };
        }
      }
    }
     // Return empty list if all retries fail
    return { books: [] };
  }
);
