'use client'
import React from "react";

export default function InteractiveCard({ children, contentName, detail }: { children: React.ReactNode, contentName: string, detail: string }) {

    function onCardSelected() {
        alert("You selected " + contentName)
    }

    function onCardMouseAction(event: React.SyntheticEvent) {
        if (event.type == 'mouseover') {
            event.currentTarget.classList.remove('shadow-lg')
            event.currentTarget.classList.add('shadow-2xl')
        } else {
            event.currentTarget.classList.remove('shadow-2xl')
            event.currentTarget.classList.add('shadow-lg')
        }
    }

    return (
        <div className='w-full rounded-lg shadow-lg'
            onMouseOver={(e) => onCardMouseAction(e)}
            onMouseOut={(e) => onCardMouseAction(e)}>
            {children}
        </div>
    );
}