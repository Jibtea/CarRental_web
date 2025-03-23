import { createSlice } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interfaces";
import { PayloadAction } from "@reduxjs/toolkit";

type CartState = {
    providerItems: BookingItem[]
}

const initialState: CartState = { providerItems: [] }

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addReservation: (state, action: PayloadAction<BookingItem>) => {
            state.providerItems.push(action.payload)
        },

        removeReservation: (state, action: PayloadAction<BookingItem>) => {
            const remainItems = state.providerItems.filter(obj => {
                return ((obj.rentalCarProvider !== action.payload.rentalCarProvider)
                    || (obj.pickupDate !== action.payload.pickupDate)
                    || (obj.dropoffDate !== action.payload.dropoffDate))
            })
            state.providerItems = remainItems
        }
    }
})

export const { addReservation, removeReservation } = cartSlice.actions
export default cartSlice.reducer