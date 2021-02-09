export interface HackerNewsAPIOutput {id: number; title: string; score: string; by: string; url?: string }
export interface FormatedStory {id: number; title: string; subtitle: string; url: string}
export interface Feed {ids: number[]; page: number; quantity: number; data: FormatedStory[] }