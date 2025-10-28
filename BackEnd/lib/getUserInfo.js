const getUserInfo = (ifUs) => {
    return {
        cc: ifUs.Cedula,
        username: ifUs.username,
        name: ifUs.Nombre,
        role: ifUs.Cargo,
    }
}

export default getUserInfo;