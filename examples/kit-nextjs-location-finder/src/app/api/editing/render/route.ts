import { createEditingRenderRouteHandlers } from '@sitecore-content-sdk/nextjs/route-handler';

/**
 * This API route is used by Sitecore Editor in XM Cloud
 * to render components for editing mode.
 */

export const { GET, POST, OPTIONS } = createEditingRenderRouteHandlers({});
