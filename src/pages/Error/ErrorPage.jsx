import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import styles from './ErrorPage.module.css';

export function ErrorPage() {
    const [imageState, setImageState] = useState({
        url: null,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        fetchRandomImage();
    }, []);

    async function fetchRandomImage() {
        try {
            setImageState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await fetch(
                'https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Quality_images_of_paths&cmtype=file&format=json&origin=*&cmlimit=50'
            );

            if (!response.ok) throw new Error('Network response not ok');

            const data = await response.json();
            const categoryMembers = data.query?.categorymembers;
            if (!categoryMembers?.length) throw new Error('No images found');

            const random = Math.floor(Math.random() * categoryMembers.length);
            const selected = categoryMembers[random];

            const imageResponse = await fetch(
                `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(selected.title)}&prop=imageinfo&iiprop=url&format=json&origin=*`
            );

            if (!imageResponse.ok) throw new Error('Failed fetching image');

            const imageData = await imageResponse.json();
            const pages = imageData.query?.pages;
            const pageId = Object.keys(pages)[0];
            const imageInfo = pages[pageId].imageinfo?.[0];

            if (!imageInfo) throw new Error('No image info found');

            setImageState({
                url: `${imageInfo.url}?t=${Date.now()}`,
                isLoading: false,
                error: null
            });
        } catch (err) {
            setImageState(prev => ({
                ...prev,
                isLoading: false,
                error: err.message
            }));
            console.error('Error fetching image:', err);
        }
    }

    const { url, isLoading, error } = imageState;

    return (
        <div className={styles["error-page-container"]}>
            <div className={styles["error-content"]}>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>Het pad dat je zoekt lijkt ervandoor te zijn gegaan...</p>
                <Link to="/" className={styles["home-link"]}>Return to Home</Link>
            </div>
            <div className={styles["error-image-container"]}>
                {error && <p>Failed to load image: {error}</p>}
                {isLoading && !error && !url && <p>Loading a beautiful path image...</p>}
                {url && (
                    <div className={styles["image-wrapper"]}>
                        <LazyLoadImage
                            src={url}
                            alt="A scenic path"
                            effect="opacity"
                            className={styles["path-image"]}
                            wrapperClassName={styles["image-wrapper"]}
                            threshold={100}
                        />
                        <p className={styles["image-credit"]}>Image from Wikimedia Commons</p>
                    </div>
                )}
            </div>
        </div>
    );
}
