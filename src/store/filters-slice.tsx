import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
    gender: string | null;
    garmentType: string | null;
}

const initialState: FiltersState = {
    gender: null,
    garmentType: null,
}

const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        selectGender(state, action: PayloadAction<string | null>) {
            state.gender = action.payload;
        },
        selectGarmentType(state, action: PayloadAction<string | null>) {
            state.garmentType = action.payload;
        }
    },
})

export const { selectGender, selectGarmentType } = filtersSlice.actions;
export default filtersSlice;