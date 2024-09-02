// import './css/CRUD.css';
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import UseReg from "./SignUp/SignUp";
import Page404 from './Page404/Page404';
import { StartPages } from './StartPage/StartPages';


/**
 * главный компомент с навигацией по сайту
 */
function CRUD() {
    return (
        <div className="container navigation-menu">
            {/* <Menu /> */}
            {/* <div className="page-crud"> */}
                <Routes>
                    <Route path="/" element={<StartPages />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<UseReg />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            {/* </div> */}
        </div>
    );
}

export default CRUD;