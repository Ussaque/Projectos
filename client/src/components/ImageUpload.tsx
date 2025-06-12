import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CameraIcon } from '@/components/ui/icons';
import { storage } from '@/lib/firebase'; // You'll need to create this
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  initialImage?: string;
  onImageSelected: (file: File) => void;
  onImageUploaded?: (firebaseUrl: string) => void; // Callback for successful uploads
  className?: string;
}

export default function ImageUpload({ 
  initialImage, 
  onImageSelected, 
  onImageUploaded,
  className 
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToFirebase = async (file: File): Promise<string> => {
    try {
      console.log('Starting upload to Firebase Storage...', file.name);
      console.log('Storage instance:', storage);
      
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `profile_images/${timestamp}_${file.name}`;
      
      console.log('Creating storage reference:', fileName);
      
      // Create a reference to Firebase Storage
      const storageRef = ref(storage, fileName);
      
      console.log('Storage reference created:', storageRef);
      console.log('Uploading file...');
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload successful - Firebase snapshot:', snapshot);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading to Firebase Storage:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  };

  const handleFileSelection = async (file: File) => {
    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      alert('O arquivo é muito grande. Por favor, selecione uma imagem menor que 5MB.');
      return;
    }
    
    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call the original callback
    onImageSelected(file);

    // Upload to Firebase Storage
    setIsUploading(true);
    try {
      const firebaseUrl = await uploadToFirebase(file);
      onImageUploaded?.(firebaseUrl);
      console.log('Image uploaded successfully:', firebaseUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      // Show error to user
      alert(`Falha no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative inline-block">
        <motion.div 
          className={`h-24 w-24 rounded-full ${isDragging ? 'bg-primary-100' : 'bg-gray-200'} flex items-center justify-center overflow-hidden border-4 border-white shadow-lg cursor-pointer relative`}
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <img src={preview} alt="Imagem do perfil" className="h-full w-full object-cover" />
          ) : (
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0014.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          )}
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </motion.div>
        
        <Button 
          type="button" 
          variant="default"
          size="icon"
          className={`absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <CameraIcon className="w-4 h-4" />
          )}
        </Button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={isUploading}
        /> 
      </div>
    </div>
  );
}