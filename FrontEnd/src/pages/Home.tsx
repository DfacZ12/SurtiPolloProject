import PortalLayout from "../layout/Portal-layout";

const HomePage =() =>  {

  return (
    <PortalLayout>
     <div className="bg-white p-4 w-full rounded-md">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-slate-900 sm:text-4xl text-3xl font-bold">Build Faster with Tailwind UI</h1>
          <div className="mt-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Create modern, responsive websites in less time. Tailwind CSS gives you the flexibility
              to design unique layouts without writing custom CSS from scratch. Start designing smarter today.
            </p>
          </div>

          <hr className="my-8 border-slate-300" />

          <div className="flex max-sm:flex-col justify-center sm:gap-6 gap-4">
            <button type="button" className="px-5 py-2.5 rounded-md text-white text-sm tracking-wider font-medium border border-blue-600 outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Start Free Trial
            </button>
            <button type="button" className="px-5 py-2.5 rounded-md text-blue-500 text-sm tracking-wider font-medium border border-blue-600 outline-none bg-transparent hover:bg-gray-50 cursor-pointer">
              Browse Templates
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}

export default HomePage;