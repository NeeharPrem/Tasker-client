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

export const getTasks = async (date:Data) => {
  try {
    const managerId = '66fe5f65081c183e1f163d9f';
    const date = '2024-10-03T00:00:00.000+00:00';
    const data = {date: date}
    const response = await Api.post(`${Endpoints.getTasks}/${managerId}/tasks`,data);
    return response;
  } catch (error) {
    if (error && (error as AxiosError).isAxiosError) {
      console.log(error);
    }
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