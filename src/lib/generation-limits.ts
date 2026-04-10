import { getCachedGenerationCount, setCachedGenerationCount } from './redis';
import { getUserDataFromDB } from './db';

export async function checkGenerationLimit(userEmail: string, maxGenerations: number = 3) {
    try {
        let generationCount = await getCachedGenerationCount(userEmail);
        if (generationCount === null) {
            console.log(`Checking generation limit for ${userEmail} - cache miss`);
            const { generations } = await getUserDataFromDB(userEmail);
            generationCount = generations.length;
            await setCachedGenerationCount(userEmail, generationCount);
        } else {
            console.log(`Checking generation limit for ${userEmail} - cache hit: ${generationCount}`);
        }

        const isAtLimit = generationCount >= maxGenerations;
        return {
            allowed: !isAtLimit,
            currentCount: generationCount,
            maxGenerations,
            message: isAtLimit
                ? `Generation limit reached (${generationCount}/${maxGenerations})`
                : `${maxGenerations - generationCount} generations remaining`
        };

    } catch (error) {
        console.error('Error checking generation limit:', error);
        // Fallback: allow generation if we can't check (don't block users due to technical issues)
        // return {
        //     allowed: true,
        //     currentCount: 0,
        //     maxGenerations,
        //     message: 'Could not verify limit - proceeding with generation'
        // };
        return {
            allowed: false,
            currentCount: 0,
            maxGenerations,
            message: 'Could not verify limit - blocking generation'
        };
    }
}
