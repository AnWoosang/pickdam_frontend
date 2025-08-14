import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Upload, X } from 'lucide-react';

interface ImageGalleryProps {
  images: File[];
  imagePreviewUrls: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onImageInsert: (index: number) => void;
  onTriggerUpload: () => void;
}

export function ImageGallery({
  images,
  imagePreviewUrls,
  fileInputRef,
  onImageUpload,
  onRemoveImage,
  onImageInsert,
  onTriggerUpload,
}: ImageGalleryProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        이미지 첨부 (최대 10개)
      </label>
      <div className="space-y-4">
        {/* 이미지 업로드 버튼 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={onTriggerUpload}
              disabled={images.length >= 10}
              noFocus={true}
            >
              <Upload className="w-3 h-3 mr-1" />
              이미지 선택
            </Button>
            <span className="text-sm text-gray-600">
              {images.length}/10
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onImageUpload}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500">
            💡 이미지를 선택하면 자동으로 현재 커서 위치에 삽입됩니다
          </p>
        </div>
        
        {/* 이미지 미리보기 */}
        {images.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              💡 이미지를 클릭하면 커서 위치에 다시 삽입됩니다 | 텍스트에서 이미지 마크다운을 삭제하면 자동으로 여기서도 제거됩니다
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={120}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onImageInsert(index)}
                    title="클릭하여 텍스트에 삽입"
                  />
                  <div 
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="이미지 삭제"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      size="small"
                      onClick={() => onRemoveImage(index)}
                      icon={<X className="w-3 h-3" />}
                      noFocus={true}
                    />
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    클릭해서 삽입
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}