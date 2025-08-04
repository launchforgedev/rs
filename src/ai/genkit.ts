import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file is kept for potential future development but is not currently used
// by any active flows in the application.

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
