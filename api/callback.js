module.exports = async function handler(req, res) {
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
        code: code
      })
    });

    const data = await tokenRes.json();
    const access_token = data.access_token;
    const error = data.error;

    if (error || !access_token) {
      return res.send(buildResponse('error', { error: error || 'No token received' }));
    }

    res.send(buildResponse('success', { token: access_token, provider: 'github' }));

  } catch (err) {
    res.send(buildResponse('error', { error: err.message }));
  }
};

function buildResponse(status, data) {
  var message = JSON.stringify('authorization:github:' + status + ':' + JSON.stringify(data));

  return '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head><title>Authenticating...</title></head>\n' +
    '<body>\n' +
    '<script>\n' +
    '(function () {\n' +
    '  var MSG = ' + message + ';\n' +
    '  function receiveMessage(e) {\n' +
    '    if (e.data === \'authorizing:github\') {\n' +
    '      window.opener.postMessage(MSG, e.origin);\n' +
    '      window.removeEventListener(\'message\', receiveMessage);\n' +
    '      window.close();\n' +
    '    }\n' +
    '  }\n' +
    '  window.addEventListener(\'message\', receiveMessage);\n' +
    '  window.opener.postMessage(\'authorizing:github\', \'*\');\n' +
    '})();\n' +
    '</script>\n' +
    '<p>Authenticating, please wait...</p>\n' +
    '</body>\n' +
    '</html>';
}
