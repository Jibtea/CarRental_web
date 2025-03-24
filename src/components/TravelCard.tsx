'use client'
import { VlogPlayer } from "./VlogPlayer"
import { useState } from "react"
import { Rating } from "@mui/material"
import { useWindowListener } from "@/hooks/useWindowListener"

export function TravelCard(){

    const [playing, setPlaying] = useState(true)
    const [rating, setRating] = useState(0)
    const [pointerPosition, setPointerPosition] = useState({x:0,y:0});

    useWindowListener('pointermove',
        (e)=>{setPointerPosition({x:(e as PointerEvent).clientX, y: (e as PointerEvent).clientY})}
    )

    return(
        <div className='w-[80%] shadow-lg mx-[10%] my-10 p-2 rounded-lg bg-gray-200 flex flex-row'>
            <VlogPlayer isPlaying={playing} vdoSrc="/video/ThailandNatural.mp4"></VlogPlayer>
            <div className="m-5 font-serif">
                <h1 className="mb-3 text-xl font-bold leading-relaxed tracking-wider">I kicked my mom out of the house</h1>
                <button className="w-32 h-10 text-md opacity-90 hover:shadow-inner hover:shadow-blue-800 
                        hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-4 
                        rounded-xl font-serif flex items-center justify-center relative group mt-2"
                onClick={()=> setPlaying(!playing)}>
                    {playing? 'Pause':'Play'}
                </button>
                <p>6733032421 Jiratchaya Kunyaphila</p>
                <p>6733032421 Rachata Boonmemechai</p>
                <p>6733218921 Ratima Klabprasit</p>
            </div>
        </div>
    )
}