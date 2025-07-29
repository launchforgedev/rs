'use server';

/**
 * @fileOverview A book recommendation AI agent.
 *
 * - generateBookRecommendations - A function that generates book recommendations.
 * - GenerateBookRecommendationsInput - The input type for the generateBookRecommendations function.
 * - GenerateBookRecommendationsOutput - The return type for the generateBookRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookRecommendationsInputSchema = z.object({
  searchParameters: z
    .string()
    .describe(
      'The search parameters provided by the user, such as book title, author, or genre.'
    ),
  count: z.number().describe('The number of recommendations to generate.'),
});
export type GenerateBookRecommendationsInput = z.infer<
  typeof GenerateBookRecommendationsInputSchema
>;

const BookSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  genre: z.string().describe('The genre of the book.'),
  summary: z
    .string()
    .describe('A short summary of the book, no more than 50 words.'),
  year: z.number().optional().describe('The year the book was published.'),
  rating: z.number().describe('A plausible Goodreads-style average rating out of 5, e.g., 4.3.'),
  reviews: z.number().describe('A plausible total number of reviews, e.g., 125034.'),
  ageGroup: z.string().describe('The common reader age group for the book, e.g., "25-40".'),
});

const GenerateBookRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(BookSchema)
    .describe('A list of book recommendations based on the search parameters.'),
});
export type GenerateBookRecommendationsOutput = z.infer<
  typeof GenerateBookRecommendationsOutputSchema
>;

export async function generateBookRecommendations(
  input: GenerateBookRecommendationsInput
): Promise<GenerateBookRecommendationsOutput> {
  return generateBookRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookRecommendationsPrompt',
  input: {schema: GenerateBookRecommendationsInputSchema},
  output: {schema: GenerateBookRecommendationsOutputSchema},
  prompt: `You are a book recommendation expert. Based on the user's search parameters, provide a list of {{{count}}} book recommendations. For each book provide a title, author, genre, publication year, and a short summary of no more than 50 words.

In addition, provide plausible but fictional analytics for each book:
- A Goodreads-style average rating out of 5 (e.g., 4.3).
- A total number of reviews (e.g., 125034).
- A common reader age group (e.g., "25-40").

Search Parameters: {{{searchParameters}}}`,
});

const generateBookRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateBookRecommendationsFlow',
    inputSchema: GenerateBookRecommendationsInputSchema,
    outputSchema: GenerateBookRecommendationsOutputSchema,
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
        if (e.cause?.status === 503 && retries > 0) {
          console.log("Model is overloaded, retrying...");
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
        } else {
          throw e;
        }
      }
    }
    throw new Error("Model is overloaded, please try again later.");
  }
);
