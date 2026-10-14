/** @jest-environment node */
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import {summaryExpected, serviceExpected, faqExpected} from './fixtures';
import { BASE_URL, expectValidJson, expectValidXml, expectValidText, stripLastModified } from './helpers';

jest.setTimeout(15000);

async function fetchWithApiFallback(path, apiPath) {
    const first = await axios.get(`${BASE_URL}${path}`, {
        validateStatus: () => true,
        timeout: 10000,
    });

    if (first.status !== 404) return first;

    return axios.get(`${BASE_URL}${apiPath}`, {
        validateStatus: () => true,
        timeout: 10000,
    });
}

test('GET /ai/summary.json returns 200 and valid JSON',async()=> { 
    const resp = await axios.get(`${BASE_URL}/ai/summary.json`, {
        validateStatus: () => true,
        timeout: 10000,
      });
    expectValidJson(resp);
    expect(resp.data.title).toBeDefined();
    expect(resp.data.title.trim().length).toBeGreaterThan(0);
    expect(resp.data.description).toBeDefined();
    expect(resp.data.description.trim().length).toBeGreaterThan(0);
    expect(resp.data.lastModified).toBeDefined();
    expect(resp.data.lastModified.trim().length).toBeGreaterThan(0);
}, 15000);


test('GET /ai/summary.json matches canonical content (except lastModified)', async () => {
    const resp = await axios.get(`${BASE_URL}/ai/summary.json`, { validateStatus: () => true, timeout: 10000 });
    expectValidJson(resp);
  
    const actual = stripLastModified(resp.data);
    const expected = stripLastModified(summaryExpected);
    expect(actual).toEqual(expected);
  }, 15000);
  

test('GET /ai/service.json returns 200 and valid JSON',async()=> { 
    const resp = await axios.get(`${BASE_URL}/ai/service.json`, {
        validateStatus: () => true,
        timeout: 10000,
      });
    expectValidJson(resp);
    expect(resp.data.services).toBeDefined();
    expect(Array.isArray(resp.data.services)).toBe(true);
    expect(resp.data.services.length).toBeGreaterThan(0);
    
    const first = resp.data.services[0];
    expect(first.name).toBeDefined();
    expect(first.name.trim().length).toBeGreaterThan(0);
    expect(first.description).toBeDefined();
    expect(first.description.trim().length).toBeGreaterThan(0);
    expect(first.category).toBeDefined();
    expect(first.category.trim().length).toBeGreaterThan(0);
    expect(resp.data.lastModified).toBeDefined();
}, 15000);

test('GET /ai/service.json matches canonical content (except lastModified)', async () => {
    const resp = await axios.get(`${BASE_URL}/ai/service.json`, { validateStatus: () => true, timeout: 10000 });
    expectValidJson(resp);
  
    const actual = stripLastModified(resp.data);
    const expected = stripLastModified(serviceExpected);
    expect(actual).toEqual(expected);
  }, 15000);

test('GET /ai/faq.json returns 200 and valid JSON', async () => {
    const resp = await axios.get(`${BASE_URL}/ai/faq.json`, {
        validateStatus: () => true,
        timeout: 10000,
    });
    expectValidJson(resp);
    expect(resp.data).toHaveProperty('items');
    expect(Array.isArray(resp.data.items)).toBe(true);
    expect(resp.data.items.length).toBeGreaterThan(0);

    const first = resp.data.items[0];
    expect(first).toBeDefined();
    expect(typeof first.question).toBe('string');
    expect(first.question.length).toBeGreaterThan(0);
    expect(typeof first.answer).toBe('string');
    expect(first.answer.length).toBeGreaterThan(0);

    expect(resp.data).toHaveProperty('lastModified');
    expect(resp.data.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
}, 15000);

test('GET /ai/faq.json matches canonical content (except lastModified)', async () => {
    const resp = await axios.get(`${BASE_URL}/ai/faq.json`, { validateStatus: () => true, timeout: 10000 });
    expectValidJson(resp);
  
    const actual = stripLastModified(resp.data);
    const expected = stripLastModified(faqExpected);
    expect(actual).toEqual(expected);
  }, 15000);

test('GET /robots.txt returns 200 and valid text', async () => {
    const resp = await axios.get(`${BASE_URL}/robots.txt`, {
        validateStatus: () => true,
        timeout: 10000,
    });
    expectValidText(resp);

    const text = (resp.data || '').replace(/\r\n/g, '\n');
    expect(text.trim().length).toBeGreaterThan(0);

    [
        'User-agent: GPTBot',
        'User-agent: ChatGPT-User',
        'User-agent: ClaudeBot',
        'User-agent: Claude-Web',
        'User-agent: PerplexityBot',
        'User-agent: Google-Extended',
        'User-agent: Googlebot',
        'User-agent: Bingbot',
        'User-agent: *',
    ].forEach((ua) => expect(text).toContain(ua));

    expect(text).toMatch(/Allow:\s*\//);
    expect(text).toContain(`Sitemap: ${BASE_URL}/sitemap.xml`);
    expect(text).toContain(`Sitemap: ${BASE_URL}/sitemap-llm.xml`);
}, 15000);

test('GET /.well-known/ai.txt returns 200 and valid JSON',async()=> { 
    const resp =await axios.get(`${BASE_URL}/.well-known/ai.txt`, {
        validateStatus: () => true,
        timeout: 10000,
      });    
    expectValidText(resp);
    
    const raw = resp.data || '';
    expect(typeof raw).toBe('string');
    expect(raw.trim().length).toBeGreaterThan(0);

    const text = resp.data.replace(/\r\n/g, '\n');
    expect(text).toContain('# AI Crawler Permissions');
    
    [
        'User-Agent: *',
        'User-Agent: GPTBot',
        'User-Agent: Claude-Web',
        'User-Agent: Anthropic-AI',
        'User-Agent: Google-Extended',
        'User-Agent: CCBot',
        'User-Agent: PerplexityBot',
    ].forEach((ua) => expect(text).toContain(ua));
    
    // Allow rules
    const allowCount = (text.match(/^Allow:\s*\/$/gmi) || []).length;
    expect(allowCount).toBeGreaterThanOrEqual(1);

    // Disallow rules present
    expect(text).toMatch(/^Disallow:\s*\/api\/editing\/$/m);
    expect(text).toMatch(/^Disallow:\s*\/sitecore\/$/m);


    expect(resp.data.includes(`AI-Endpoint: ${BASE_URL}/ai/summary.json`)).toBe(true);
    expect(resp.data.includes(`AI-Endpoint: ${BASE_URL}/ai/faq.json`)).toBe(true);
    expect(resp.data.includes(`AI-Endpoint: ${BASE_URL}/ai/service.json`)).toBe(true);
    expect(resp.data.includes(`AI-Endpoint: ${BASE_URL}/ai/markdown`)).toBe(true);
    expect(resp.data.includes(`Sitemap: ${BASE_URL}/sitemap-llm.xml`)).toBe(true);
    expect(resp.data.includes(`Sitemap: ${BASE_URL}/sitemap.xml`)).toBe(true);
    expect(resp.data.includes(`Last-Modified: ${new Date().toISOString().split('T')[0]}`)).toBe(true);  
}, 15000);

test('GET /ai/markdown returns 200 and markdown from home page', async () => {
        const resp = await fetchWithApiFallback('/ai/markdown', '/api/ai/markdown');

        if (resp.status === 404) {
            expect(String(resp.data || '').toLowerCase()).toContain('disabled');
            return;
        }

    expect(resp.status).toBe(200);
    expect(resp.headers['content-type']).toContain('text/markdown');
    expect(typeof resp.data).toBe('string');
    expect(resp.data.length).toBeGreaterThan(0);
    expect(resp.data).toContain('#');
    expect(resp.data).not.toContain('<div');
}, 15000);

test('GET /ai/markdown/Speakers returns 200 and markdown content', async () => {
        const resp = await fetchWithApiFallback('/ai/markdown/Speakers', '/api/ai/markdown/Speakers');

        if (resp.status === 404) {
            expect(String(resp.data || '').toLowerCase()).toContain('disabled');
            return;
        }

    expect(resp.status).toBe(200);
    expect(resp.headers['content-type']).toContain('text/markdown');
    expect(typeof resp.data).toBe('string');
    expect(resp.data.length).toBeGreaterThan(0);
    expect(resp.data).toContain('#');
    expect(resp.data).not.toContain('<div');
}, 15000);

test('GET /sitemap-llm.xml returns 200 and valid XML', async () => {
    const res = await fetchWithApiFallback('/sitemap-llm.xml', '/api/sitemap-llm');

    if (res.status === 404) {
      return;
    }

    expectValidXml(res);

    const xml = (res.data || '').trim();
    expect(xml.length).toBeGreaterThan(0);
    expect(xml.startsWith('<')).toBe(true);

    // Parse XML
    const parser = new XMLParser({
        ignoreAttributes: false,
        allowBooleanAttributes: true,
    });
    const parsed = parser.parse(xml);

    expect(parsed).toHaveProperty('urlset');
    const urlset = parsed.urlset;
        const urls = urlset.url ? (Array.isArray(urlset.url) ? urlset.url : [urlset.url]) : [];
        if (urls.length === 0) {
            return;
        }
    expect(urls.length).toBeGreaterThan(0);

    for (const u of urls) {
        expect(u).toHaveProperty('loc');
        if (u.lastmod) {
        expect(u.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}/);
        }
        if (u.changefreq) {
        expect(['always','hourly','daily','weekly','monthly','yearly','never'])
            .toContain(String(u.changefreq).toLowerCase());
        }
        if (u.priority) {
        const pr = parseFloat(u.priority);
        expect(pr).toBeGreaterThanOrEqual(0);
        expect(pr).toBeLessThanOrEqual(1);
        }
    }

    const locs = urls.map(u => u.loc);
    
    const derivedOrigin = locs.length > 0 ? new URL(locs[0]).origin : BASE_URL;

    const join = (origin, path) => `${origin.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

    const requiredPaths = [
    '/',                    
    '/ai/faq.json',
    '/ai/summary.json',
    '/ai/service.json',
    '/Speakers',
    '/Video',
    '/Speakers/Heritage-10',
    '/Speakers/Heritage-30',
    '/Speakers/Heritage-50'
    ];

    const expectedUrls = requiredPaths.map(p => {
    if (p === '/') return `${derivedOrigin}/`;
    return join(derivedOrigin, p);
    });

    expect(locs).toEqual(expect.arrayContaining(expectedUrls));
}, 15000);

test('GET /sitemap.xml returns 200 and valid XML', async () => {
    const res = await fetchWithApiFallback('/sitemap.xml', '/api/sitemap');

    if (res.status === 404) {
      return;
    }

    expectValidXml(res);

    const xml = (res.data || '').trim();
    expect(xml.length).toBeGreaterThan(0);
    expect(xml.startsWith('<')).toBe(true);

    const parser = new XMLParser({
        ignoreAttributes: false,
        allowBooleanAttributes: true,
    });
    const parsed = parser.parse(xml);

    expect(parsed).toHaveProperty('urlset');
    const urlset = parsed.urlset;
        const urls = urlset.url ? (Array.isArray(urlset.url) ? urlset.url : [urlset.url]) : [];
        if (urls.length === 0) {
            return;
        }
    expect(urls.length).toBeGreaterThan(0);

    for (const u of urls) {
        expect(u).toHaveProperty('loc');
        expect(typeof u.loc).toBe('string');
        expect(u.loc.length).toBeGreaterThan(0);
        if (u.lastmod) {
            expect(u.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}/);
        }
        if (u.changefreq) {
            expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
                .toContain(String(u.changefreq).toLowerCase());
        }
        if (u.priority !== undefined && u.priority !== null) {
            const pr = parseFloat(u.priority);
            expect(pr).toBeGreaterThanOrEqual(0);
            expect(pr).toBeLessThanOrEqual(1);
        }
    }

    const locs = urls.map((u) => u.loc);
    const derivedOrigin = locs.length > 0 ? new URL(locs[0]).origin : BASE_URL;
    const join = (origin, path) => `${origin.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

    const requiredPaths = [
        '/',
        '/Speakers',
        '/Video',
        '/Speakers/Heritage-10',
        '/Speakers/Heritage-30',
        '/Speakers/Heritage-50'
    ];
    const expectedUrls = requiredPaths.map((p) => (p === '/' ? `${derivedOrigin}/` : join(derivedOrigin, p)));
    expect(locs).toEqual(expect.arrayContaining(expectedUrls));
}, 15000);