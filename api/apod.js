export default async function handler(req, res) {
    const date = req.query.date || '';
    const apiKey = process.env.NASA_API_KEY;
  
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
    const data = await response.json();
  
    res.status(200).json(data);
  }
  