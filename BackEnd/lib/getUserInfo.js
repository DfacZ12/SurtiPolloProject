const getUserInfo = (ifUs) => {
    return {
        cc: ifUs.Cedula,
        username: ifUs.username,
        role: ifUs.Cargo,
    }
}

export default getUserInfo;