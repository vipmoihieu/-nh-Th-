import React, { useRef } from 'react';
import { BackgroundColor, DocumentType, IDPhotoState, OutfitType } from '../types';
import { fileToBase64 } from '../utils/imageUtils';

interface SidebarProps {
  state: IDPhotoState;
  setState: React.Dispatch<React.SetStateAction<IDPhotoState>>;
  onGenerate: () => void;
}

const DOC_LABELS: Record<DocumentType, string> = {
  [DocumentType.PASSPORT]: 'Hộ chiếu (4x6)',
  [DocumentType.CCCD]: 'CCCD (4x6)',
  [DocumentType.LICENSE]: 'Bằng lái (3x4)',
  [DocumentType.STUDENT]: 'Hồ sơ (3x4)',
};

const OUTFIT_LABELS: Record<OutfitType, string> = {
  [OutfitType.CASUAL]: 'Áo thun thường',
  [OutfitType.SHIRT_WHITE]: 'Sơ mi trắng',
  [OutfitType.SUIT_NAVY]: 'Vest Xanh',
  [OutfitType.SUIT_BLACK]: 'Vest Đen',
  [OutfitType.AO_DAI]: 'Áo dài',
};

export const Sidebar: React.FC<SidebarProps> = ({ state, setState, onGenerate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setState(prev => ({ ...prev, originalImage: base64, generatedImage: null }));
      } catch (err) {
        alert("Error reading file");
      }
    }
  };

  const toggleAccessory = (key: keyof typeof state.accessories) => {
    setState(prev => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [key]: !prev.accessories[key]
      }
    }));
  };

  return (
    <div className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col h-full overflow-y-auto shrink-0">
      <h1 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
        App Ảnh Thẻ AI
      </h1>

      <div className="space-y-8">
        {/* 1. Upload */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Tải ảnh lên</h2>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors relative overflow-hidden group bg-slate-50"
          >
             {state.originalImage ? (
                <div className="relative w-full">
                    <img src={`data:image/png;base64,${state.originalImage}`} alt="Uploaded" className="w-full h-40 object-contain rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Đổi ảnh</span>
                    </div>
                </div>
             ) : (
                <div className="text-center py-6">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="h-6 w-6 text-blue-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700">Chọn ảnh chân dung</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG rõ nét</p>
                </div>
             )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* 2. Document Type */}
        <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. Loại giấy tờ</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(DocumentType).map((type) => (
                <button
                  key={type}
                  onClick={() => setState(prev => ({ ...prev, selectedDocType: type }))}
                  className={`p-3 text-sm font-medium rounded-lg border text-left transition-all flex items-center justify-between group ${
                    state.selectedDocType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 ring-1 ring-blue-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{DOC_LABELS[type]}</span>
                  {state.selectedDocType === type && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
        </div>

        {/* 3. Background */}
        <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">3. Màu nền</h2>
            <div className="grid grid-cols-3 gap-3">
                {Object.values(BackgroundColor).map((bg) => {
                    let bgClass = '';
                    let borderClass = '';
                    let textClass = '';
                    
                    if (bg === BackgroundColor.WHITE) {
                        bgClass = 'bg-white';
                        borderClass = 'border-slate-200';
                        textClass = 'text-slate-700';
                    } else if (bg === BackgroundColor.BLUE) {
                        bgClass = 'bg-blue-500';
                        borderClass = 'border-blue-600';
                        textClass = 'text-white';
                    } else {
                        bgClass = 'bg-gray-400';
                        borderClass = 'border-gray-500';
                        textClass = 'text-white';
                    }

                    const isSelected = state.selectedBackground === bg;

                    return (
                        <button
                            key={bg}
                            onClick={() => setState(prev => ({ ...prev, selectedBackground: bg }))}
                            className={`relative h-12 rounded-lg border-2 transition-all flex items-center justify-center font-medium text-xs shadow-sm ${bgClass} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 border-transparent' : borderClass}`}
                        >
                            <span className={`${bg === BackgroundColor.WHITE ? 'text-slate-800' : 'text-white'} z-10`}>
                                {bg === BackgroundColor.WHITE ? 'Trắng' : bg === BackgroundColor.BLUE ? 'Xanh' : 'Xám'}
                            </span>
                            {isSelected && (
                                <div className="absolute top-1 right-1">
                                    <div className="bg-green-500 rounded-full p-0.5 border border-white">
                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* 4. Outfit */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">4. Trang phục</h2>
          <div className="grid grid-cols-2 gap-2">
             {Object.values(OutfitType).map((outfit) => (
                <button
                    key={outfit}
                    onClick={() => setState(prev => ({ ...prev, selectedOutfit: outfit }))}
                    className={`p-2.5 text-sm rounded-lg border transition-all text-left ${
                        state.selectedOutfit === outfit
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-400'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                    {OUTFIT_LABELS[outfit]}
                </button>
             ))}
          </div>
        </div>

        {/* 5. Accessories */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">5. Phụ kiện</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'glasses', label: 'Mắt kính' },
              { id: 'hat', label: 'Mũ' },
              { id: 'earrings', label: 'Bông tai' },
              { id: 'necklace', label: 'Dây chuyền' }
            ].map((item) => (
              <label key={item.id} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  state.accessories[item.id as keyof typeof state.accessories] 
                  ? 'bg-blue-50 border-blue-400 shadow-sm' 
                  : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    state.accessories[item.id as keyof typeof state.accessories]
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-slate-300'
                }`}>
                    {state.accessories[item.id as keyof typeof state.accessories] && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                </div>
                <input 
                  type="checkbox" 
                  checked={state.accessories[item.id as keyof typeof state.accessories]}
                  onChange={() => toggleAccessory(item.id as keyof typeof state.accessories)}
                  className="hidden"
                />
                <span className={`text-sm font-medium ${state.accessories[item.id as keyof typeof state.accessories] ? 'text-blue-800' : 'text-slate-600'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 pb-6">
          <button 
            onClick={onGenerate}
            disabled={!state.originalImage || state.isGenerating}
            className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg transform active:scale-[0.98] ${
              !state.originalImage || state.isGenerating
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-200 hover:shadow-blue-300'
            }`}
          >
            {state.isGenerating ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Tạo Ảnh Thẻ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};