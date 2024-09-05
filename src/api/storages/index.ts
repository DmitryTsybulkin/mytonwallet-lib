import { StorageType } from './types';

import localStorage from './localStorage';

export const storage = localStorage;

export default {
  [StorageType.LocalStorage]: localStorage
};
