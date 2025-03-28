// src/components/pageLayOut/PageLayout.jsx
import React from 'react';
import styles from './PageLayout.module.css';

function PageLayout({ children, className, fullHeight = false }) {
    return (
        <main className={`${styles.pageLayout} ${fullHeight ? styles.fullHeight : ''} ${className || ''}`}>
            <div className={styles.innerContainer}>
                {children}
            </div>
        </main>
    );
}

export default PageLayout;
