// "use server";
import { getCookie, deleteCookie, setCookie } from "@/lib/cookies";
import { PageQuery } from "@/types/page";
import { Project } from "@/types/project";
import axios from "axios";
import { toast } from "sonner";
// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Flag to prevent multiple refresh requests simultaneously
let isRefreshing = false;
let failedQueue: any = [];

// Helper to process the queue after a refresh
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((promise: any) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Create an axios instance for authentication
export const api = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for the API
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in the header
api.interceptors.request.use(
  (config) => {
    const token = getCookie("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Add an interceptor to handle 401 errors
// api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("401 Unauthorized error occurred. Logging out...");
//       toast.error(error.response?.data?.message);
//       // Clear cookies and redirect to login
//       deleteCookie("auth_token");
//     }
//     if (error.code === "ERR_NETWORK") {
//       toast.warning(error.message);
//     }
//     return Promise.reject(error); // Reject other errors
//   }
// );

// Add an interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data }: any = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`, // Refresh token endpoint
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("refresh_token")}`,
              },
            }
          );

          const newAccessToken = data.token;

          // Set the new access token in headers for future requests
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // Retry the failed requests
          processQueue(null, newAccessToken);
          setCookie("auth_token", newAccessToken);

          return api(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure
          console.log("Refresh token failed. Logging out...");
          toast.error("Session expired. Please log in again.");

          deleteCookie("auth_token"); // Clear cookies
          window.location.href = "/"; // Redirect to login page

          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue failed requests while refreshing
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      toast.warning(error.message);
    }

    return Promise.reject(error); // Reject other errors
  }
);

// Authentication-related API functions
export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    console.log("Login failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const profile = async () => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error: any) {
    console.log("Profile retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const addMember = async (data: {
  email: string;
  name: string;
  role: string;
}) => {
  try {
    const response = await api.post("/user/add-member", data);
    return response.data;
  } catch (error: any) {
    console.log("Add member failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const addMemberBulk = async (data: any) => {
  try {
    const response = await api.post("/user/add-member-bulk", data);
    return response.data;
  } catch (error: any) {
    console.log("Add member failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const memberList = async (query?: PageQuery) => {
  if (!query) query = { limit: 10, offset: 0 }; // Default query parameters
  try {
    const response = await api.get("/user/members", {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("memberList retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const showMemberPassword = async (id: string) => {
  if (!id) return false;
  try {
    const response = await api.get(`/user/show-password/${id}`);
    return response.data;
  } catch (error: any) {
    console.log("showMemberPassword failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const updateMember = async (id: string, data: any) => {
  if (!id) return false;
  try {
    const response = await api.patch(`/user/members/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.log("showMemberPassword failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const deleteMember = async (ids: string) => {
  if (!ids) return false;
  try {
    const response = await api.delete(`/user/members?ids=${ids}`);
    return response.data;
  } catch (error: any) {
    console.log("deleteMember failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const dashboardOverview = async () => {
  try {
    const response = await api.get("dashboard/overview");
    return response.data;
  } catch (error: any) {
    console.log("dashboardOverview failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const addProjectApi = async (
  project: Partial<Project>
): Promise<Project> => {
  try {
    const response = await api.post("/projects", project);
    return response.data;
  } catch (error: any) {
    console.log("addProject failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const projectList = async (query?: PageQuery) => {
  if (!query) query = { limit: 12, offset: 0 }; // Default query parameters
  try {
    const response = await api.get("/projects", {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("projectList retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const addProjectMemberApi = async (id: string, data: any) => {
  try {
    const response = await api.post(`/projects/members/`, {
      members: data,
      projectId: id,
    });
    return response.data;
  } catch (error: any) {
    console.log("addProjectMemberApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const addTaskApi = async (data: any) => {
  try {
    const response = await api.post(`/projects/tasks/`, data);
    return response.data;
  } catch (error: any) {
    console.log("addTaskApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const TaskListApi = async (id: string, query?: PageQuery) => {
  if (!query) query = { limit: 12, offset: 0 }; // Default query parameters
  try {
    const response = await api.get(`/projects/${id}/tasks`, {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("TaskListApi retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const updateTaskApi = async (id: string, data: any) => {
  if (!id) return false;
  try {
    const response = await api.put(`/projects/${id}/tasks`, data);
    return response.data;
  } catch (error: any) {
    console.log("updateTask failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const projectMemberList = async (query?: PageQuery) => {
  if (!query) query = { limit: 10, offset: 0 }; // Default query parameters
  try {
    const response = await api.get("/projects/members/list", {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("memberList retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const taskDetailApi = async (id: string) => {
  if (!id) return false;
  try {
    const response = await api.get(`/projects/tasks/${id}`);
    return response.data;
  } catch (error: any) {
    console.log("taskDetailApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const labelList = async (query?: PageQuery) => {
  if (!query) query = { limit: 10, offset: 0 }; // Default query parameters
  try {
    const response = await api.get("/projects/labels/list", {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("labelList retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const activityListApi = async (id: string, query?: PageQuery) => {
  if (!query) query = { limit: 10, offset: 0 }; // Default query parameters
  try {
    const response = await api.get(`/projects/activity/${id}`, {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("labelList retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const addCommentApi = async (data: any) => {
  try {
    const response = await api.post(`/projects/comments/add`, data);
    return response.data;
  } catch (error: any) {
    console.log("addCommentApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const commentListApi = async (id: string, query?: PageQuery) => {
  if (!query) query = { limit: 10, offset: 0 }; // Default query parameters
  try {
    const response = await api.get(`/projects/comments/${id}`, {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    console.log("labelList retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const commentUpdateApi = async (id: string, data?: any) => {
  try {
    const response = await api.put(`/projects/comments/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.log("commentUpdateApi retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const commentDeleteApi = async (id: string) => {
  try {
    const response = await api.delete(`/projects/comments/${id}`);
    return response.data;
  } catch (error: any) {
    console.log("commentDeleteApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const addReactionApi = async (data: any) => {
  try {
    const response = await api.post(`/projects/comments/reaction`, data);
    return response.data;
  } catch (error: any) {
    console.log("addCommentApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const reactionListApi = async (id: string, query?: PageQuery) => {
  if (!query) query = { limit: 10, offset: 0 }; // Default query parameters
  try {
    const response = await api.get(`/projects/comments/reaction/${id}`, {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    // console.log("labelList retrieval failed:", error);
    // throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const projectOverviewApi = async () => {
  try {
    const response = await api.get(`/dashboard/overview/project`);
    return response.data;
  } catch (error: any) {
    console.log("projectOverview retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const recentTasksApi = async () => {
  try {
    const response = await api.get(`/dashboard/overview/task`);
    return response.data;
  } catch (error: any) {
    console.log("recentTasks retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const recentMembersApi = async () => {
  try {
    const response = await api.get(`/dashboard/overview/member`);
    return response.data;
  } catch (error: any) {
    console.log("recentMembers retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const recentActivityApi = async () => {
  try {
    const response = await api.get(`/dashboard/overview/activity`);
    return response.data;
  } catch (error: any) {
    console.log("recentActivity retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
export const dashboardChartDataApi = async () => {
  try {
    const response = await api.get(`/dashboard/overview/chart`, {
      params: {
        // projectId: "67a844e4cde143f8458fe3e5",
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("dashboardChartData retrieval failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};

export const updateUserApi = async (data: any) => {
  try {
    const { email, ...values } = data;
    const response = await api.patch(`/user/profile`, values);
    return response.data;
  } catch (error: any) {
    console.log("updateUserApi failed:", error);
    throw new Error(error?.response?.data.message || "Internal issue");
  }
};
