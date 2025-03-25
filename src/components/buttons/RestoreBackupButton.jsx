import React, {useState} from 'react';
import {getBackup} from "../../services/backupService.js";

function RestoreBackupButton({onRestore}) {
    const [isRestoring, setIsRestoring] = useState(false);
    // const [backup, setBackup] = useState(null);

    const backup = getBackup();

    const handleRestore = async () => {
        if (!backup) {
            alert("No backup available to restore!")
            return;
        }

        setIsRestoring(true)
        try {
            await onRestore(true);
            alert(`Backup restored from${new Date(backup.timestamp).toLocaleString()}`);

        } catch (e) {
            console.error('Failed to restore backup', e)
            alert("failed to restore backup");
        } finally {
            setIsRestoring(false)
        }
    };

    return (
        <button
            onClick={handleRestore}
            disabled={isRestoring || !backup}
            className="restore-button"
        >
            {isRestoring ? 'Bezig met herstellen...' : 'Herstel van backup'}

        </button>
    );
}

export default RestoreBackupButton;
