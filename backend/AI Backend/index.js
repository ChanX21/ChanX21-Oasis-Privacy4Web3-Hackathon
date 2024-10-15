const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.post('/api/chat/diagnosticsAssistant', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a Diagnostic Assistant who is able to help the doctor with the patient's medical history and current symptoms and give a suggested diagnosis and " },
        { role: "user", content: prompt }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request', errorMessage: error.message });
  }
});

app.post('/api/chat/personalizedPlanAssistance', async (req, res) => {
    try {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
  
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an medical Assistant who is able to help the patient with the personalized medical plan and give a suggested treatment plan. " },
          { role: "user", content: prompt }
        ],
      });
  
      const aiResponse = completion.choices[0].message.content;
      res.json({ response: aiResponse });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred while processing your request', errorMessage: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
