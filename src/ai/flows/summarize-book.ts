'use server';

/**
 * @fileOverview Book summarization flow.
 *
 * - summarizeBook - A function that summarizes a book given its title, author, and summary.
 * - SummarizeBookInput - The input type for the summarizeBook function.
 * - SummarizeBookOutput - The return type for the summarizeBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBookInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  summary: z.string().describe('The existing summary of the book.'),
});
export type SummarizeBookInput = z.infer<typeof SummarizeBookInputSchema>;

const SummarizeBookOutputSchema = z.object({
  shortSummary: z.string().describe('A short summary of the book.'),
});
export type SummarizeBookOutput = z.infer<typeof SummarizeBookOutputSchema>;

export async function summarizeBook(input: SummarizeBookInput): Promise<SummarizeBookOutput> {
  return summarizeBookFlow(input);
}

const summarizeBookPrompt = ai.definePrompt({
  name: 'summarizeBookPrompt',
  input: {schema: SummarizeBookInputSchema},
  output: {schema: SummarizeBookOutputSchema},
  prompt: `You are a book critic who specializes in writing short summaries.

  Given the following information about a book:

  Title: {{{title}}}
  Author: {{{author}}}
  Summary: {{{summary}}}

  Write a short summary of the book that is no more than 50 words.`,
});

const summarizeBookFlow = ai.defineFlow(
  {
    name: 'summarizeBookFlow',
    inputSchema: SummarizeBookInputSchema,
    outputSchema: SummarizeBookOutputSchema,
  },
  async input => {
    let retries = 3;
    while (retries > 0) {
      try {
        const {output} = await summarizeBookPrompt(input);
        if (output) {
          return output;
        }
        throw new Error('No output from prompt.');
      } catch (e: any) {
        if (e.cause?.status === 503 && retries > 1) {
          console.log(`Model is overloaded, retrying... (${retries - 1} attempts left)`);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
        } else {
          console.error("Failed to summarize book after multiple retries:", e);
          // Return a fallback summary on error
          return { shortSummary: "Could not generate a summary at this time." };
        }
      }
    }
    // This part should ideally not be reached, but it's a final guard.
    return { shortSummary: "Could not generate a summary due to high load." };
  }
);
