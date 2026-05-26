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
  const action  = (event.queryStringParameters || {}).action || 'schedule';

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth()+1).padStart(2,'0') + '-' +
      String(d.getDate()).padStart(2,'0');
  }

  const today = todayISO();

  async function get(url, extraHeaders) {
    var h = Object.assign({ 'Accept': 'application/json' }, extraHeaders);
    const r = await fetch(url, { headers: h });
    const t = await r.text();
    return { ok: r.ok, status: r.status, body: t };
  }

  if (action === 'debug') {
    var baseUrl = BASE + '/schedule?box_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today;
    var toTest = [
      { url: baseUrl, headers: { 'api-key': API_KEY }, label: 'header: api-key' },
      { url: baseUrl, headers: { 'Authorization': 'Bearer ' + API_KEY }, label: 'header: Bearer' },
      { url: baseUrl, headers: { 'Authorization': API_KEY }, label: 'header: Authorization' },
      { url: baseUrl + '&api-key=' + API_KEY, headers: {}, label: 'query: api-key' },
      { url: baseUrl + '&token=' + API_KEY, headers: {}, label: 'query: token' },
      { url: baseUrl + '&apiKey=' + API_KEY, headers: {}, label: 'query: apiKey' },
      { url: BASE + '/schedule?box_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today, headers: { 'api-key': API_KEY, 'Authorization': 'Bearer ' + API_KEY }, label: 'both headers' },
      { url: BASE + '/locations', headers: { 'api-key': API_KEY }, label: 'locations + api-key header' },
    ];
    var results = [];
    for (var k = 0; k < toTest.length; k++) {
      try {
        var r = await get(toTest[k].url, toTest[k].headers);
        results.push({ label: toTest[k].label, status: r.status, preview: r.body.slice(0, 200) });
      } catch(e) {
        results.push({ label: toTest[k].label, status: 'ERR', preview: e.message });
      }
    }
    return { statusCode: 200, headers: headers, body: JSON.stringify(results) };
  }

  return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Use action=debug' }) };
};
