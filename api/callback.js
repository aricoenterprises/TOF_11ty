export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code
      })
    });

    const { access_token, error } = await tokenRes.json();

    if (error || !access_token) {
      return res.send(buildResponse('error', { error: error || 'No token received' }));
    }

    res.send(buildResponse('success', { token: access_token, provider: 'github' }));

  } catch (err) {
    res.send(buildResponse('error', { error: err.message }));
  }
}

function buildResponse(status, data) {
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(data)}`);

  return `<!DOCTYPE html>
<html>
<head><title>Authenticating...</title></head>
<body>
<script>
  (function () {
    var MSG = ${message};
    function receiveMessage(e) {
      if (e.data === 'authorizing:github') {
        window.opener.postMessage(MSG, e.origin);
        window.removeEventListener('message', receiveMessage);
        window.close();
      }
    }
    window.addEventListener('message', receiveMessage);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Authenticating, please wait...</p>
</body>
</html>`;
}
