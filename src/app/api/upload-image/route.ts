import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
;
import { validateImageFile } from '@/utils/fileValidation';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  mapApiError, 
  getStatusFromErrorCode 
} from '@/infrastructure/api/supabaseResponseUtils';

// 단일 파일 업로드 헬퍼 함수
async function uploadSingleFile(file: File, index: number, imageType: string) {
  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 날짜 기반 경로 생성
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  // UUID 생성 (더 안전한 파일명)
  const uuid = crypto.randomUUID();
  const fileExt = file.name.split('.').pop();
  
  // 도메인별 날짜 기반 폴더 구조: /contentType/YYYY/MM/DD/uuid.ext
  const folderPath = `${imageType}/${year}/${month}/${day}`;
  const fileName = `${folderPath}/${uuid}.${fileExt}`;
  
  // Supabase Storage에 업로드
  const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET_NAME || 'pickdam';
  
  const { data, error } = await supabaseServer.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // 공개 URL 생성
  const { data: { publicUrl } } = supabaseServer.storage
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
  };
}

export async function POST(request: NextRequest) {
  try {console.log('🌐 [upload-image API] POST 요청 시작');
    
    const formData = await request.formData();
    const imageType = formData.get('type') as string;
    
    // 단일 파일과 다중 파일 처리
    const singleFile = formData.get('file') as File;
    const multipleFiles = formData.getAll('files') as File[];
    
    // files 배열이 있으면 다중 업로드, 없으면 단일 업로드
    const files = multipleFiles.length > 0 ? multipleFiles : (singleFile ? [singleFile] : []);
    
    console.log('📋 [upload-image API] FormData 파싱:', {
      filesCount: files.length,
      fileNames: files.map(f => f.name),
      imageType
    });
    
    if (files.length === 0) {
      console.error('❌ [upload-image API] 파일이 없음');
      const mappedError = mapApiError({ message: '파일이 없습니다.', status: StatusCodes.BAD_REQUEST });
      const errorResponse = createErrorResponse(mappedError);
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) });
    }

    console.log('🚀 [upload-image API] 병렬 업로드 시작');

    // ✅ 병렬 처리 + 메타데이터 보존
    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await uploadSingleFile(file, index, imageType);
        console.log(`✅ [upload-image API] 파일 ${index} 업로드 성공: ${file.name}`);
        return result;
      } catch (error) {
        console.error(`❌ [upload-image API] 파일 ${index} 업로드 실패: ${file.name}`, error);
        return {
          success: false,
          originalIndex: index,
          originalFileName: file.name,
          originalFileSize: file.size,
          originalFileType: file.type,
          error: error instanceof Error ? error.message : '알 수 없는 오류'
        };
      }
    });

    // 모든 업로드를 병렬로 실행
    const results = await Promise.all(uploadPromises);
    
    // 성공/실패 분리
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log('✅ [upload-image API] 병렬 업로드 완료:', {
      total: files.length,
      successful: successful.length,
      failed: failed.length
    });

    // 단일 파일인 경우 기존 API와 호환되도록 처리
    if (files.length === 1) {
      if (successful.length === 1) {
        const result = successful[0];
        // 타입 안전성을 위해 success 체크
        if (result.success && 'url' in result) {
          // 단일 파일 응답도 통일된 형식 사용
          const response = createSuccessResponse({
            url: result.url,
            path: result.path,
            fileName: result.fileName
          });
          return NextResponse.json(response, { status: 201 });
        }
      }
      
      // 실패한 경우
      const failedResult = failed[0];
      if (failedResult && 'error' in failedResult) {
        const mappedError = mapApiError({ message: failedResult.error, status: StatusCodes.INTERNAL_SERVER_ERROR });
        const errorResponse = createErrorResponse(mappedError);
        return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) });
      }
    }

    // 다중 파일인 경우 results만 반환 (ApiResponse.data에 포함됨)
    const response = createSuccessResponse(results);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('❌ [upload-image API] 예기치 못한 오류:', error);
    const mappedError = mapApiError(error);
    const errorResponse = createErrorResponse(mappedError);
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) });
  }
}

