export default function Header() {
  return (
  <div className="text-[25px] p-2 text-white flex items-center justify-between">
  <div className="flex items-center gap-2">
    <button className="font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none me-4 group" type="button"
      data-drawer-target="menu-hover" data-drawer-show="menu-hover" data-drawer-body-scrolling="false"
      aria-controls="menu-hover">
      <div slot-icon>
      </div>
    </button>
    <div>
      {/* <h1 className="font-bold">MEC</h1> */}
      {/* <h2>Monitoreos Experiencia Clientes</h2> */}
    </div>
  </div>
  <div className="px-4 fill-white">
  </div>
</div>)
}