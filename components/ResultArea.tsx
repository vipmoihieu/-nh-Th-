import React from 'react';
import { IDPhotoState, DocumentType } from '../types';
import { cropImageToRatio, getDimensionsForDocType } from '../utils/imageUtils';

interface ResultAreaProps {
  state: IDPhotoState;
}

export const ResultArea: React.FC<ResultAreaProps> = ({ state }) => {
  const { generatedImage, selectedDocType, isGenerating } = state;

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      // 1. Get correct dimensions
      const { width, height, label } = getDimensionsForDocType(selectedDocType);
      
      // 2. Crop the image to the ratio
      const croppedBase64 = await cropImageToRatio(generatedImage, width, height);

      // 3. Trigger download
      const link = document.createElement('a');
      link.href = croppedBase64;
      link.download = `IDPhoto-${selectedDocType}-${label}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error downloading", e);
      alert("Lỗi khi xử lý ảnh để tải về.");
    }
  };

  const getDocLabel = () => {
    return getDimensionsForDocType(selectedDocType).label;
  };

  return (
    <div className="flex-1 bg-slate-50 p-4 md:p-10 flex flex-col h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Kết quả của bạn</h2>

        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          {isGenerating ? (
             <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-600 font-medium">AI đang xử lý khuôn mặt và trang phục...</p>
                <p className="text-slate-400 text-sm">Quá trình này mất khoảng 5-10 giây</p>
             </div>
          ) : generatedImage ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-6 animate-fade-in-up">
              
              <div className="relative group">
                {/* Result Image */}
                <img 
                  src={`data:image/png;base64,${generatedImage}`} 
                  alt="AI Generated ID" 
                  className="max-h-[50vh] rounded shadow-md object-contain border border-slate-200"
                />
                
                {/* Visual Ratio Guide Overlay (CSS only) */}
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/50 rounded flex items-end justify-center pb-4">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                        Tỷ lệ cắt: {getDocLabel()}
                    </span>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-3">
                 <button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Tải về (Đã cắt {getDocLabel()})
                </button>
                <p className="text-xs text-slate-500 text-center">
                    Ảnh sẽ tự động được cắt chuẩn theo kích thước 
                    <span className="font-bold text-slate-700"> {selectedDocType} </span>
                    khi tải về.
                </p>
              </div>

            </div>
          ) : (
            <div className="text-center text-slate-400 p-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 w-full h-full flex flex-col items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <h3 className="text-lg font-medium text-slate-600">Chưa có kết quả</h3>
               <p>Ảnh của bạn sẽ xuất hiện ở đây sau khi xử lý.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};