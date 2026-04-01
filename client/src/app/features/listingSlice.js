import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../../configs/axios";

// Get all public listings
export const getAllPublicListing = createAsyncThunk("listing/getAllPublicListing", async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/listing/public`);
        return data;
    } catch (error) {
        console.log(error);
        return { listings: [] };
    }
});

// Get all user listings 
export const getAllUserListing = createAsyncThunk("listing/getAllUserListing", async ({ token }) => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/listing/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        console.log(error);
        return { listings: [] };
    }
});


const listingSlice = createSlice({
    name: "listing",
    initialState: {
        listings: [],
        userListings: [],
        balance: {
            earned: 0,
            withdrawn: 0,
            available: 0
        }
    },
    reducers: {
        setListings: (state, action) => {
            state.listings = action.payload;
        },   
    },
    extraReducers: (builder)=>{
        builder.addCase(getAllPublicListing.fulfilled,(state, action)=>{
            state.listings = action.payload.listings;
        });
        builder.addCase(getAllUserListing.fulfilled,(state, action)=>{
            state.userListings = action.payload.listings;
            state.balance = action.payload.balance;
        });
    }

});

export const {setListings} = listingSlice.actions;
export default listingSlice.reducer;