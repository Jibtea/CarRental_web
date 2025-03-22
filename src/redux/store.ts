import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import { UseSelector, TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
    reducer:{
        cartSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector