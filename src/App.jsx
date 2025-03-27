import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home/Home.jsx";
import {Posts} from "./pages/Posts/Posts.jsx";
import {NewPost} from "./pages/Posts/NewPost.jsx";
import {About} from "./pages/About/About.jsx";
import {Settings} from "./pages/Settings/Settings.jsx";
import {ErrorPage} from "./pages/Error/ErrorPage.jsx";
import {NavBar} from "./components/navBar/NavBar.jsx";
import SinglePost from "./pages/Posts/SinglePost.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";

function App() {
    return (
        <DataProvider>
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
                <Route path="/settings" element={<Settings/>}>
                </Route>
                <Route path="/*" element={<ErrorPage/>}>
                </Route>
            </Routes>
        </DataProvider>
    )
}

export default App
