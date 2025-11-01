const getUserInfo = (ifUs) => {
    return {
        cc: ifUs.Cedula,
        username: ifUs.username,
        name: ifUs.Nombre,
        lastname: ifUs.Apellido,
        role: ifUs.Cargo,
    }
}

export default getUserInfo;