import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getDashboardEmailChart as getDashboardEmailChartApi,
    getEarningChartsData as getEarningChartsDataApi,
    getTopSellingData as getTopSellingDataApi,
    getTransaction as getTransactionApi,
    getWalletBalance as getWalletBalanceApi,
    getVisitors as getVisitorsApi,
    getStatisticsApplications as getStatisticsApplicationsApi
} from "../../helpers/fakebackend_helper";

export const getEarningChartsData = createAsyncThunk("dashboard/getEarningChartsData", async (month: any) => {
    try {
        const response = getEarningChartsDataApi(month);
        return response;
    } catch (error) {
        return error;
    }
});

export const getTopSellingData = createAsyncThunk("dashboard/getTopSellingData", async (month: any) => {
    try {
        const response = getTopSellingDataApi(month);
        return response;
    } catch (error) {
        return error;
    }
});

export const getChartData = createAsyncThunk("dashboard/getChartData", async (chartType: any) => {
    try {
        const response = getDashboardEmailChartApi(chartType);
        return response;
    } catch (error) {
        return error;
    }
});

export const getTransaction = createAsyncThunk("dashboard/getTransaction", async () => {
    try {
        const response = getTransactionApi();
        return response;
    } catch (error) {
        return error;
    }
});

// dashboard-crypto
// Wallet Balance
export const getWalletBalance = createAsyncThunk("dashboard/getWalletBalance", async (data: any) => {
    try {
        const response = getWalletBalanceApi(data);
        return response;
    } catch (error) {
        return error;
    }
});

// dashboard-blog
// Visitors
export const getVisitors = createAsyncThunk("dashboard/getVisitors", async (data: any) => {
    try {
        const response = getVisitorsApi(data);
        return response;
    } catch (error) {
        return error;
    }
});

// dashboard-job
// statistics Applications
export const getStatisticsApplications = createAsyncThunk("dashboard/getStatisticsApplications", async (data: any) => {
    try {
        const response = getStatisticsApplicationsApi(data);
        return response;
    } catch (error) {
        return error;
    }
});