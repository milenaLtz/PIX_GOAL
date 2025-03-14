import { Link } from "react-router-dom";
import avatar from "../shared/icons/icons8-avatar-96 1.svg"


const Header = () => {
    return(
        <>
            <header className="header">
                <div className="header-wrapper">
                    <div className="header__button-wrapper">
                        <button className="header__button button button--sibe-bar-toggle"></button>
                        <button className="header__button button">Создать</button>
                    </div>
                    <Link className="header__link" to="/homePage">
                      <img src={avatar} width={25} height={25}/>
                    </Link>
                </div>
            </header>
        </>
    )
}
export default Header;
