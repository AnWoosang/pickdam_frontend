import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils';
import { PriceHistoryItemResponseDto } from '@/domains/product/types/dto/productDto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: productId } = await params;
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const yearNum = parseInt(year || '');
    const monthNum = parseInt(month || '');

    // 월의 첫날과 마지막날 계산
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0); // 다음달의 0일 = 현재달의 마지막날

    // 로컬 timezone 기준으로 날짜 문자열 생성 (UTC 변환 방지)
    const formatLocalDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDateStr = formatLocalDate(startDate);
    const endDateStr = formatLocalDate(endDate);

    // supabase를 사용하여 직접 쿼리
    const { data, error } = await supabase
      .from('product_price_history')
      .select('recorded_date, lowest_price')
      .eq('product_id', productId)
      .gte('recorded_date', startDateStr)
      .lte('recorded_date', endDateStr)
      .order('recorded_date', { ascending: true });

    if (error) {
      const mappedError = mapApiError(error);
      return NextResponse.json(createErrorResponse(mappedError), { status: mappedError.statusCode });
    }

    // 데이터 형식 변환 - DTO 형식으로
    const formattedData: PriceHistoryItemResponseDto[] = data?.map(item => ({
      date: item.recorded_date,
      price: Number(item.lowest_price)
    })) || [];

    return NextResponse.json(createSuccessResponse(formattedData));

  } catch (error) {
    const mappedError = mapApiError(error);
    return NextResponse.json(createErrorResponse(mappedError), { status: mappedError.statusCode });
  }
}