import React, { useState } from 'react';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '../store/boardStore';
import { List } from './List';
import { RxPlus } from 'react-icons/rx';
import './Board.css';

export const Board: React.FC = () => {
    const { board, moveCard, moveList, addList } = useBoardStore();
    const [newListTitle, setNewListTitle] = useState('');
    const [isAddingList, setIsAddingList] = useState(false);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        if (type === 'LIST') {
            moveList(result.draggableId, source.index, destination.index);
            return;
        }

        // Moving Cards
        moveCard(
            result.draggableId,
            source.droppableId,
            destination.droppableId,
            source.index,
            destination.index
        );
    };

    const handleAddList = () => {
        if (newListTitle.trim()) {
            addList(newListTitle);
            setNewListTitle('');
            setIsAddingList(false);
        }
    };

    return (
        <div className="board-container">
            {/* Navbar */}
            <div className="board-header">
                <h1 className="board-title">{board.title}</h1>
            </div>

            {/* Board Canvas */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="board" type="LIST" direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="board-canvas"
                        >
                            {board.lists.map((list, index) => (
                                <List key={list.id} list={list} index={index} />
                            ))}
                            {provided.placeholder}

                            {/* Add List Button */}
                            <div className="add-list-wrapper">
                                {isAddingList ? (
                                    <div className="add-list-form">
                                        <input
                                            autoFocus
                                            placeholder="Enter list title..."
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                                            className="add-list-input"
                                        />
                                        <div className="add-list-controls">
                                            <button
                                                onClick={handleAddList}
                                                className="btn-primary"
                                            >
                                                Add List
                                            </button>
                                            <button
                                                onClick={() => setIsAddingList(false)}
                                                className="btn-close"
                                            >
                                                <RxPlus className="rotate-45" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingList(true)}
                                        className="add-list-button"
                                    >
                                        <RxPlus />
                                        Add another list
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};
