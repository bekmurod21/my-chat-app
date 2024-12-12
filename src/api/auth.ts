import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from ".";

export async function register(name: string, email: string, password: string) {
    const res = await fetch('https://localhost:7228/api/auths/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    if(!res.ok) throw new Error('Register failed');
    return await res.json();
  }
  
  export async function login(email: string, password: string) {
    const res = await fetch('https://localhost:7228/api/auths/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = res.formData;
    console.log(data,"data")
    return data; // json { token: string, userId: string }
  }

    const signi = async (data: { phoneNumber: string; password: string }) => {
      const response = await api.post("/admin/auth/sign-in", data);
      return response.data;
    };
    export const useSignIn = () => {
      return useMutation({
        mutationFn: (data: { phoneNumber: string; password: string }) =>
          signi(data),
      });
    };