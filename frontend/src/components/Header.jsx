import React from "react";
import { Fragment } from "react";
import Button from "./Button";

import './Header.css'

export default function Header(props) {
    return (
        <Fragment>
            <header className="header">
                <h1 className="title"> {props.title} </h1>
                <Button className="btn-entrar">Entrar</Button>
                {/* <p className="subtitle"> {props.subtitle} </p> */}
            </header>
        </Fragment>
    )
}