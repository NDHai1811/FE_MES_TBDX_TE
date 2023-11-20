//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";

// Calendar
export const GET_EVENTS = "/events";
export const GET_CATEGORIES = "/events/categories";
export const GET_UPCOMMINGEVENT = "/upcommingevents";
export const ADD_NEW_EVENT = "/events/add";
export const UPDATE_EVENT = "/events/update";
export const DELETE_EVENT = "/events/delete";
export const DELETE_REPEAT_EVENTS = "/events/delete/repeat";

// Chat
export const GET_DIRECT_CONTACT = "/private-chat";
export const GET_MESSAGES = "/chat";
export const ADD_MESSAGE = "/messages/store";
export const GET_CHANNELS = "/group-chat";

//Mailbox
export const GET_MAIL_DETAILS = "/mail";
export const DELETE_MAIL = "/delete/mail";

// Ecommerce
// Product
export const GET_PRODUCTS = "/apps/product";
export const DELETE_PRODUCT = "/apps/product";

// Orders
export const GET_ORDERS = "/apps/order";
export const ADD_NEW_ORDER = "/apps/order";
export const UPDATE_ORDER = "/apps/order";
export const DELETE_ORDER = "/apps/order";

// Customers
export const GET_CUSTOMERS = "/apps/customer";
export const ADD_NEW_CUSTOMER = "/apps/customer";
export const UPDATE_CUSTOMER = "/apps/customer";
export const DELETE_CUSTOMER = "/apps/customer";

// Sellers
export const GET_SELLERS = "/sellers";

// Project list
export const GET_PROJECT_LIST = "/project/list";

// Task
export const GET_TASK_LIST = "/task/list";
export const ADD_NEW_TASK = "/apps/task";
export const UPDATE_TASK = "/apps/task";
export const DELETE_TASK = "/apps/task";

// CRM
// Conatct
export const GET_CONTACTS = "/apps/contact";
export const ADD_NEW_CONTACT = "/apps/contact";
export const UPDATE_CONTACT = "/apps/contact";
export const DELETE_CONTACT = "/apps/contact";

// Companies
export const GET_COMPANIES = "/company";
export const ADD_NEW_COMPANIES = "/company/add";
export const UPDATE_COMPANIES = "/company/update";
export const DELETE_COMPANIES = "/company/delete";

// Lead
export const GET_LEADS = "/apps/lead";
export const ADD_NEW_LEAD = "/apps/lead";
export const UPDATE_LEAD = "/apps/lead";
export const DELETE_LEAD = "/apps/lead";

// Deals
export const GET_DEALS = "/deals";

// Crypto
export const GET_TRANSACTION_LIST = "/transaction-list";
export const GET_ORDRER_LIST = "/order-list";

// Invoice
export const GET_INVOICES = "/apps/invoice";
export const ADD_NEW_INVOICE = "/apps/invoice";
export const UPDATE_INVOICE = "/apps/invoice";
export const DELETE_INVOICE = "/apps/invoice";

// TicketsList
export const GET_TICKETS_LIST = "/apps/ticket";
export const ADD_NEW_TICKET = "/apps/ticket";
export const UPDATE_TICKET = "/apps/ticket";
export const DELETE_TICKET = "/apps/ticket";

//Machine
export const GET_MACHINE_LIST = "/machine/index";
export const ADD_NEW_MACHINE = "/machine/store";
export const UPDATE_MACHINE = "/machine/update";
export const DELETE_MACHINE = "/machine/destroy";

//Machine Category
export const GET_MACHINE_CATEGORY_LIST = "/machine/machine_category/index";
export const ADD_NEW_MACHINE_CATEGORY = "/machine/machine_category/store";
export const UPDATE_MACHINE_CATEGORY = "/machine/machine_category/update";
export const DELETE_MACHINE_CATEGORY = "/machine/machine_category/destroy";

//Machine Type
export const GET_MACHINE_TYPE_LIST = "/machine/machine_type/index";
export const ADD_NEW_MACHINE_TYPE = "/machine/machine_type/store";
export const UPDATE_MACHINE_TYPE = "/machine/machine_type/update";
export const DELETE_MACHINE_TYPE = "/machine/machine_type/destroy";

//Library
export const GET_FOLDERS_MAP = "/library/index";
export const ADD_NEW_FOLDER = "/library/createNewFolder";
export const UPLOAD_FILES = "/library/uploadToLibrary";
export const DELETE_FILES = "/library/deleteFiles";
export const MOVE_FILES = "/library/moveFiles";
//Timekeeping
export const GET_TIMEKEEPING_LIST = "/timekeeping/index";

//Timekeeping
export const GET_USER_LIST = "/user/index";
export const ADD_NEW_USER = "/user/store";
export const UPDATE_USER = "/user/update";
export const DELETE_USER = "/user/destroy";

//Config
export const GET_ALL_CONFIGURATION = "/config/index";
export const UPDATE_CONFIG = "/config/update";

//Users
export const GET_ALL_USERS = "/users";

//Role
export const GET_ROLE_LIST = "/role/index";
export const ADD_NEW_ROLE = "/role/store";
export const UPDATE_ROLE = "/role/update";
export const DELETE_ROLE = "/role/destroy";

export const DELETE_FILE = "/delete_file";
export const GET_ALL_EQUIPMENTS = "/equipments";

export const GET_NOTIFICATION_LIST = "/notification/all";

export const GET_MESSAGES_LIST = "/messages/list";
