import { createEditingConfigRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import { NextRequest, NextResponse } from 'next/server';
import components from '.sitecore/component-map';
import metadata from '.sitecore/metadata.json';
import clientComponents from '.sitecore/component-map.client';
/**
 * This API route is used by Sitecore Editor in XM Cloud
 * to provide editing configuration.
 */

const baseHandler = createEditingConfigRouteHandler({
  components,
  clientComponents,
  metadata,
});

/**
 * Wrap GET handler to add CORS headers
 */
export async function GET(request: NextRequest) {
  const response = await baseHandler.GET(request);

  // Add CORS headers to the response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Clone the response and add CORS headers
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Handle CORS preflight requests for XM Cloud Page Editor
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
