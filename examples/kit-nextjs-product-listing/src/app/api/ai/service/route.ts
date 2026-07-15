import { aiJsonResponse } from '@/lib/ai-json-response';
import { fetchServicesFromEdge } from '@/lib/service-from-edge';

export const revalidate = 3600;

export async function GET() {
  const { services, lastModified } = await fetchServicesFromEdge();

  return aiJsonResponse(
    { services, lastModified },
    {
      maxAge: 3600,
      sMaxAge: 3600,
      staleWhileRevalidate: 86400,
    }
  );
}
