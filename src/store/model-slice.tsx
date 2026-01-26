import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
    model: {
        top: {
            id: string;
            image: string
        };
        bottom: {
            id: string;
            image: string
        };
        shoes: {
            id: string;
            image: string
        };
        hat: {
            id: string;
            image: string
        };
        accessories: {
            id: string;
            image: string
        }[]
    }
}

const initialState: ModelState = {
    model: {
        top: {
            id: "",
            image: ""
        },
        bottom: {
            id: "",
            image: ""
        },
        shoes: {
            id: "",
            image: ""
        },
        hat: {
            id: "",
            image: ""
        },
        accessories: []
    }
}

const modelSlice = createSlice({
    name: "model",
    initialState,
    reducers: {
        setTop(state, action: PayloadAction<{ id: string; image: string }>) {
            state.model.top.id = action.payload.id
            state.model.top.image = action.payload.image
        },
        setBottom(state, action: PayloadAction<{ id: string; image: string }>) {
            state.model.bottom.id = action.payload.id
            state.model.bottom.image = action.payload.image
        },
        setShoes(state, action: PayloadAction<{ id: string; image: string }>) {
            state.model.shoes.id = action.payload.id
            state.model.shoes.image = action.payload.image
        },
        setHat(state, action: PayloadAction<{ id: string; image: string }>) {
            state.model.hat.id = action.payload.id
            state.model.hat.image = action.payload.image
        },
        addAccessory(state, action: PayloadAction<{ id: string; image: string }>) {
            state.model.accessories.push({
                id: action.payload.id,
                image: action.payload.image
            })
        }
    }
})

export const { setTop, setBottom, setShoes, setHat, addAccessory } = modelSlice.actions
export default modelSlice