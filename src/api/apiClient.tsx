import Api from "../services/api";
import Endpoints from "../services/endpoints";
import { AxiosError } from "axios";

interface Data {
  managerId?: string;
  employeeId?:string;
  title: string;
  details: string;
  date: string | null;
}

interface dataObject{
  managerId?: string;
  employeeId?: string;
  title: string;
  details: string;
  taskId:string
}

interface getParams {
  managerId?: string;
  employeeId?: string;
  date: string;
  title:string;
  details:string;
}

export const login = async (data: Object) => {
  try {
    const response = await Api.post(Endpoints.login, data);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const logout = async () => {
  try {
    const response = await Api.post(Endpoints.logout);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const register = async (data: Object) => {
  try {
    const response = await Api.post(Endpoints.register, data);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const createTask = async (data: Data) => {
  try {
    const id= data?.managerId
    const response = await Api.post(`${Endpoints.createTask}/${id}`, data);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const assignTask = async (data: Object) => {
  try {
    const response = await Api.post(Endpoints.assignTask, data);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const updateTask = async (data: dataObject) => {
  try {
    const {taskId,managerId} = data
    const response = await Api.put(`${Endpoints.updateTask}/${taskId}/${managerId}`, data);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await Api.delete(`${Endpoints.deleteTask}/${taskId}`);
    console.log(response);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const getTasks = async ({ managerId, employeeId, date }: getParams): Promise<any> => {
  try {
    const requestData = { date };
    const idToUse = managerId ? managerId : employeeId;
    if (!idToUse) {
      throw new Error('Either managerId or employeeId must be provided');
    }
    const response = await Api.post(`${Endpoints.getTasks}/${idToUse}/tasks`, requestData);
    return response.data;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
    throw error;
  }
};


export const getTaskDetails = async (taskId:string) => {
  try {
    const response = await Api.get(`${Endpoints.getTaskDetails}/${taskId}`);
    return response.data;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};

export const getEmployees = async (managerId: string) => {
  try {
    const response = await Api.get(`${Endpoints.getEmployees}/${managerId}`);
    return response.data;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
  }
};