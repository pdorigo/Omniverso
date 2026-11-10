export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { eventName, email, phone } = req.body || {};
  const pixelId = '1120541794236719';
  const token = process.env.META_CAPI_TOKEN;
  const response = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: eventName || 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: 'https://www.omniverso.dev',
        user_data: {
          em: email ? [email] : undefined,
          ph: phone ? [phone] : undefined
        }
      }]
    })
  });
  const data = await response.json();
  return res.status(200).json(data);
}
