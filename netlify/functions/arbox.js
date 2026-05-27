exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const API_KEY     = 'GEZRKWBW-GUOL-9IHN-L8IY-CHRXSWLGH1WM';
  const LOCATION_ID = '7';
  const BASE        = 'https://arboxserver.arboxapp.com/api/public';
  const action      = (event.queryStringParameters || {}).action || 'schedule';

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth()+1).padStart(2,'0') + '-' +
      String(d.getDate()).padStart(2,'0');
  }

  const today = todayISO();
  const auth  = { 'api-key': API_KEY, 'Accept': 'application/json' };

  async function get(url) {
    const r = await fetch(url, { headers: auth });
    const t = await r.text();
    return { ok: r.ok, status: r.status, body: t };
  }

  if (action === 'schedule') {
    try {
      var url = BASE + '/v3/schedule?location_id=' + LOCATION_ID +
        '&from_date=' + today + '&to_date=' + today +
        '&Registration_count=1&registration_details=1&sort=asc';
      var res = await get(url);
      return { statusCode: res.status, headers: headers, body: res.body };
    } catch(e) {
      return { statusCode: 500, headers: headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  if (action === 'wod') {
    try {
      var url2 = BASE + '/v3/schedule?location_id=' + LOCATION_ID +
        '&from_date=' + today + '&to_date=' + today + '&sort=asc';
      var res2 = await get(url2);
      return { statusCode: res2.status, headers: headers, body: res2.body };
    } catch(e) {
      return { statusCode: 500, headers: headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Unknown action' }) };
};
