import { ResolveFn } from '@angular/router';

export const cityResolver: ResolveFn<boolean> = (route, state) => {
  console.log('cityResolver', state);
  return true;
};
