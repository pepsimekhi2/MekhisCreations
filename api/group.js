export default async function handler(req, res) {
  // Fetch the Roblox API server-side
  const groupId = "33719761"; // or get from query
  const apiUrl = `https://groups.roblox.com/v1/groups/${groupId}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  // Set CORS header to allow frontend access
  res.setHeader("Access-Control-Allow-Origin", "*"); // or restrict to your domain
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  res.status(200).json(data);
}
