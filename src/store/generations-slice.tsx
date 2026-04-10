import { CartItemType } from "./cart-slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GenerationDataType = {
    id: number;
    userImage: string;
    garments: CartItemType[];
    generatedImageUrl: string;
}

type GenerationsState = {
    generations: GenerationDataType[];
    newGenerations: boolean;
}

const initialState: GenerationsState = {
    generations: [],
    newGenerations: false
};

const generationsSlice = createSlice({
    name: "generations",
    initialState,
    reducers: {
        loadGenerations(state, action: PayloadAction<GenerationDataType[]>) {
            state.generations = action.payload;
            state.newGenerations = false;
        },
        addGeneration(state, action: PayloadAction<GenerationDataType>) {
            state.generations.push(action.payload);
            state.newGenerations = true;
        },
        setNewGenerations(state, action: PayloadAction<boolean>) {
            state.newGenerations = action.payload;
        }
    }
})

export const { loadGenerations, addGeneration, setNewGenerations } = generationsSlice.actions
export default generationsSlice