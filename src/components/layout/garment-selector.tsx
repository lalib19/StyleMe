"use client"

import Button from "../ui/Button";

export default function GarmentSelector() {
    function handleGeneration() {
    }
    return (
        <div className="bg-custom-bg-sideSelector h-screen w-1/4 fixed top-0 right-0 z-50 mt-26 pb-10 text-center justify-center border-l-black border-l-2" >
            <div className="h-1/6 border-b border-dashed">Hat</div>
            <div className="h-1/6 border-b border-dashed">Top</div>
            <div className="h-1/6 border-b border-dashed">Bottom</div>
            <div className="h-1/6 border-b border-dashed">Shoes</div>
            <div className="h-1/6 border-b border-dashed">Accessories</div>
            <Button onClick={handleGeneration} className="mt-5">Generate !</Button>
        </div>
    )
}