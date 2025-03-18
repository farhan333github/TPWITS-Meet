import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <ul className="unodered-list">
                <li><Link to="/meeting">Meetings</Link></li>
                <li><Link to="/notifications">Notifications</Link></li>
                <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
}

export default Navbar;







