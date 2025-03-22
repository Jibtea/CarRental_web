'use client'
import { useReducer } from "react";
import ProductCard from "./ProductCard";
import { compare } from "bcryptjs";
import Link from "next/link";
import { useRef,useEffect } from "react";
import getCars from "@/libs/getCars";
import { useState } from "react";

export default function CarPanel() {

    const [carResponse, setCarResponse] = useState(null)

    useEffect(()=>{
        const fetchData = async () => {
            const cars = await getCars()
            setCarResponse(cars)
        }
        fetchData()
    },[])

    const countRef = useRef(0)
    const inputRef = useRef<HTMLInputElement>(null)
    let count = 0;

    const compareReducer = (compareList:Set<string>, action:{type:string, carName:string}) =>{
        switch(action.type){
            case 'add' : {
                return new Set(compareList.add(action.carName))
            }
            case 'remove' :{
                compareList.delete(action.carName)
                return new Set(compareList)
            }
            default : return compareList
        }
    }

    const [compareList, dispatchCompare] = useReducer(compareReducer, new Set<string>())

    /**
     * Mock Data for Demostraition Only
     */

    /*
    const mockCarRepo = [{cid:"001", name:"Honda Civic", image:"/img/civic.jpg"},
                {cid:"002", name:"Honda Accord", image:"/img/accord.jpg"},
                {cid:"003", name:"Toyota Fortuner", image:"/img/fortuner.jpg"},
                {cid:"004", name:"Tesla Model 3", image:"/img/tesla.jpg"},
    ]
    */

    if(!carResponse) return (<p>Car Panel is Loading ...</p>)

    return (
        <div>
             <div  style={{margin : "20px", display:"flex",
              flexDirection:"row", flexWrap:"wrap", 
              justifyContent:"space-around", alignContent:"space-around" ,padding:"10px"}}>
                        {
                        carResponse.data.map((carItem)=>(
                            <Link href={`/car/${carItem.cid}`} className="w-1/5" key={carItem.id}>
                            <ProductCard carName={carItem.model} imgSrc={carItem.picture}
                            onCompare={(car:string)=>dispatchCompare({type:'add', carName:car})}
                            />
                            </Link>
                        )
                    )
                }
                  </div>
                  <div className="w-full text-xl font-medium" >Compare List: {compareList.size}</div>
                  {Array.from(compareList).map((car)=><div key={car}
                        onClick={()=>dispatchCompare({type:'remove',carName:car})}>
                  {car}</div>)}

                  <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                  text-white shadow-sm"
                  onClick={()=>{countRef.current = countRef.current+1; alert(countRef.current)}}>
                    Count with Ref object
                  </button>

                  <input type="text" placeholder="please fill" className="block text gray text-sm 
                    rounded-lg p-2 m-2 bg-purple-50 ring-1 ring-inset ring-purple-400
                    focus:outline-none focus:bg-purple-200 focus:ring-2"
                    ref={inputRef}/>
                <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                text-white shadow-sm"
                onClick={()=>{if(inputRef.current!=null) inputRef.current.focus()}}>
                    Focus Input
                </button>

        </div>
    );
}