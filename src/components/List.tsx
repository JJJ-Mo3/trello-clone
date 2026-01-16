import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { List as ListType } from '../types';
import { Card } from './Card';
import { useBoardStore } from '../store/boardStore';
import { RxCross2, RxPlus } from 'react-icons/rx';
import './List.css';

interface ListProps {
    list: ListType;
    index: number;
}

export const List: React.FC<ListProps> = ({ list, index }) => {
    const { deleteList, addCard, renameList } = useBoardStore();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState(list.title);

    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleRename = () => {
        if (titleInput.trim()) {
            renameList(list.id, titleInput);
        }
        setIsEditingTitle(false);
    };

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            addCard(list.id, newCardTitle);
            setNewCardTitle('');
        }
        // Keep input open for rapid entry
        // setIsAddingCard(false); 
    };

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="list-wrapper"
                >
                    <div
                        className={`list-content ${snapshot.isDragging ? 'is-dragging-list' : ''}`}
                    >
                        {/* Header */}
                        <div
                            {...provided.dragHandleProps}
                            className="list-header"
                        >
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    onBlur={handleRename}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                    className="list-title-input"
                                />
                            ) : (
                                <h2
                                    onClick={() => setIsEditingTitle(true)}
                                    className="list-title"
                                >
                                    {list.title}
                                </h2>
                            )}
                            <button
                                onClick={() => deleteList(list.id)}
                                className="btn-delete-list"
                            >
                                <RxCross2 />
                            </button>
                        </div>

                        {/* Cards Area */}
                        <Droppable droppableId={list.id} type="CARD">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="list-cards-area"
                                >
                                    {list.cards.map((card, index) => (
                                        <Card
                                            key={card.id}
                                            card={card}
                                            index={index}
                                            listId={list.id}
                                            onDelete={useBoardStore.getState().deleteCard}
                                        />
                                    ))}
                                    {provided.placeholder}

                                    {isAddingCard && (
                                        <div className="add-card-form">
                                            <textarea
                                                autoFocus
                                                placeholder="Enter a title for this card..."
                                                value={newCardTitle}
                                                onChange={(e) => setNewCardTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddCard();
                                                    }
                                                }}
                                                className="add-card-textarea"
                                            />
                                            <div className="add-card-controls">
                                                <button
                                                    onClick={handleAddCard}
                                                    className="btn-primary"
                                                >
                                                    Add Card
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingCard(false)}
                                                    className="btn-close"
                                                >
                                                    <RxCross2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>

                        {/* Footer */}
                        {!isAddingCard && (
                            <button
                                onClick={() => setIsAddingCard(true)}
                                className="btn-add-card-trigger"
                            >
                                <RxPlus />
                                Add a card
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};
