import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, everyone!' });
});

const conversations = new Map<string, string>();
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, { message: 'Prompt cannot be empty' })
      .max(200, { message: 'Prompt cannot exceed 200 characters' }),
   conversationId: z.string(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);
   if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
   }

   try {
      const { prompt, conversationId } = req.body;

      const response = await client.responses.create({
         model: 'gpt-5.6-luna',
         input: prompt,
         max_output_tokens: 200,
         previous_response_id: conversations.get(conversationId),
      });

      conversations.set(conversationId, response.id);
      res.json({ message: response.output_text });
   } catch {
      res.status(500).json({
         message: 'An error occurred while processing your request.',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
