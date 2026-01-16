export type ID = string;

export interface Label {
    id: ID;
    text: string;
    color: string;
}

export interface Card {
    id: ID;
    title: string;
    description?: string;
    labels: Label[];
}

export interface List {
    id: ID;
    title: string;
    cards: Card[];
}

export interface Board {
    id: ID;
    title: string;
    lists: List[];
}

export type DraggableType = 'LIST' | 'CARD';
