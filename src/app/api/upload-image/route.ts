import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError
} from '@/infrastructure/api/supabaseResponseUtils';
import { ImageUploadResponseDto } from '@/domains/image/types/dto/imageDto';

// 단일 파일 업로드 헬퍼 함수
async function uploadSingleFile(file: File, index: number, imageType: string): Promise<ImageUploadResponseDto> {
  const supabase = await createSupabaseClientWithCookie();

  // 날짜 기반 경로 생성
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  // UUID 생성 (더 안전한 파일명)
  const uuid = crypto.randomUUID();
  const fileExt = file.name.split('.').pop();

  const folderPath = `${imageType}/${year}/${month}/${day}`;
  const fileName = `${folderPath}/${uuid}.${fileExt}`;

  // Supabase Storage에 업로드
  const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET_NAME || 'pickdam';

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '2592000', // 30일 (UUID 기반 파일명이므로 안전)
      upsert: false
    });

  if (error) {
    throw error;
  }

  // 공개 URL 생성
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return {
    success: true,
    originalIndex: index,
    originalFileName: file.name,
    originalFileSize: file.size,
    originalFileType: file.type,
    path: data.path,
    url: publicUrl,
    fileName: fileName
  } as ImageUploadResponseDto;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageType = formData.get('type') as string;

    // 항상 다중 파일로 처리 ('file' 단일 파일도 'files' 배열에 포함)
    const singleFile = formData.get('file') as File;
    const multipleFiles = formData.getAll('files') as File[];

    // 모든 파일을 files 배열로 통합
    const files: File[] = [];
    if (singleFile) files.push(singleFile);
    if (multipleFiles.length > 0) files.push(...multipleFiles);

    if (files.length === 0) {
      const response = createSuccessResponse([]);
      return NextResponse.json(response, { status: 200 });
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await uploadSingleFile(file, index, imageType);
        return result;
      } catch (error) {
        return {
          success: false,
          originalIndex: index,
          originalFileName: file.name,
          originalFileSize: file.size,
          originalFileType: file.type,
          path: '',
          url: '',
          fileName: '',
          error: error instanceof Error ? error.message : '알 수 없는 오류'
        } as ImageUploadResponseDto & { error: string };
      }
    });

    // 모든 업로드를 병렬로 실행
    const results = await Promise.all(uploadPromises);
    
    // 성공/실패 분리
    const failed = results.filter(r => !r.success);
    
    // 실패가 있을 경우 첫 번째 실패 에러 반환
    if (failed.length > 0) {
      const failedResult = failed[0];
      if (failedResult && 'error' in failedResult) {
        const mappedError = mapApiError({ message: failedResult.error, status: StatusCodes.INTERNAL_SERVER_ERROR });
        const errorResponse = createErrorResponse(mappedError);
        return NextResponse.json(errorResponse, { status: mappedError.statusCode });
      }
    }

    // 항상 배열로 반환 (단일 파일도 배열로 통일)
    const response = createSuccessResponse(results);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const mappedError = mapApiError(error);
    const errorResponse = createErrorResponse(mappedError);
    return NextResponse.json(errorResponse, { status: mappedError.statusCode });
  }
}