import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, Menu, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn'; // quick utility
import { getUsers } from '../utils/assetLoader';

const Sidebar = () => {
    const users = getUsers();

    return (
        <div className="fixed left-0 top-0 h-full w-[244px] border-r border-ig-separator bg-ig-primary p-4 hidden md:flex flex-col">
            <div className="mb-8 px-4 py-4">
                <h1 className="text-2xl font-bold italic font-serif">Instagram</h1>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem to="/" icon={<Home size={24} />} label="Home" />
                <NavItem icon={<Search size={24} />} label="Search" onClick={() => { }} />
                <NavItem icon={<Compass size={24} />} label="Explore" onClick={() => { }} />
                <NavItem icon={<MessageCircle size={24} />} label="Messages" onClick={() => { }} />
                <NavItem icon={<Heart size={24} />} label="Notifications" onClick={() => { }} />
                <NavItem icon={<PlusSquare size={24} />} label="Create" onClick={() => { }} />

                <div className="mt-8 border-t border-ig-separator pt-4">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 mb-2">ACCOUNTS</h3>
                    <div className="space-y-1">
                        {users.map(u => (
                            <NavLink
                                key={u.name}
                                to={`/profile/${encodeURIComponent(u.name)}`}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-ig-secondary group",
                                    isActive ? "font-bold" : ""
                                )}
                            >
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800">
                                    {u.avatar && <img src={u.avatar} className="w-full h-full object-cover" />}
                                </div>
                                <span className="truncate text-sm">{u.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="mt-auto">
                <NavItem icon={<Menu size={24} />} label="More" onClick={() => { }} />
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, to, onClick }) => {
    const commonClasses = "flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-ig-secondary group w-full text-left cursor-pointer";
    const content = (
        <>
            <div className="group-hover:scale-105 transition-transform">
                {icon}
            </div>
            <span className="text-base">{label}</span>
        </>
    );

    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) => cn(
                    commonClasses,
                    isActive ? "font-bold" : ""
                )}
            >
                {content}
            </NavLink>
        );
    }

    return (
        <button className={commonClasses} onClick={onClick}>
            {content}
        </button>
    );
};

export default Sidebar;
