import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home/Home.jsx";
import {NewPost} from "./pages/Posts/NewPost.jsx";
import {About} from "./pages/About/About.jsx";
import {SettingsOffline} from "./pages/Settings/SettingsOffline.jsx";
import {ErrorPage} from "./pages/Error/ErrorPage.jsx";
import {NavBar} from "./components/navBar/NavBar.jsx";
import SinglePost from "./pages/Posts/SinglePost.jsx";
import { DataProvider } from "./contexts/OfflineDataContext.jsx";
import { PostsOffline } from "./pages/Posts/PostsOffline.jsx";

function AppOffline() {
    return (
        <DataProvider>
            <NavBar/>
            <Routes>
                <Route path="/posts/:id" element={<SinglePost/>} />
                <Route path="/" element={<Home/>} />
                <Route path="/newpost" element={<NewPost/>} />
                <Route path="/posts" element={<PostsOffline/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/settings" element={<SettingsOffline/>} />
                <Route path="/*" element={<ErrorPage/>} />
            </Routes>
        </DataProvider>
    );
}

export default AppOffline;
