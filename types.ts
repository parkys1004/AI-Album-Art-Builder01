export interface SongInput {
  title: string;
  artist: string;
  genre: string;
  lyrics: string;
  style: ArtStyle;
  character: string;
  aspectRatio: string; // '1:1', '3:4', '4:3', '9:16', '16:9'
  autoTextOverlay: boolean; // Toggle for automatic text placement
  textBehindCharacter?: boolean; // Toggle for placing text behind the character
  model: string; // 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview'
}

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  previewColor: string;
}

export interface TextConfig {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  effect: string;
  visible: boolean; // Visibility state
}

export interface EditorState {
  title: TextConfig;
  artist: TextConfig;
}

export interface GeneratedAlbumArt {
  id: string;
  imageUrl: string; // Base64
  input: SongInput;
  createdAt: number;
  finalImage?: string; // Image with text overlay
  editorState?: EditorState; // Saved editor configuration
}

export enum AppState {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  EDITOR = 'EDITOR',
  GALLERY = 'GALLERY',
}