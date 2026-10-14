const BASE_URL = (process.env.GEO_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

function expectValidJson(response) {
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expectCachingHeaders(response.headers);
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe('object');
}

function expectValidXml(response) {
    expect(response.status).toBe(200);
    const ct = (response.headers['content-type'] || '').toLowerCase();
    expect(ct.includes('application/xml') || ct.includes('text/xml')).toBe(true);
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe('string');
}

function expectValidText(response) {
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expectCachingHeaders(response.headers);
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe('string');
}


function stripLastModified(obj) {
  if (obj && typeof obj === 'object') {
    const rest = { ...obj };
    delete rest.lastModified;
    return rest;
  }
  return obj;
}

function expectCachingHeaders(headers) {
    const cacheControl = headers['cache-control'];
    const lastModified = headers['last-modified'];
    const etag = headers['etag'];
  
    // Cache-Control must exist
    expect(cacheControl).toBeTruthy();
  
    // Require at least one validator header: Last-Modified or ETag
    const hasValidator = Boolean(lastModified || etag);
  
    if (process.env.ENFORCE_CACHE_HEADERS === 'true') {
      expect(hasValidator).toBe(true);
    }
  }

export { BASE_URL, expectCachingHeaders, expectValidJson, expectValidXml, expectValidText, stripLastModified }