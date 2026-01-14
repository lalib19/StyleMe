import { testRateLimit, checkAllCategoryProducts } from "../lib/api-checker";
import { checkApiEndpoint } from "../lib/clothing-fetch";

export default function ApiFunctions() {
    const handleTestRateLimit = async () => {
        const result = await testRateLimit();
    };

    return (
        <>
            <button className={"rounded px-4 py-2 outline my-4 bg-red-400 hover:cursor-pointer hover:bg-amber-400"}
                onClick={() => handleTestRateLimit()}>Test Current Rate Limit</button>
            <button className={"rounded px-4 py-2 outline my-4 bg-red-400 hover:cursor-pointer hover:bg-amber-400"}
                onClick={() => checkAllCategoryProducts()}>Test Categories Available</button>
            <button className={"rounded px-4 py-2 outline my-4 bg-red-400 hover:cursor-pointer hover:bg-amber-400"}
                onClick={() => checkApiEndpoint()}>checkApiEndpoint</button>
        </>
    )
}