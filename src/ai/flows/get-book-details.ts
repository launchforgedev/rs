
'use server';

/**
 * @fileOverview A flow to get all details for a book, including a generated cover and author bibliography.
 *
 * - getBookDetails - A function that fetches book details in a single backend call.
 * - GetBookDetailsInput - The input type for the getBookDetails function.
 * - GetBookDetailsOutput - The return type for the getBookDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateBookCover, GenerateBookCoverInput } from './generate-book-cover';
import { getAuthorBibliography, GetAuthorBibliographyInput, GetAuthorBibliographyOutput, GetAuthorBibliographyOutputSchema } from './get-author-bibliography';

const GetBookDetailsInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  summary: z.string().describe('A short summary of the book.'),
});

export type GetBookDetailsInput = z.infer<typeof GetBookDetailsInputSchema>;

const GetBookDetailsOutputSchema = z.object({
    coverImage: z.string().describe('The URL of the generated book cover.'),
    bibliography: GetAuthorBibliographyOutputSchema,
});

export type GetBookDetailsOutput = z.infer<typeof GetBookDetailsOutputSchema>;


export async function getBookDetails(input: GetBookDetailsInput): Promise<GetBookDetailsOutput> {
  return getBookDetailsFlow(input);
}


const getBookDetailsFlow = ai.defineFlow(
  {
    name: 'getBookDetailsFlow',
    inputSchema: GetBookDetailsInputSchema,
    outputSchema: GetBookDetailsOutputSchema,
  },
  async (input) => {
    // Run both calls in parallel for efficiency
    const [coverImage, bibliography] = await Promise.all([
      generateBookCover({
        title: input.title,
        author: input.author,
        summary: input.summary,
      }),
      getAuthorBibliography({ author: input.author })
    ]);

    return {
      coverImage,
      bibliography,
    };
  }
);
