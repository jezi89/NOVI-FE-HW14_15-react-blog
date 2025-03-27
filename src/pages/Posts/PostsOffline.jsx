import ReadSpeedSelector from "../../components/ReadSpeedSelector.jsx";
import PostsGridOffline from "../../components/postsGrid/PostsGridOffline.jsx";
import PageLayout from '../../components/pageLayOut/PageLayout.jsx';
import { useData } from "../../contexts/OfflineDataContext.jsx";

export function PostsOffline() {
    const { isOffline, syncStatus } = useData();

    return (
        <PageLayout>
            {/* Optioneel: toon een banner bovenaan bij offline modus */}
            {isOffline && (
                <div className="offlineBanner">
                    Je bent momenteel in offline modus. Wijzigingen worden lokaal opgeslagen 
                    en gesynchroniseerd wanneer er weer verbinding is.
                </div>
            )}
            {syncStatus === 'failed' && !isOffline && (
                <div className="syncFailedBanner">
                    Synchronisatie mislukt. Je wijzigingen zijn lokaal opgeslagen 
                    maar nog niet gesynchroniseerd met de server.
                </div>
            )}
            
            <PostsGridOffline/>
            <ReadSpeedSelector/>
        </PageLayout>
    );
}

/* If the .postItem class is in another CSS module */