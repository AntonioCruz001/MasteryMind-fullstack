import React from 'react'
import { NavLink } from 'react-router-dom'

export default function ContentLink({ classname = "", link, children, desktopMode = false }){
    // const modeStyles = desktopMode 
    //     ? "bg-brandNavBg hover:bg-brandNavHoverBg text-white text-xs py-1.5 px-3 rounded-lg transition-colors" 
    //     : "bg-teal-700 hover:bg-teal-800 grow text-center  cursor-pointer border-[#1f6c6b]";

    return (
        <NavLink 
            to={link} 
            className={({ isActive }) => `
                  flex-1 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-center 
                ${isActive 
                    ? 'bg-brandNavActiveBg text-brandNavActiveText  font-bold shadow-sm' 
                    : 'bg-brandNavBg text-brandNavInactiveText hover:bg-brandNavHoverBg hover:text-brandNavActiveText'
                }
                
                ${classname}
            `}
        >
            {children}
        </NavLink>
    )
}