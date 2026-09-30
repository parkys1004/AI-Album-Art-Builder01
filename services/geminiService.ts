import { GoogleGenAI } from "@google/genai";
import { SongInput } from "../types";
import { getDecryptedApiKey } from "./storageService";

// Helper to get the AI client with the best available key
const getAiClient = (overrideKey?: string) => {
  // 1. Use override key (for testing)
  if (overrideKey) {
    return new GoogleGenAI({ apiKey: overrideKey });
  }
  
  // 2. Use user-saved key from local storage
  const userKey = getDecryptedApiKey();
  if (userKey) {
    return new GoogleGenAI({ apiKey: userKey });
  }

  // 3. Fallback to env key (Internal)
  const envKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey: envKey });
};

// New feature: Test API Connection
export const testApiKeyConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a lightweight text model for a quick ping test
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
    });
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
};

// Helper to get style-specific typography instructions
const getTypographyInstruction = (styleId: string, genre: string): string => {
  const genreLower = genre.toLowerCase();
  
  // 1. Style-based overrides
  switch (styleId) {
    case 'kpop-idol':
    case 'studio-photo':
    case 'fashion-editorial':
      return "TYPOGRAPHY: High-end fashion magazine aesthetic. Use elegant Serif fonts or bold, modern Sans-Serif. Place text delicately to not obscure the face. Colors: White, Gold, or Silver foil texture.";
    
    case 'cyberpunk-real':
    case 'fantasy-cgi':
      return "TYPOGRAPHY: Futuristic, Sci-Fi, or Cyber aesthetic. Use glowing Neon signs, Glitch text effects, or Chrome Metal textures. Font should look like a hologram or digital display integrated into the scene.";
    
    case 'retro-flash':
    case 'analog-film':
      return "TYPOGRAPHY: Retro 90s aesthetic or Vintage Film date stamp style. Use chunky, bold fonts with outlines, or typewriter/handwritten styles. bright contrasting colors or faded film subtitles.";
    
    case 'street-snap':
    case 'dark-noir':
      return "TYPOGRAPHY: Streetwear brand logo style or Cinematic subtitles. Use Graffiti tags, Stencil fonts, or minimal white text in the letterbox area. Rough, grunge, or clean minimal textures.";
      
    case 'dreamy-pastel':
    case 'silhouette':
      return "TYPOGRAPHY: Emotional and soft. Use thin Handwritten script, Calligraphy, or airy Serif fonts. Place in the negative space (sky or background) to maintain the mood.";
      
    default:
      // 2. Fallback to Genre-based
      if (genreLower.includes('rock') || genreLower.includes('metal')) {
        return "TYPOGRAPHY: Aggressive, jagged, or distressed Grunge fonts. Large size, potentially with liquid metal or fire effects.";
      } else if (genreLower.includes('hip hop') || genreLower.includes('rap')) {
         return "TYPOGRAPHY: Parental Advisory style, Graffiti, or Old English Gothic fonts. Bold and impactful placement.";
      } else if (genreLower.includes('ballad') || genreLower.includes('classical')) {
         return "TYPOGRAPHY: Elegant, classic Serif or Script fonts. Small, understated size for emotional impact.";
      } else {
         return "TYPOGRAPHY: Professional Album Cover design. Bold, legible, and artistically integrated into the composition.";
      }
  }
};

// 1. Prompt Engineering: Korean Input -> Optimized English Prompt
export const generateOptimizedPrompt = async (input: SongInput): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';
    const typographyGuide = getTypographyInstruction(input.style.id, input.genre);
    
    // Check if fields are provided
    const hasTitle = input.title && input.title.trim().length > 0;
    const hasArtist = input.artist && input.artist.trim().length > 0;
    
    // Logic: Only generate text if enabled AND there is actual text to write (Title or Artist)
    const shouldGenerateText = input.autoTextOverlay && (hasTitle || hasArtist);
    
    // Check for Korean characters (Hangul) in the available text
    const textToCheck = (hasTitle ? input.title : '') + (hasArtist ? input.artist : '');
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(textToCheck);

    const prompt = `
      You are a World-Class Art Director and Graphic Designer.
      Create a highly detailed English image prompt for an Album Cover based on the following details.
      
      Input Details:
      ${hasTitle ? `- Title: ${input.title}` : ''}
      ${hasArtist ? `- Artist: ${input.artist}` : ''}
      - Genre: ${input.genre}
      - Main Character: ${input.character}
      - Vibe: ${input.lyrics}
      - Visual Style: ${input.style.promptModifier}
      - Text Mode: ${shouldGenerateText ? 'INTEGRATED TEXT GENERATION' : 'CLEAN IMAGE (NO TEXT)'}

      Instructions:
      1. **Subject**: Center the composition around the "${input.character}" (MUST be Korean visual/K-Pop aesthetic if human).
      2. **Atmosphere**: Translating the vibe of "${input.lyrics}" into lighting and color palette.
      3. **Art Style**: Strictly adhere to the "${input.style.name}" visual style.
      
      ${shouldGenerateText ? `
      4. **TEXT & TYPOGRAPHY (CRITICAL)**: 
         - **Goal**: The image MUST include the text "${input.title}" (Title)${hasArtist ? ` and "${input.artist}" (Artist)` : ''} painted directly into the artwork.
         - **${typographyGuide}**
         ${hasKorean ? `
         - **KOREAN TEXT HANDLING**: The text contains Korean Hangul characters. 
           **REQUIREMENT**: Render the Korean text clearly, legibly, and correctly. Do NOT use gibberish. Use a font style that supports Korean characters (e.g., Modern Gothic, Calligraphy).
           Prioritize text readability over complex distortion.` 
         : ''}
         - **Integration**: The text should NOT look like a cheap sticker. It must be part of the world (e.g., written on a wall, floating as 3D objects, illuminated by scene lighting, or designed as a professional album layout).
         ${input.textBehindCharacter ? `
         - **CRITICAL COMPOSITION RULE (TEXT BEHIND SUBJECT)**: 
           1. **Layer 1 (Back)**: The background scene.
           2. **Layer 2 (Middle)**: The text "${input.title}" written in HUGE, BOLD, BLOCK letters. It should span across the entire width of the image.
           3. **Layer 3 (Front)**: The character "${input.character}" standing in the foreground, PARTIALLY BLOCKING the text.
           - **Visual Effect**: The text acts as a backdrop for the character. The character's head or shoulders must overlap the letters, creating a strong sense of depth (like a Vogue magazine cover or a movie poster).
           - **Do NOT** place text on top of the character's face.
         ` : ''}
         - **Hierarchy**: The Title should be prominent.${hasArtist ? ' The Artist name can be smaller.' : ''}
      ` : `
      4. **NO TEXT**: The image must be completely clean. No letters, no watermarks, no text overlay. Focus purely on the visual art.
      `}

      5. **Output**: Return ONLY the final detailed English prompt. Focus on visual descriptors (lighting, texture, camera angle).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Error optimizing prompt:", error);
    
    if (error.message?.includes('403') || error.status === 'PERMISSION_DENIED' || error.response?.status === 403) {
        throw new Error("API Key 권한이 없습니다. 설정에서 올바른 API Key를 입력해주세요.");
    }

    // Fallback prompt
    const titlePart = input.title && input.title.trim().length > 0 ? `${input.title} text cover art,` : '';
    const artistPart = input.artist && input.artist.trim().length > 0 ? `${input.artist},` : '';
    
    return `${input.style.promptModifier}, Korean k-pop idol style, ${input.character}, ${input.genre} music vibe, ${titlePart} ${artistPart}`;
  }
};

// 2. Image Generation
export const generateImage = async (prompt: string, aspectRatio: string = "1:1", modelName: string = 'gemini-2.5-flash-image'): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio,
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    return null;

  } catch (error: any) {
    console.error("Error generating image:", error);
    
    if (error.message?.includes('403') || error.status === 'PERMISSION_DENIED' || error.response?.status === 403) {
        throw new Error("이미지 생성 권한이 없습니다. API Key를 확인해주세요. (403 Permission Denied)");
    }
    
    throw error;
  }
};
