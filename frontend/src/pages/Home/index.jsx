// Menu / Links / Config / Tema / User / Tuto

import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";

export default function Home(props){

    return (
        <Fragment>
            <Header/>
            <NavTabs/>
            <Outlet/>
        </Fragment>

    )
}