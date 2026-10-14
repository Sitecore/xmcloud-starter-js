import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BLOGS_ROOT, isAllowedBlogsRoot } from '@/components/uiim/article/blog-listing.util';
import { fetchBlogArticlesByIds, fetchBlogListingFromEdge } from '@/lib/blog-listing-from-edge';

export async function GET(request: NextRequest) {
  const root = request.nextUrl.searchParams.get('root') || DEFAULT_BLOGS_ROOT;
  const language = request.nextUrl.searchParams.get('language') || 'en';
  const ids = (request.nextUrl.searchParams.get('ids') || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length > 0) {
    const articles = await fetchBlogArticlesByIds(ids, language);
    if (articles.length > 0) return NextResponse.json({ articles });
  }

  if (!isAllowedBlogsRoot(root)) {
    return NextResponse.json({ articles: [] }, { status: 400 });
  }

  const articles = await fetchBlogListingFromEdge(root, language);
  return NextResponse.json({ articles });
}
