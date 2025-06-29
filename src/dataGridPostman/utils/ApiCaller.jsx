export const makeApiCall = async ({
    url,
    method,
    headers,
    body,
    buildUrlWithParams,
    validateAndFormatJson,
    setLoading,
    setError,
    setResponse,
  }) => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
  
    setLoading(true);
    setError(null);
    setResponse(null);
  
    try {
      const finalUrl = buildUrlWithParams();
  
      const validHeaders = headers
        .filter(h => h.key.trim() && h.value.trim())
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
  
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...validHeaders,
        },
      };
  
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        const formatted = validateAndFormatJson(body);
        if (formatted === null) {
          setError('Invalid JSON in request body');
          setLoading(false);
          return;
        }
        options.body = body;
      }
  
      const res = await fetch(finalUrl, options);
  
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
  
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
        url: finalUrl,
      });
    } catch (err) {
      setError(err.message || 'Failed to make API call');
    } finally {
      setLoading(false);
    }
  };
  