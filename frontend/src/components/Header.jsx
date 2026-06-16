import React from "react";
import { Fragment } from "react";

export default function Header(props) {
    return (
        <Fragment>
            <header className="header">
                <h1 className="title"> {props.title} </h1>
                <p className="subtitle"> {props.subtitle} </p>
            </header>
        </Fragment>
    )
}