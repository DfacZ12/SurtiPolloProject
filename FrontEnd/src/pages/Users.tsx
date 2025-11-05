const Users = ()=> {

  return (
<div className="flex items-center justify-center p-12">
    <div className="w-full border max-w-md bg-gray-200 border-gray-200 p-8 rounded-xl" >
        <form>
          <div className="mb-5">
                <label htmlFor="cedula" className="mb-3 block text-base font-medium text-[#07074D]">
                    Número de Cédula
                </label>
                <input  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={11} name="cedula" id="inptCC" placeholder="Cédula" className="w-full text-sm text-slate-900 bg-white border-2 border-transparent focus:border-[#1E2772] pl-4 pr-8 py-3 rounded-md outline-none" />
            </div>
            <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                      <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                          Nombre
                      </label>
                      <input type="text" name="name" id="name" placeholder="Full Name"
                          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                        <label htmlFor="phone" className="mb-3 block text-base font-medium text-[#07074D]">
                            Apellido
                        </label>
                        <input type="text" name="phone" id="phone" placeholder="Enter your phone number"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                    </div>
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
                    Dirección de correo electrónico
                </label>
                <input type="email" name="email" id="email" placeholder="Enter your email"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
            </div>
            <div className="mb-5">
                <label htmlFor="date" className="mb-3 block text-base font-medium text-[#07074D]">
                    EPS
                </label>
                <select name="date" id="date"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white p-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">
                  <option value="" selected>Seleccione una Opción</option>
                  <option value="Sanitas">Sanitas</option>
                </select>
            </div>
            <div className="mb-5">
                <label htmlFor="time" className="mb-3 block text-base font-medium text-[#07074D]">
                    Time
                </label>
                <input type="time" name="time" id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
            </div>
            <div className="mb-5 pt-3">
                <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                    Address Details
                </label>
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="area" id="area" placeholder="Enter area"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="city" id="city" placeholder="Enter city"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="state" id="state" placeholder="Enter state"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <input type="text" name="post-code" id="post-code" placeholder="Post Code"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button
                    className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                    Book Appointment
                </button>
            </div>
        </form>
    </div>
</div>
  )
}

export default Users;