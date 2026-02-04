import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import { LikesProvider } from './context/LikesContext';

const Layout = () => (
    <div className="flex min-h-screen bg-ig-primary text-white">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-[245px] max-w-screen-lg mx-auto w-full">
            <Outlet />
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
                        {/* Fallback to Feed for explore/etc for now */}
                        <Route path="/explore" element={<Feed />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LikesProvider>
    );
}

export default App;
