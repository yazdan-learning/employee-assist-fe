import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data: any) => {
  return api.create(url.POST_FAKE_REGISTER, data)
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postFakeLogin = (data: any) => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data: any) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data: any) => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data: any) => api.create(url.POST_EDIT_PROFILE, data);

// Register Method
export const postJwtRegister = (url: any, data: any) => {
  return api.create(url, data)
    .catch((err: any) => {
      let message: any = "";
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = (data: any) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data: any) => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data: any) => api.create(url.SOCIAL_LOGIN, data);

// Calendar
// api.get Events
export const getEvents = () => api.get(url.GET_EVENTS, null);

// api.get Events
export const getCategories = () => api.get(url.GET_CATEGORIES, null);

// add Events
export const addNewEvent = (event: any) => api.create(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = (event: any) => api.put(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = (event: any) => api.delete(url.DELETE_EVENT, { headers: { event } });

// api.get Messages
export const getMessages = (roomId: any) => api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// add Message
export const addMessage = (message: any) => api.create(url.ADD_MESSAGE, message);

export const deleteMessage = (event: any) => api.delete(url.DELETE_MESSAGE, { headers: { event } });

// email
export const getMailsListsId = ((id: string) => api.get(`${url.GET_MAILS_ID}/${id}`, { params: { id } }))
export const getMailsLists = () => api.get(url.GET_INBOX_MAILS, null);
export const getSelectFolders = () => api.get(url.SELECT_FOLDER, null);
export const getselectedmails = (selectEmailId: any) => api.create(url.GET_SELECTE_MAIL, { params: selectEmailId });
export const getUpdateMail = (mail: any) => api.put(url.UPDATE_MAIL, mail);
export const setFolderOnSelectedMails = (data: any) => api.delete(url.SET_FOLDER_SELECTED_MAILS, { headers: { data } })
export const staredMail = (mail: any) => api.delete(url.STARED_MAIL, { headers: { mail } })
export const trashMail = (mail: any) => api.delete(url.TRASH_MAIL, { headers: { mail } })

// delete Mail
export const deleteMail = (mail: any) => api.delete(url.DELETE_MAIL, { headers: { mail } });

// Ecommerce
// api.get Products
export const getProducts = () => api.get(url.GET_PRODUCTS, null);

// api.get ProductDetails
export const getProductDetail = (id: number) =>
  api.get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } });

//cart
export const getCart = () => api.get(url.GET_CART, null);
export const deleteCart = (cart: any) => api.delete(url.DELETE_CART, { headers: { cart } });

// get shops
export const getShops = () => api.get(url.GET_SHOPS, null);

// api.get Orders
export const getOrders = () => api.get(url.GET_ORDERS, null);

// add Order
export const addNewOrder = (order: any) => api.create(url.ADD_NEW_ORDER, order);

// update Order
export const updateOrder = (order: any) => api.put(url.UPDATE_ORDER, order);

// delete Order
export const deleteOrder = (order: any) => api.delete(url.DELETE_ORDER, { headers: { order } });

// api.get Customers
export const getCustomers = () => api.get(url.GET_CUSTOMERS, null);

// add Customers
export const addNewCustomer = (customer: any) => api.create(url.ADD_NEW_CUSTOMER, customer);

// update Customers
export const updateCustomer = (customer: any) => api.put(url.UPDATE_CUSTOMER, customer);

// delete Customers
export const deleteCustomer = (customer: any) => api.delete(url.DELETE_CUSTOMER, { headers: { customer } });

// get wallet
export const getWallet = () => api.get(url.GET_WALLET, null);
//get wallwr / activities
export const getWalletActivities = () => api.get(url.GET_WALLET_ACTIVITIES, null);

// get tasks
export const getTasks = () => api.get(url.GET_TASKS, null);
export const addNewTasks = (data: any) => api.create(url.ADD_TASKS, data)
export const updateTasks = (data: any) => api.put(url.UPDATE_TASKS, data)
export const deleteTasks = (data: any) => api.delete(url.DELETE_TASKS, { headers: { data } })

//// get contacts
export const getUsers = () => api.get(url.GET_USERS, null);

// add User
export const addNewUser = (user: any) => api.create(url.ADD_NEW_USERS, user);

// update User
export const updateUser = (user: any) => api.put(url.UPDATE_USERS, user);


//Delete Contact User
export const deleteUsers = (users: any) => api.delete(url.DELETE_USERS, { headers: { users } });

export const getUserProfile = () => api.get(url.GET_USER_PROFILE, null);

export const getEarningChartsData = (month: any) => api.get(`${url.GET_EARNING_DATA}/${month}`, { params: { month } });

export const getTopSellingData = (month: any) => api.get(`${url.TOP_SELLING_DATA}/${month}`, { params: { month } });

// CRM
// api.get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS, null);

// Order List
export const getCryptoOrderList = () => api.get(url.GET_CRYPTO_ORDRER_LIST, null);

// Invoice
//api.get Invoice
export const getInvoices = () => api.get(url.GET_INVOICES, null);

export const getInvoicesDetail = (id: number) => api.get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } });

// get project
export const getProjects = () => api.get(url.GET_PROJECTS, null);

/** PROJECT */
// update user
export const updateProject = (project: any) => api.put(url.UPDATE_PROJECT, project);

// delete user
export const deleteProject = (project: any) => api.delete(url.DELETE_PROJECT, { headers: { project } });

// get project details
export const getProjectsDetail = (id: any) =>
  api.get(`${url.GET_PROJECT_DETAIL}/${id}`, { params: { id } });

// dashbaord
//Email Chart
export const getDashboardEmailChart = (chartType: any) => api.get(`${url.GET_DASHBOARD_EMAILCHART}/${chartType}`, { param: chartType });

//latest transaction
export const getTransaction = () => api.get(url.GET_TRANSACTION, null);

// Wallet Balance
export const getWalletBalance = (roomId: any) => api.get(`${url.GET_WALLENT_BALANCE}/${roomId}`, { params: { roomId } });

// Visitors
export const getVisitors = (roomId: any) => api.get(`${url.GET_BLOG_VISITORS}/${roomId}`, { params: { roomId } });

// statistics Applications
export const getStatisticsApplications = (roomId: any) => api.get(`${url.GET_STATISTICS_APPLICATION}/${roomId}`, { params: { roomId } });

// get jobs
export const getJobList = () => api.get(url.GET_JOB_LIST, null);
// delete jobs
export const deleteJobList = (jobs: any) => api.delete(url.DELETE_JOB_LIST, { headers: { jobs } });
// add jobs
export const addNewJobList = (job: any) => api.create(url.ADD_NEW_JOB_LIST, job);

// update jobs
export const updateJobList = (job: any) => api.put(url.UPDATE_JOB_LIST, job);

// get Apply Jobs
export const getApplyJob = () => api.get(url.GET_APPLY_JOB, null);
// Delete Apply Jobs
export const deleteApplyJob = (jobs: any) => api.delete(url.DELETE_APPLY_JOB, { headers: { jobs } });

// get chats
export const getChats = () => api.get(url.GET_CHATS, null);

// // get groups
export const getGroups = () => api.get(url.GET_GROUPS, null);

//grid job
export const getJobGrid = () => api.get(url.GET_JOB_GRID, null);

//job Candidate List
export const getJobCandidateList = () => api.get(url.GET_CANDIDATE0_LIST, null);

