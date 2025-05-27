import { NextRequest, NextResponse } from 'next/server';
import { getCachedImage,cacheImage } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  //Check if image is cached first
  const cached = getCachedImage(url);
  if(cached) {
    return new NextResponse(cached.data,{
        headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'HIT'
      },
    })
  }
  
  try {
    // Set a reasonable timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    const imageResponse = await fetch(url, { 
      signal: controller.signal,
      cache: 'force-cache' // Use force-cache to strongly cache the response
    });
    
    clearTimeout(timeoutId);
    
    if (!imageResponse.ok) {
      return new NextResponse('Failed to fetch image', { status: imageResponse.status });
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    // Cache the image data
    cacheImage(url, imageBuffer, contentType);
    
    // Set strong caching headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}