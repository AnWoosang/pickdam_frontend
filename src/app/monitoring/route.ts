import { NextRequest } from 'next/server';

// Sentry 터널링을 위한 프록시 엔드포인트
export async function POST(request: NextRequest) {
  try {

    // 환경변수에서 Sentry DSN 가져오기
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!sentryDsn) {
      return new Response('Sentry DSN not configured', { status: 404 });
    }

    // 요청 바디 읽기
    const body = await request.text();

    // 바디가 비어있으면 에러 반환
    if (!body || body.length === 0) {
      return new Response('Empty request body', { status: 400 });
    }

    // DSN 파싱 (에러 처리 추가)
    let dsnUrl: URL;
    let projectId: string;

    try {
      dsnUrl = new URL(sentryDsn);
      projectId = dsnUrl.pathname.substring(1);
    } catch (dsnError) {
      console.error('Invalid Sentry DSN:', dsnError);
      return new Response('Invalid Sentry DSN', { status: 500 });
    }

    // 쿼리 파라미터 유지
    const { searchParams } = new URL(request.url);
    const sentryUrl = `https://${dsnUrl.hostname}/api/${projectId}/envelope/`;
    const finalUrl = new URL(sentryUrl);
    searchParams.forEach((value, key) => {
      finalUrl.searchParams.set(key, value);
    });

    // Sentry로 프록시 (타임아웃 추가)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    try {
      const response = await fetch(finalUrl.toString(), {
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/x-sentry-envelope',
          'User-Agent': request.headers.get('User-Agent') || 'Sentry-Tunnel',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 응답 바디를 읽고 새 응답 생성
      const responseText = await response.text();

      return new Response(responseText, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      return new Response('Upstream server error', { status: 502 });
    }

  } catch (error) {
    console.error('Sentry tunnel error:', error);
    return new Response(`Error: ${error}`, { status: 500 });
  }
}

// CORS preflight 요청 처리
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}