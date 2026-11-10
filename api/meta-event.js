export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { eventName, email, phone } = req.body || {};
  const pixelId = '1120541794236719';
  const token = process.env.META_CAPI_TOKEN;

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.headers['x-real-ip'] || '';
  const ua = req.headers['user-agent'] || '';
  const cookie = req.headers.cookie || '';
  const getCookie = (name) => {
    const m = cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[2]) : undefined;
  };

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
          client_ip_address: ip || undefined,
          client_user_agent: ua || undefined,
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
          em: email ? [email] : undefined,
          ph: phone ? [phone] : undefined
        }
      }]
    })
  });
  const data = await response.json();
  return res.status(200).json(data);
}
