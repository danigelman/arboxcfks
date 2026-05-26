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
  const auth  = { 'api-key': API_KEY, 'Accept': 'application/json' };

  async function get(url) {
    const r = await fetch(url, { headers: auth });
    const t = await r.text();
    return { ok: r.ok, status: r.status, body: t };
  }

  if (action === 'schedule') {
    const urls = [
      BASE + '/schedule?box_fk=' + BOX_ID + '&location_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today,
      BASE + '/schedule?box_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today,
      BASE + '/schedule?location_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today,
      BASE + '/schedule?date_from=' + today + '&date_to=' + today
    ];
    for (var i = 0; i < urls.length; i++) {
      try {
        var res = await get(urls[i]);
        if (res.ok) return { statusCode: 200, headers: headers, body: res.body };
      } catch(e) {}
    }
    return { statusCode: 404, headers: headers, body: JSON.stringify({ error: 'All schedule endpoints failed' }) };
  }

  if (action === 'wod') {
    var urls2 = [
      BASE + '/workoutPlans?box_fk=' + BOX_ID + '&date=' + today,
      BASE + '/workoutPlans?location_fk=' + BOX_ID + '&date=' + today,
      BASE + '/workoutPlans?date=' + today
    ];
    for (var j = 0; j < urls2.length; j++) {
      try {
        var res2 = await get(urls2[j]);
        if (res2.ok) return { statusCode: 200, headers: headers, body: res2.body };
      } catch(e) {}
    }
    return { statusCode: 404, headers: headers, body: JSON.stringify({ error: 'All WOD endpoints failed' }) };
  }

  if (action === 'debug') {
    var toTest = [
      BASE + '/schedule?box_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today,
      BASE + '/schedule?location_fk=' + BOX_ID + '&date_from=' + today + '&date_to=' + today,
      BASE + '/schedule?date_from=' + today + '&date_to=' + today,
      BASE + '/workoutPlans?box_fk=' + BOX_ID + '&date=' + today,
      BASE + '/workoutPlans?date=' + today,
      BASE + '/boxes',
      BASE + '/locations',
      BASE + '/locations/' + BOX_ID
    ];
    var results = [];
    for (var k = 0; k < toTest.length; k++) {
      try {
        var r = await get(toTest[k]);
        results.push({ url: toTest[k], status: r.status, preview: r.body.slice(0, 300) });
      } catch(e) {
        results.push({ url: toTest[k], status: 'ERR', preview: e.message });
      }
    }
    return { statusCode: 200, headers: headers, body: JSON.stringify(results) };
  }

  return { statusCode: 400, headers: headers, body: JSON.stringify({ error: 'Unknown action' }) };
};
