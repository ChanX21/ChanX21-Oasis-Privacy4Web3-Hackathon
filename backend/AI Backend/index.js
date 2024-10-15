const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');
const ethers = require('ethers');
const PrivaHealthABI = require('../abis/PrivaHealth.json'); // Make sure to have this file with the ABI

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Set up Ethereum provider and contract for Sapphire TestNet
const provider = new ethers.JsonRpcProvider(process.env.SAPPHIRE_TESTNET_RPC_URL);
const privaHealthAddress = process.env.PRIVAHEALTH_CONTRACT_ADDRESS;
const privaHealthContract = new ethers.Contract(privaHealthAddress, PrivaHealthABI, provider);

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

app.get('/api/getResearchData', async (req, res) => {
  try {
    const patientRecords = await privaHealthContract.getPatientRecords();
    console.log({patientRecords})
    
    // Transform the data to a more readable format
    const formattedRecords = patientRecords.map(record => ({
      patientAddress: record[0],
      name: record[1],
      dateOfBirth: new Date(Number(record[2])*1000).toLocaleDateString(),
      gender: record[3],   
      medicalRecord: record[6],
      currentMedications: record[7],
      allergies: record[8],
      bloodType: record[9]
    }));

    res.json({ researchData: formattedRecords });
  } catch (error) {
    console.error('Error fetching research data:', error);
    res.status(500).json({ error: 'An error occurred while fetching research data', errorMessage: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
