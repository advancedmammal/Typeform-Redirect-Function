// This is the main entry point for the Netlify function.
exports.handler = async (event) => {

  // 1. Check the HTTP Method
  // Ensure the request coming from Zapier is a POST request (standard for webhooks)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // 405 = Method Not Allowed
      body: 'Method Not Allowed'
    };
  }

  // 2. Parse the Incoming Data (Payload)
  // Zapier sends data as a JSON string in the 'event.body'. We must parse it.
  const data = JSON.parse(event.body);

  // 3. Define the Destination URL
  // We extract the 'redirect_url' field. This field contains the full Form B URL
  // (with all the pre-filled data parameters) that we need to send the user to.
  const destinationUrl = data.redirect_url; 

  // Basic check to ensure the URL exists
  if (!destinationUrl) {
    return {
      statusCode: 400, // 400 = Bad Request
      body: 'Error: Missing required "redirect_url" in payload.'
    };
  }

  // 4. Issue the 302 Redirect Command
  // This object structure is how Netlify/AWS Lambda returns an HTTP response.
  // statusCode: 302 is the universal "Found/Temporary Redirect" command.
  // The 'Location' header contains the URL the browser must immediately visit.
  return {
    statusCode: 302, 
    headers: {
      Location: destinationUrl,
      'Cache-Control': 'no-cache', // Important: Prevents browsers from caching the redirect itself.
    },
    body: '' // The response body can be left empty for a redirect.
  };
};
