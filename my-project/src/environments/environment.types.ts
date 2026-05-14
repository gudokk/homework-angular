export type ArticlesSource = 'api' | 'localStorage';

export interface AppEnvironment {
  production: boolean;
  articlesSource: ArticlesSource;
}
