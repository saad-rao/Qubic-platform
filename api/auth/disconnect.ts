export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    res.status(200).json({ message: "Disconnected successfully" });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Failed to disconnect" });
  }
} 