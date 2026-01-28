// pages/api/weather.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { city } = req.query; // Get city from the query parameter

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  const API_KEY = process.env.OPENWEATHERMAP_API_KEY; // Keep the API key on the server-side

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
      throw new Error(`Error fetching weather: ${weatherRes.statusText}`);
    }

    const data = await weatherRes.json();

    if (!data.weather || !data.main) {
      return res.status(500).json({ error: 'Incomplete weather data' });
    }

    return res.status(200).json(data); // Return the weather data to the client
} catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
