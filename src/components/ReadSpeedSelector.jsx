// src/components/ReadSpeedSelector.jsx
import {useReadSpeed} from "../contexts/ReadSpeedContext.jsx";

function ReadSpeedSelector() {
    const { readSpeed, setReadSpeed } = useReadSpeed();

    const handleChange = (e) => {
        setReadSpeed(e.target.value);
    };

    return (
        <div className="read-speed-selector">
            <label>
                Leessnelheid:
                <select value={readSpeed} onChange={handleChange}>
                    <option value="slow">Langzaam</option>
                    <option value="medium">Gemiddeld</option>
                    <option value="fast">Snel</option>
                </select>
            </label>
        </div>
    );
}

export default ReadSpeedSelector;
