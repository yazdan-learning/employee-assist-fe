export interface Report {
    title: string;
    iconClass: string;
    description: string;
}

export interface Series {
    name: string;
    data: number[];
}

export interface DashboardEmailItem {
    id: string;
    Year?: Series[];
    Month?: Series[];
    Week?: Series[];
}

export interface Social {
    title: string;
    bgColor: string;
    iconClass: string;
    description: string;
}

export interface LatestTransactions {
    orderId: string;
    billingName: string;
    orderDate: string;
    total: string;
    paymentStatus: string;
    methodIcon: string;
    paymentMethod: string;
}