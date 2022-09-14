import {ArticleType} from './ArticleType';
import {Route} from './Route';

export type AVPlayerItem = {
  articleID: string;
  articleType: ArticleType;
  audioUrl: string;
  datePublished: string;
  durationMs: number;
  hasRead: boolean;
  sectionTitle: string;
  imageUrl?: string;
  isAudioOnly: boolean;
  isPodcast: boolean;
  title: string;
  route: Route;
  collectionId?: string;
  flyTitle?: string;
};
