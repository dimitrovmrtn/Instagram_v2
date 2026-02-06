import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import { LikesProvider } from './context/LikesContext';

import RightSidebar from './components/RightSidebar';

const Layout = () => (
    <div className="flex min-h-screen bg-ig-primary text-white">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-[245px] flex justify-center w-full">
            <div className="w-full max-w-[630px]">
                <Outlet />
            </div>
            <RightSidebar />
        </main>
    </div>
);

function App() {
    return (
        <LikesProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Feed />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/explore" element={<Explore />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LikesProvider>
    );
}

export default App;
