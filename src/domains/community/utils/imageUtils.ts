// 이미지 관련 유틸리티 함수들
import { v4 as uuidv4 } from 'uuid';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

// 업로드된 이미지 타입 정의
export interface UploadedImage {
  url: string;
  id?: string;
  filename?: string;
}

// 파싱된 이미지 정보 타입 정의
export interface ParsedImage {
  id: string;
  src: string;
  serverId?: string;
}

// 파일 변환 옵션
export interface FileConversionOptions {
  maxFileSize?: number; // bytes
  allowedTypes?: string[];
}

// 기본 설정
const DEFAULT_OPTIONS: Required<FileConversionOptions> = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

/**
 * 파일 유효성 검증
 */
const validateFile = (file: File, options: Required<FileConversionOptions>): void => {
  if (!file) {
    throw createBusinessError.invalidInput('파일이 존재하지 않습니다.');
  }

  if (file.size > options.maxFileSize) {
    const maxSizeMB = Math.round(options.maxFileSize / (1024 * 1024));
    throw createBusinessError.invalidInput(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
  }

  if (!options.allowedTypes.includes(file.type)) {
    const allowedExtensions = options.allowedTypes.map(type => 
      type.replace('image/', '')
    ).join(', ');
    throw createBusinessError.invalidInput(
      `지원하지 않는 파일 형식입니다. (지원 형식: ${allowedExtensions})`
    );
  }
};

/**
 * 단일 파일을 Data URL로 변환
 */
const convertSingleFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          resolve(result);
        } else {
          reject(createBusinessError.dataProcessing('파일 읽기 결과가 올바르지 않습니다.'));
        }
      };
      
      reader.onerror = () => {
        reject(createBusinessError.dataProcessing(`파일 읽기 중 오류가 발생했습니다: ${file.name}`));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(createBusinessError.dataProcessing('파일 읽기를 시작할 수 없습니다.', 
        error instanceof Error ? error.message : undefined));
    }
  });
};

/**
 * 파일들을 Data URL로 변환 (단일/다중 모두 지원)
 */
export const convertFilesToDataUrls = async (
  files: File[],
  onFileConverted?: (dataUrl: string, file: File) => void,
  options: FileConversionOptions = {}
): Promise<string[]> => {
  if (!Array.isArray(files) || files.length === 0) {
    throw createBusinessError.invalidInput('변환할 파일이 없습니다.');
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    // 모든 파일 유효성 검증
    files.forEach(file => validateFile(file, mergedOptions));

    // 병렬 변환
    const dataUrls = await Promise.all(
      files.map(async (file) => {
        try {
          const dataUrl = await convertSingleFileToDataUrl(file);
          onFileConverted?.(dataUrl, file);
          return dataUrl;
        } catch (error) {
          throw createBusinessError.dataProcessing(
            `파일 변환 실패: ${file.name}`, 
            error instanceof BusinessError ? error.message : undefined
          );
        }
      })
    );

    return dataUrls;
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    throw createBusinessError.dataProcessing('파일 변환 중 예상치 못한 오류가 발생했습니다.');
  }
};

/**
 * Data URL을 서버 URL로 교체
 */
export const replaceDataUrlsWithServerUrls = (
  content: string,
  dataUrlToFileMap: Map<string, File>,
  uploadedImages: UploadedImage[]
): string => {
  if (!content || typeof content !== 'string') {
    throw createBusinessError.invalidInput('콘텐츠가 올바르지 않습니다.');
  }

  if (!dataUrlToFileMap || !(dataUrlToFileMap instanceof Map)) {
    throw createBusinessError.invalidInput('데이터 URL 매핑 정보가 올바르지 않습니다.');
  }

  if (!Array.isArray(uploadedImages)) {
    throw createBusinessError.invalidInput('업로드된 이미지 정보가 올바르지 않습니다.');
  }

  try {
    let updatedContent = content;
    const dataUrls = Array.from(dataUrlToFileMap.keys());
    
    uploadedImages.forEach((uploadedImg, index) => {
      if (uploadedImg?.url && dataUrls[index]) {
        // 전역 교체를 위해 정규식 사용 (특수 문자 이스케이프)
        const escapedDataUrl = dataUrls[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedDataUrl, 'g');
        updatedContent = updatedContent.replace(regex, uploadedImg.url);
      }
    });
    
    return updatedContent;
  } catch (error) {
    throw createBusinessError.dataProcessing(
      'Data URL을 서버 URL로 교체하는 중 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    );
  }
};

/**
 * UUID 생성 (표준 uuid 라이브러리 사용)
 */
const generateId = (): string => {
  try {
    // 모던 브라우저에서는 crypto.randomUUID 우선 사용
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // uuid 라이브러리 사용 (표준 UUID v4)
    return uuidv4();
  } catch (error) {
    throw createBusinessError.dataProcessing(
      'UUID 생성에 실패했습니다.',
      error instanceof Error ? error.message : undefined
    );
  }
};

/**
 * HTML 콘텐츠에서 이미지 태그 파싱
 */
export const parseImagesFromHtml = (content: string): ParsedImage[] => {
  if (!content || typeof content !== 'string') {
    throw createBusinessError.invalidInput('HTML 콘텐츠가 올바르지 않습니다.');
  }

  try {
    // SSR 환경 대응
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
      // 서버 환경에서는 정규식으로 간단히 파싱
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
      const images: ParsedImage[] = [];
      let match;
      
      while ((match = imgRegex.exec(content)) !== null) {
        images.push({
          id: generateId(),
          src: match[1],
          serverId: undefined, // 서버에서는 data-id 추출 제한적
        });
      }
      
      return images;
    }

    // 클라이언트 환경에서는 DOMParser 사용
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // 보안: 스크립트 태그 제거
    doc.querySelectorAll('script').forEach(script => script.remove());
    
    const imgElements = doc.querySelectorAll('img');
    
    return Array.from(imgElements).map(img => ({
      id: generateId(),
      src: img.src || img.getAttribute('src') || '',
      serverId: img.getAttribute('data-id') || undefined,
    }));
  } catch (error) {
    throw createBusinessError.dataProcessing(
      'HTML 이미지 파싱 중 오류가 발생했습니다.',
      error instanceof Error ? error.message : undefined
    );
  }
};