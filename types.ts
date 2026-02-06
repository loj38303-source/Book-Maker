
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  role: Role;
  text: string;
  isDesign?: boolean;
  designData?: DesignData;
}

export interface DesignData {
  title: string;
  pages: PageData[];
}

export interface PageData {
  id: string;
  layout: 'cover' | 'content' | 'visual';
  content: {
    heading?: string;
    subheading?: string;
    body?: string;
    imageUrl?: string;
    elements?: Array<{
      type: 'rect' | 'circle' | 'line';
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
    }>;
  };
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
