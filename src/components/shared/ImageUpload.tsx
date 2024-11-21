import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (base64: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
  language: 'en' | 'ar';
}

export function ImageUpload({
  currentImage,
  onImageChange,
  className = '',
  size = 'md',
  shape = 'circle',
  language
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [error, setError] = useState<string>('');

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(language === 'en' ? 'Please select an image file' : 'الرجاء اختيار ملف صورة');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(language === 'en' ? 'Image must be less than 2MB' : 'يجب أن يكون حجم الصورة أقل من 2 ميجابايت');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setPreviewUrl(base64);
      onImageChange(base64);
      setError('');
    } catch (err) {
      setError(language === 'en' ? 'Failed to process image' : 'فشل في معالجة الصورة');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <div className="relative inline-block">
        <div
          className={`${sizeClasses[size]} bg-purple-100 flex items-center justify-center overflow-hidden cursor-pointer group
            ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
          onClick={handleClick}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}>
                <Camera className="w-8 h-8 text-white" />
              </div>
            </>
          ) : (
            <Camera className="w-12 h-12 text-purple-600" />
          )}
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}