import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getEarningChartsData, getTopSellingData, getChartData, getTransaction, getWalletBalance, getVisitors, getStatisticsApplications } from "./thunk";

// types
import { DashboardEmailItem, LatestTransactions } from "../../pages/Dashboard/type";

interface initialStateType {
    dashboardTransaction: LatestTransactions[],
    dashboardChartData: DashboardEmailItem[],
    error: object;
    loading: boolean;
}

interface Error {
    error: object
}

export const initialState: initialStateType = {
    dashboardTransaction: [],
    dashboardChartData: [],
    error: {},
    loading: true
};

const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
       
        builder.addCase(getEarningChartsData.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getTopSellingData.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getChartData.fulfilled, (state: initialStateType, action: PayloadAction<DashboardEmailItem[]>) => {
            state.dashboardChartData = action.payload;
        });

        builder.addCase(getChartData.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getTransaction.fulfilled, (state: initialStateType, action: PayloadAction<LatestTransactions[]>) => {
            state.dashboardTransaction = action.payload;
        });

        builder.addCase(getTransaction.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });

        builder.addCase(getWalletBalance.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });
        builder.addCase(getVisitors.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });
        builder.addCase(getStatisticsApplications.rejected, (state: initialStateType, action: PayloadAction<Error | any>) => {
            state.error = action.payload ? action.payload?.error : null;
        });
    }
})

export default dashboardSlice.reducer;