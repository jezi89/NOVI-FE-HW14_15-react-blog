import logo from "../../assets/logo-white.png";
import {Link} from "react-router-dom";
import styles from "./Home.module.css"

export function Home() {
    return (
        <>
            <div className="page-container">
                <img src={logo} alt="Company logo"/>
                <h1 className={styles.mainTitle}>Posts over bijzondere reizen, zonder poespas</h1>
                <h3 className={styles.mainSubTitle}>TLDR-proof: Lees al onze content op eigen tempo, maar altijd in een
                                                    mum
                                                    van
                                                    tijd <span className={styles.bigEmoji}><Link
                        to="/posts">⏩</Link></span>
                </h3>
            </div>
        </>


    )
}
