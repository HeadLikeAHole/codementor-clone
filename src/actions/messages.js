import { DISPLAY_MESSAGE } from './types';


// color argument is a bootstrap alert color (primary, success, danger, etc.)
export const displayMessage = (color, message) => (
  {
    type: DISPLAY_MESSAGE,
    payload: { color, message }
  }
);

