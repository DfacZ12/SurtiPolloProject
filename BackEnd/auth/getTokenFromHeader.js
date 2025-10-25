const getTokenFromHeader = (header) => {
  // console.log("Headers recibidos en getTokenFromHeader:", header.authorization);
  if (!header && !header.authorization)return null;
  const token = header.authorization.split(" ")[1];
  if (token.lenth < 2)return null;
  return token;
};

export default getTokenFromHeader;
