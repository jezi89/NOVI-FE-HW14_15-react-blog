import logo from "../../assets/logo-white.png";
import {Link} from "react-router-dom";
import styles from "./Home.module.css"
import { ArrowRight } from "@phosphor-icons/react";

export function Home() {
    return (
        <div className={`page-container ${styles["homepage-container"]}`}>
            {/* Decoratieve elementen voor de lege ruimtes */}
            <div className={`${styles["travel-element"]} ${styles.compass}`}>🧭</div>
            <div className={`${styles["travel-element"]} ${styles.map}`}>🗺️</div>
            <div className={`${styles["travel-element"]} ${styles.plane}`}>✈️</div>
            
            <img src={logo} alt="Company logo"/>
            <h1 className={styles.mainTitle}>Blog over bijzondere reizen, zonder poespas</h1>
            <div className={styles.subtitleContainer}>
                <h3 className={styles.mainSubTitle}>
                    TLDR-proof: Lees al onze content op eigen tempo, maar altijd in een mum van tijd
                </h3>
                <Link to="/posts" className={styles.emojiLink}>
                <span className={styles.emoji}>
                    <ArrowRight size={64} weight="fill" />
                </span>
                </Link>
            </div>
            
            <Link to="/posts" className={styles.ctaButton}>
                Ontdek Onze Verhalen
            </Link>
        </div>
    )
}
