import {NavLink, Link} from "react-router-dom";
import './NavBar.css';

export function NavBar() {
    return (
        <nav>
            <Link to="/" className="brand">ReisBlog</Link>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/posts">Alle Posts</NavLink></li>
                <li><NavLink to="/newpost">Nieuwe Post</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
            </ul>
        </nav>
    )
}
