import {NavLink} from "react-router-dom";
import './NavBar.css';

export function NavBar() {
    return (
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink>   </li>
                <li><NavLink to="/posts">Alle Posts</NavLink></li>
                <li><NavLink to="/newpost">Nieuwe Posts</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
            </ul>
        </nav>
    )
}
