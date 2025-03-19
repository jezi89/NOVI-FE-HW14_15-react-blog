// src/components/PageLayout.jsx
import React from 'react';
import styles from './PageLayout.module.css';

function PageLayout({ children, className }) {
    return (
        <div className={`${styles.pageLayout} ${className || ''}`}>
            {children}
        </div>
    );
}

export default PageLayout;
