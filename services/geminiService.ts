import { GoogleGenAI } from "@google/genai";
import { BackgroundColor, OutfitType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateIDPhoto = async (
  imageBase64: string,
  background: BackgroundColor,
  outfit: OutfitType,
  accessories: { glasses: boolean; hat: boolean; earrings: boolean; necklace: boolean }
): Promise<string> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Construct a prompt that instructs the model to edit the photo
  const accessoryList = [];
  if (accessories.glasses) accessoryList.push("wearing glasses");
  if (accessories.hat) accessoryList.push("wearing a hat");
  if (accessories.earrings) accessoryList.push("wearing earrings");
  if (accessories.necklace) accessoryList.push("wearing a necklace");

  const accessoryString = accessoryList.length > 0 ? `, ${accessoryList.join(", ")}` : "";

  const prompt = `
    Transform this image into a professional ID photo/Passport photo.
    1. STRICTLY Change the background to a solid ${background} color. Clean, even lighting on the background.
    2. Change the person's clothing to a ${outfit}. Ensure it fits naturally.
    3. Keep the person's facial features EXACTLY the same. This is crucial for ID verification.
    4. Ensure the person is facing forward.
    5. The lighting should be soft, studio-quality, suitable for a government document.
    6. Accessories: ${accessoryString}.
    7. Return ONLY the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for input compatibility, API handles jpeg/png/webp
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    // Check for image parts in the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};