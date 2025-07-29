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
});
export type GenerateBookRecommendationsInput = z.infer<
  typeof GenerateBookRecommendationsInputSchema
>;

const GenerateBookRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
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
  prompt: `You are a book recommendation expert. Based on the user's search parameters, provide a list of book recommendations.

Search Parameters: {{{searchParameters}}}

Recommendations:`,
});

const generateBookRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateBookRecommendationsFlow',
    inputSchema: GenerateBookRecommendationsInputSchema,
    outputSchema: GenerateBookRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
