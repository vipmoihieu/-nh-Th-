export enum DocumentType {
  PASSPORT = 'PASSPORT', // 4x6 cm
  CCCD = 'CCCD',         // 4x6 cm (Citizen ID)
  LICENSE = 'LICENSE',   // 3x4 cm
  STUDENT = 'STUDENT',   // 3x4 cm or 2x3 cm
}

export enum BackgroundColor {
  WHITE = 'White',
  BLUE = 'Blue',
  GREY = 'Grey',
}

export enum OutfitType {
  CASUAL = 'Casual t-shirt',
  SUIT_BLACK = 'Black Business Suit',
  SUIT_NAVY = 'Navy Blue Business Suit',
  SHIRT_WHITE = 'White Collared Shirt',
  AO_DAI = 'Traditional Ao Dai',
}

export interface IDPhotoState {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  selectedDocType: DocumentType;
  selectedBackground: BackgroundColor;
  selectedOutfit: OutfitType;
  accessories: {
    glasses: boolean;
    hat: boolean; // Not recommended for ID usually, but requested
    earrings: boolean;
    necklace: boolean;
  };
}