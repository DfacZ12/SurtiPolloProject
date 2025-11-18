import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">¡Ups! Parece que te perdiste.</p>
      <p className="not-found-description">La página que estás buscando no existe o se ha movido.</p>
      <Link to="/" className="not-found-button">
        Volver a la página de inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;