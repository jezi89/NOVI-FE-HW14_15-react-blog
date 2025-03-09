import './App.css'
import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home.jsx";
import {Posts} from "./pages/Posts.jsx";
import {NewPost} from "./pages/NewPost.jsx";
import {About} from "./pages/About.jsx";
import {ErrorPage} from "./pages/ErrorPage.jsx";
import {NavBar} from "./components/NavBar.jsx";

function App() {
    return (
        <>
<NavBar/>
        <Routes>
            <Route path ="/" element = {<Home/>}>
            </Route>
            <Route path ="/newpost" element = {<NewPost/>}>
            </Route>
            <Route path ="/posts" element = {<Posts/>}>
            </Route>
            <Route path ="/about" element = {<About/>}>
            </Route>
            <Route path ="/errorpage" element = {<ErrorPage/>}>
            </Route>
        </Routes>
        </>
    )
}

export default App
