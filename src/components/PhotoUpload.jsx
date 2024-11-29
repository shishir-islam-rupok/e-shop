import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

const PhotoUpload = ({ onPhotosSelect, maxPhotos = 5 }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');

  const handlePhotoSelect = (event) => {
    const files = Array.from(event.target.files);
    setError('');

    // Validate number of files
    if (files.length > maxPhotos) {
      setError(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFile = files.find(
      file => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFile) {
      setError('Please upload only JPG, PNG, or WebP images under 5MB');
      return;
    }

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Pass files to parent component
    onPhotosSelect(files);
  };

  const removePhoto = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    
    // Pass updated files to parent component
    const dataTransfer = new DataTransfer();
    const input = document.querySelector('input[type="file"]');
    const files = Array.from(input.files);
    files.forEach((file, i) => {
      if (i !== index) {
        dataTransfer.items.add(file);
      }
    });
    input.files = dataTransfer.files;
    onPhotosSelect(Array.from(dataTransfer.files));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG or WebP (MAX. {maxPhotos} photos)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
          />
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
