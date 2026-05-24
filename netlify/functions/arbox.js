exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const API_KEY = 'GEZRKWBW-GUOL-9IHN-L8IY-CHRXSWLGH1WM';
  const BOX_ID  = '7';
  const BASE    = 'https://api.arboxapp.com/index.php/api/v2';

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  const today  = todayISO();
  const action = (event.queryStringParameters || {}).action || 'schedule';

  const authHeaders = {
    'api-key': API_KEY,
    'Accept':  'application/json'
  };

  async function tryUrls(urls) {
    for (const url of urls) {
      try {
        const r    = await fetch(url, { headers: authHeaders });
        const text = await r.text();
        if (r.ok) return { ok: true, body: text };
      } catch(e) {}
    }
    return { ok: false, body: JSON.stringify({ error: 'All endpoints failed' }) };
  }

  if (action === 'schedule') {
    const result = await tryUrls([
      `${BASE}/schedule?box_fk=${BOX_ID}&location_fk=${BOX_ID}&date_from=${today}&date_to=${today}`,
      `${BASE}/schedule?box_fk=${BOX_ID}&date_from=${today}&date_to=${today}`,
      `${BASE}/schedule?location_fk=${BOX_ID}&date_from=${today}&date_to=${today}`,
      `${BASE}/schedule?date_from=${today}&date_to=${today}`,
    ]);
    return { statusCode: result.ok ? 200 : 404, headers, body: result.body };
  }

  if (action === 'wod') {
    const result = await tryUrls([
