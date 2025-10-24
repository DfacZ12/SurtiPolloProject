import { useAuth } from "../auth/AuthProvider";

export default function HomePage() {
  const auth = useAuth();
  console.log("User in HomePage:", auth.getUser());
  return <h1 className="text-2xl font-bold">Bienvenido {auth.getUser()?.username}</h1>
}