import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateUsers = () => {
  return (
    <>
      <h1 className="text-3xl font-bold">
        <span>
          <FontAwesomeIcon icon={faUser} className="w-[18px] h-[18px] mr-2" />
          Creación de Usuarios
        </span>
      </h1>
      <div className="flex items-center justify-center mt-12">
        <div className="w-full border p-8 rounded-xl">
          <form>
            <div className="mb-4">
              <label
                htmlFor="inptCC"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Número de Cédula
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                name="cedula"
                onInput={(e) =>
                  (e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    ""
                  ))
                }
                id="inptCC"
                placeholder="Cédula"
                className="w-[350px] xl:w-[550px] rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Full Name"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Enter your phone number"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Dirección de correo electrónico
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-[420px] rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="inptPhone"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Telefono Fijo
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    onInput={(e) =>
                      (e.currentTarget.value = e.currentTarget.value.replace(
                        /\D/g,
                        ""
                      ))
                    }
                    name="phone"
                    id="inptPhone"
                    placeholder="****"
                    className="w-[350px] rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="inptCel"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Celular
                  </label>
                  <input
                    name="celphone"
                    id="inptCel"
                    maxLength={10}
                    onInput={(e) =>
                      (e.currentTarget.value = e.currentTarget.value.replace(
                        /\D/g,
                        ""
                      ))
                    }
                    placeholder="321 XXXXXXX"
                    className="w-[350px] rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="inptEps"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    EPS
                  </label>
                  <select
                    name="eps"
                    id="inptEps"
                    className="w-[350px] xl:w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    <option value="" selected>
                      Seleccione una Opción
                    </option>
                    <option value="Sanitas">Sanitas</option>
                  </select>
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Cargo
                  </label>
                  <select
                    name="date"
                    id="date"
                    className="w-[250px] lg:w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    <option value="" selected>
                      Seleccione una Opción
                    </option>
                    <option value="Sanitas">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="inptUsername"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nombre de usuario
              </label>
              <input
                name="usermame"
                id="inptUsername"
                placeholder="@@@@@"
                className="w-[350px] xl:w-[500px] rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div>
              <button className="hover:shadow-form w-full rounded-md bg-[#d9f3ea] py-2 px-8 text-center text-base font-semibold text-black outline-none cursor-pointer">
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUsers;
