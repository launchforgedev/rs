'use server';

/**
 * @fileOverview A flow to generate a book cover image.
 *
 * - generateBookCover - A function that generates a book cover image.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookCoverInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  summary: z.string().describe('A short summary of the book.'),
});

export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;

export async function generateBookCover(input: GenerateBookCoverInput): Promise<string> {
  let retries = 3;
  while (retries > 0) {
    try {
      const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: `A stunning, high-resolution, professional book cover for a book titled "${input.title}" by ${input.author}. The cover should visually represent the following summary: ${input.summary}. The design should be modern, eye-catching, and suitable for a bestseller. Avoid text on the cover itself.`,
          config: {
              responseModalities: ['TEXT', 'IMAGE'],
          },
      });

      if (!media.url) {
          throw new Error('Image generation failed to produce a result.');
      }
      return media.url;
    } catch (e: any) {
        if ((e.cause?.status === 503 || e.message.includes('429')) && retries > 0) {
          console.log(`Image generation failed, retrying... (${retries} attempts left)`);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
        } else {
          // For any other error, or if retries are exhausted, throw it
          throw e;
        }
      }
    }
    // If all retries fail, return a placeholder as a fallback.
    return 'https://placehold.co/300x450.png';
}