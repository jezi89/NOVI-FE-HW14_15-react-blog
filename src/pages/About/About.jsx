import './About.css';
import PageLayout from '../../components/PageLayOut/PageLayout.jsx';

export function About() {
    return (
        <PageLayout className="about-page">
        <div className="about-container">
            <h1>Over Reisblog</h1>
            
            <section className="about-section">
                <h2>Onze Missie</h2>
                <p>
                    Welkom bij Reisblog! Ons doel is om reizigers te inspireren door middel van persoonlijke verhalen,
                    praktische tips en prachtige beelden van bestemmingen over de hele wereld. Of je nu een doorgewinterde
                    globetrotter bent of droomt van je eerste grote avontuur, wij willen je helpen om het meeste uit je
                    reiservaringen te halen.
                </p>
                <p>
                    We geloven dat reizen meer is dan alleen het bezoeken van nieuwe plekken - het gaat om het opdoen van nieuwe
                    perspectieven, het ontmoeten van verschillende culturen en het creëren van blijvende herinneringen.
                </p>
            </section>
            
            <section className="author-section">
                <h2>Over de Auteur</h2>
                <div className="author-info">
                    <img 
                        src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" 
                        alt="Auteur foto" 
                        className="author-photo"
                    />
                    <div>
                        <p>
                            Hoi! Mijn naam is <span className="highlight">Emma Reislustig</span>, een gepassioneerde reiziger met meer dan 10 jaar
                            ervaring in het verkennen van afgelegen bestemmingen.
                        </p>
                        <p>
                            Na mijn studie Internationale betrekkingen besloot ik mijn liefde voor reizen en schrijven te 
                            combineren door deze blog te starten.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link">Instagram</a>
                            <a href="#" className="social-link">Twitter</a>
                            <a href="#" className="social-link">Email</a>
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <h2>Contact</h2>
                <p>
                    Heb je vragen, suggesties of wil je samenwerken? Neem contact op via 
                    <a href="mailto:info@reisblog.nl" style={{color: 'var(--color-link)', marginLeft: '5px'}}>
                        info@reisblog.nl
                    </a>
                </p>
            </section>
        </div>
        </PageLayout>
    );
}
