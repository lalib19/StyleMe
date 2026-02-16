"use client"

import { useAppSelector } from "@/src/store/hooks";
import Button from "../ui/Button";

export default function GarmentSelector() {
    const model = useAppSelector((state) => state.model.model);

    function handleGeneration() {
    }

    return (
        <div className="bg-custom-bg-sideSelector h-screen w-1/4 fixed top-0 right-0 z-50 mt-26 pb-10 text-center justify-center border-l-black border-l-2" >
            <div className="h-1/6 border-b border-dashed flex flex-col items-center justify-center">
                {model.top.image && <img src={`https://${model.top.image}`} alt="Top" height={100} width={100} />}
                <div>Top</div>
            </div>
            <div className="h-1/6 border-b border-dashed flex flex-col items-center justify-center">
                {model.bottom.image && <img src={`https://${model.bottom.image}`} alt="Bottom" height={100} width={100} />}
                <div>Bottom</div>
            </div>
            <div className="h-1/6 border-b border-dashed flex flex-col items-center justify-center">
                {model.shoes.image && <img src={`https://${model.shoes.image}`} alt="Shoes" height={100} width={100} />}
                <div>Shoes</div>
            </div>
            <div className="h-1/6 border-b border-dashed flex flex-col items-center ">
                {model.accessories.length > 0 && model.accessories[0].image && (
                    <img src={`https://${model.accessories[0].image}`} alt="Accessories" height={100} width={100} />
                )}
                <div>Accessories</div>
            </div>
            <Button onClick={() => handleGeneration()} className="mt-5">Generate !</Button>
        </div>
    )
}