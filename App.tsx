import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResultArea } from './components/ResultArea';
import { IDPhotoState, DocumentType, BackgroundColor, OutfitType } from './types';
import { generateIDPhoto } from './services/geminiService';

export default function App() {
  const [state, setState] = useState<IDPhotoState>({
    originalImage: null,
    generatedImage: null,
    isGenerating: false,
    selectedDocType: DocumentType.CCCD,
    selectedBackground: BackgroundColor.WHITE,
    selectedOutfit: OutfitType.SHIRT_WHITE,
    accessories: {
      glasses: false,
      hat: false,
      earrings: false,
      necklace: false,
    },
  });

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isGenerating: true, generatedImage: null }));

    try {
      const generatedBase64 = await generateIDPhoto(
        state.originalImage,
        state.selectedBackground,
        state.selectedOutfit,
        state.accessories
      );
      
      setState(prev => ({ ...prev, generatedImage: generatedBase64, isGenerating: false }));
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại với ảnh rõ nét hơn.");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar 
        state={state} 
        setState={setState} 
        onGenerate={handleGenerate} 
      />
      <ResultArea state={state} />
    </div>
  );
}