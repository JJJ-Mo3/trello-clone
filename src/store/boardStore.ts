import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Board, ID } from '../types';

interface BoardState {
    board: Board;
    // Actions
    addList: (title: string) => void;
    deleteList: (listId: ID) => void;
    renameList: (listId: ID, title: string) => void;
    addCard: (listId: ID, title: string) => void;
    deleteCard: (listId: ID, cardId: ID) => void;
    moveCard: (cardId: ID, sourceListId: ID, destListId: ID, sourceIndex: number, destIndex: number) => void;
    moveList: (listId: ID, sourceIndex: number, destIndex: number) => void;
}

const initialBoard: Board = {
    id: 'board-1',
    title: 'My Project',
    lists: [],
};

export const useBoardStore = create<BoardState>()(
    persist(
        (set) => ({
            board: initialBoard,

            addList: (title) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        lists: [
                            ...state.board.lists,
                            { id: uuidv4(), title, cards: [] },
                        ],
                    },
                })),

            deleteList: (listId) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        lists: state.board.lists.filter((l) => l.id !== listId),
                    },
                })),

            renameList: (listId, title) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        lists: state.board.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
                    },
                })),

            addCard: (listId, title) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        lists: state.board.lists.map((l) =>
                            l.id === listId
                                ? {
                                    ...l,
                                    cards: [
                                        ...l.cards,
                                        { id: uuidv4(), title, labels: [] },
                                    ],
                                }
                                : l
                        ),
                    },
                })),

            deleteCard: (listId, cardId) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        lists: state.board.lists.map((l) =>
                            l.id === listId
                                ? {
                                    ...l,
                                    cards: l.cards.filter((c) => c.id !== cardId),
                                }
                                : l
                        ),
                    },
                })),

            moveCard: (_cardId, sourceListId, destListId, sourceIndex, destIndex) =>
                set((state) => {
                    const newLists = [...state.board.lists];
                    const sourceList = newLists.find((l) => l.id === sourceListId);
                    const destList = newLists.find((l) => l.id === destListId);

                    if (!sourceList || !destList) return { board: state.board };

                    // Remove from source
                    const [movedCard] = sourceList.cards.splice(sourceIndex, 1);

                    // Add to dest
                    destList.cards.splice(destIndex, 0, movedCard);

                    return {
                        board: {
                            ...state.board,
                            lists: newLists,
                        },
                    };
                }),

            moveList: (_listId, sourceIndex, destIndex) =>
                set((state) => {
                    const newLists = [...state.board.lists];
                    const [movedList] = newLists.splice(sourceIndex, 1);
                    newLists.splice(destIndex, 0, movedList);

                    return {
                        board: {
                            ...state.board,
                            lists: newLists,
                        },
                    };
                }),
        }),
        {
            name: 'trello-clone-storage',
        }
    )
);
