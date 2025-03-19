import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home/Home.jsx";
import {Posts} from "./pages/Posts/Posts.jsx";
import {NewPost} from "./pages/Posts/NewPost.jsx";
import {About} from "./pages/About/About.jsx";
import {ErrorPage} from "./pages/Error/ErrorPage.jsx";
import {NavBar} from "./components/NavBar/NavBar.jsx";
import SinglePost from "./pages/Posts/SinglePost.jsx";

function App() {
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/posts/:id" element={<SinglePost/>}>
                </Route>
                <Route path="/" element={<Home/>}>
                </Route>
                <Route path="/newpost" element={<NewPost/>}>
                </Route>
                <Route path="/posts" element={<Posts/>}>
                </Route>
                <Route path="/about" element={<About/>}>
                </Route>
                <Route path="/*" element={<ErrorPage/>}>
                </Route>
            </Routes>
        </>
    )
}

export default App
