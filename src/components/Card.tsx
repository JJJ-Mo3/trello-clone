import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { Card as CardType } from '../types';
import { RxTrash } from 'react-icons/rx';
import './Card.css';

interface CardProps {
    card: CardType;
    index: number;
    listId: string;
    onDelete: (listId: string, cardId: string) => void;
}

export const Card: React.FC<CardProps> = ({ card, index, listId, onDelete }) => {
    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                    className={`card ${snapshot.isDragging ? 'card-dragging' : ''}`}
                >
                    {/* Labels Row (Placeholder for future P1) */}
                    {card.labels.length > 0 && (
                        <div className="card-labels">
                            {card.labels.map((label) => (
                                <div
                                    key={label.id}
                                    className="card-label"
                                    style={{ backgroundColor: label.color }}
                                    title={label.text}
                                />
                            ))}
                        </div>
                    )}

                    <div className="card-content">
                        <span className="card-title">
                            {card.title}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(listId, card.id);
                            }}
                            className="btn-delete-card"
                        >
                            <RxTrash />
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};
