import { useState } from "react";
import MainLayout from "../layout/Main-layout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/consts";
import type { AuthResponse, AuthResponseError } from "../interfaces/types";
import Alert from "../shared/Alert";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const auth = useAuth();
  const goTo = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      if (response.status === 201) {
        console.log("Login successful");
        setErrorResponse("");
        const json = response.data as AuthResponse;
        if(json.body.accessToken && json.body.refreshToken){
          auth.saveUser(json);
          console.log(json)
          goTo("/Home");
        }
      }
    } catch (error) {
     if (axios.isAxiosError(error)) {
      console.log("Axios error:", error.response?.data.body.error || error.message);
      const json = (await error.response?.data) as AuthResponseError;
      setErrorResponse(json.body.error || error.message);
     }
    }

    if (auth.isAuth) return <Navigate to="/Home" />;
  };
  return (
    <MainLayout>
      {/* <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="py-6 px-4">
          <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
            <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="mb-9">
                  <h1 className="text-slate-900 text-3xl font-semibold">
                    Inicia Sesión
                  </h1>
                  <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                    Ingresa tus datos para acceder a las diferentes
                    funcionalidades del sistema.
                  </p>
                </div>
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Nombre de Usuario
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="username"
                      type="text"
                      value={username}
                      className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="..."
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      value={password}
                      className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="***"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm text-slate-900"
                    >
                      Recordar mis datos
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="jajvascript:void(0);"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                <div className="!mt-12">
                  <button className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
                    Ingresar
                  </button>
                </div>
                {!!errorResponse && (
                  <Alert
                    title={"Error!"}
                    message={errorResponse}
                    type={"error"}
                  />
                )}
              </form>
            </div>
            <div className="max-lg:mt-8">
              <img
                src="https://readymadeui.com/login-image.webp"
                className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto block object-cover"
                alt="login img"
              />
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-white min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full border border-gray-300 p-8 rounded-xl bg-gray-200">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" className="inline-block" viewBox="0 0 53 53">
            <path fill="#e7eced" d="m18.613 41.552-7.907 4.313a7.106 7.106 0 0 0-1.269.903A26.377 26.377 0 0 0 26.5 53c6.454 0 12.367-2.31 16.964-6.144a7.015 7.015 0 0 0-1.394-.934l-8.467-4.233a3.229 3.229 0 0 1-1.785-2.888v-3.322c.238-.271.51-.619.801-1.03a19.482 19.482 0 0 0 2.632-5.304c1.086-.335 1.886-1.338 1.886-2.53v-3.546c0-.78-.347-1.477-.886-1.965v-5.126s1.053-7.977-9.75-7.977-9.75 7.977-9.75 7.977v5.126a2.644 2.644 0 0 0-.886 1.965v3.546c0 .934.491 1.756 1.226 2.231.886 3.857 3.206 6.633 3.206 6.633v3.24a3.232 3.232 0 0 1-1.684 2.833z" data-original="#e7eced" />
            <path fill="#556080" d="M26.953.004C12.32-.246.254 11.414.004 26.047-.138 34.344 3.56 41.801 9.448 46.76a7.041 7.041 0 0 1 1.257-.894l7.907-4.313a3.23 3.23 0 0 0 1.683-2.835v-3.24s-2.321-2.776-3.206-6.633a2.66 2.66 0 0 1-1.226-2.231v-3.546c0-.78.347-1.477.886-1.965v-5.126S15.696 8 26.499 8s9.75 7.977 9.75 7.977v5.126c.54.488.886 1.185.886 1.965v3.546c0 1.192-.8 2.195-1.886 2.53a19.482 19.482 0 0 1-2.632 5.304c-.291.411-.563.759-.801 1.03V38.8c0 1.223.691 2.342 1.785 2.888l8.467 4.233a7.05 7.05 0 0 1 1.39.932c5.71-4.762 9.399-11.882 9.536-19.9C53.246 12.32 41.587.254 26.953.004z" data-original="#556080" />
          </svg>
        </div>

        <form className="mt-12 space-y-4" onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <input
            name="email"
            type="text"
            className="w-full text-sm text-slate-900 bg-white border-2 border-transparent focus:border-[#1E2772] pl-4 pr-8 py-3 rounded-md outline-none"
            placeholder="Ingresar Nombre de Usuario"
            onChange={(e) => setUsername(e.target.value)} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
              <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
              <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
            </svg>
          </div>
          <div className="relative flex items-center">
            <input
            name="password"
            type="password"
            className="w-full text-sm text-slate-900 bg-white border-2 border-transparent focus:border-[#1E2772] pl-4 pr-8 py-3 rounded-md outline-none"
            placeholder="Ingresar Contraseña"
            onChange={(e) => setPassword(e.target.value)}
             />
            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
              <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
            </svg>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 !mt-4">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-transparent rounded-md" />
              <label className="ml-3 block text-sm text-slate-600">
                Recordarme
              </label>
            </div>
            <div>
              <a href="jajvascript:void(0);" className="text-sm font-medium text-[#1E2772] hover:underline">
                Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div className="!mt-12">
            <button className="w-full py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-[#1E2772] hover:bg-[#1e4272] focus:outline-none cursor-pointer">
              Ingresar
            </button>
          </div>
          {!!errorResponse && (
                  <Alert
                    title={"Error!"}
                    message={errorResponse}
                    type={"error"}
                  />
                )}
        </form>
      </div>
    </div>
    </MainLayout>
  );
}

export default Login;