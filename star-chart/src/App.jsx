import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const correctOrder = [
    "constellation-fragment-3.png",
    "constellation-fragment-1.png",
    "constellation-fragment-4.png",
    "constellation-fragment-2.png",
    "constellation-fragment-5.png",
];

const initialOrder = [
    "constellation-fragment-5.png",
    "constellation-fragment-3.png",
    "constellation-fragment-1.png",
    "constellation-fragment-4.png",
    "constellation-fragment-2.png",
];

// Draggable Image Component
const DraggableImage = ({ src, fromSolutionBox }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "image",
        item: { src, fromSolutionBox },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} className={`draggable ${isDragging ? "dragging" : ""}`}>
            <img src={`/images/${src}`} alt={src} />
        </div>
    );
};

// Drop Zone Component
const DropZone = ({ onDrop, children }) => {
    const [{ isOver }, drop] = useDrop({
        accept: "image",
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} className={`drop-zone ${isOver ? "over" : ""}`}>
            {children}
        </div>
    );
};

function App() {
    const [availableImages, setAvailableImages] = useState(initialOrder);
    const [solutionBox, setSolutionBox] = useState([]);
    const [isSolved, setIsSolved] = useState(false);
    const [error, setError] = useState(false);

    const handleDrop = (item) => {
        if (item.fromSolutionBox) {
            // Move image back to Available Images
            setSolutionBox(solutionBox.filter((img) => img !== item.src));
            setAvailableImages([...availableImages, item.src]);
        } else {
            // Move image to Solution Box
            if (!solutionBox.includes(item.src)) {
                setSolutionBox([...solutionBox, item.src]);
                setAvailableImages(availableImages.filter((img) => img !== item.src));
            }
        }
    };

    const handleSubmit = () => {
        if (JSON.stringify(solutionBox) === JSON.stringify(correctOrder)) {
            setIsSolved(true);
            setError(false);
        } else {
            setIsSolved(false);
            setError(true);
        }
    };

    const handleReset = () => {
        setSolutionBox([]);
        setAvailableImages(initialOrder);
        setIsSolved(false);
        setError(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container">
                <h2>Star Chart Puzzle</h2>

                <div className="available-images">
                    {availableImages.map((src) => (
                        <DraggableImage key={src} src={src} fromSolutionBox={false} />
                    ))}
                </div>
                <h4>Drop images below in the correct order</h4>
                <DropZone onDrop={handleDrop}>
                    <div className="solution-box">
                        {solutionBox.map((src) => (
                            <DraggableImage key={src} src={src} fromSolutionBox={true} />
                        ))}
                    </div>
                </DropZone>

                <div className="actions">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleReset}>Reset</button>
                </div>

                {isSolved && <div className="success">Coordinates to Earth: 38.79 N 106.53</div>}
                {error && <div className="error">Try Again!</div>}
            </div>
        </DndProvider>
    );
}

export default App;
