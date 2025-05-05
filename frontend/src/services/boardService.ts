import { v4 as uuidv4 } from 'uuid';

export const getBoardId = (): string => {
  const pathParts = window.location.pathname.split('/');
  const boardId = pathParts[1];
  
  if (!boardId) {
    const newBoardId = uuidv4();
    window.history.pushState({}, '', `/${newBoardId}`);
    return newBoardId;
  }
  
  return boardId;
};

export const createNewBoard = (): string => {
  const newBoardId = uuidv4();
  window.history.pushState({}, '', `/${newBoardId}`);
  return newBoardId;
};

export const getCurrentBoardId = (): string | null => {
  const pathParts = window.location.pathname.split('/');
  return pathParts[1] || null;
}; 