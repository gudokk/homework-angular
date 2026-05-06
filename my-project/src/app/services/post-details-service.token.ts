import { InjectionToken } from '@angular/core';
import { PostDetailsServiceInterface } from './post-details-service.interface';

export const POST_DETAILS_SERVICE = new InjectionToken<PostDetailsServiceInterface>('POST_DETAILS_SERVICE');
