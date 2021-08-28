import './Navbar.css';

function Navbar() {
  return (
      <div className="Navbar">
        <a href="/">
          <img className="logo_navbar" src="Logo_Banque_de_France.png" alt=""></img>
        </a>
        <a href="/curency_converter">
            <div className='login_button'>Convertion de monnaie</div>
        </a>
        <div className="log_button">
          <a href="/login">
            <div className='login_button'>Connexion</div>
          </a>
          <a href="/register">
            <div className='register_button'>S'inscrire</div>
          </a>
        </div>
      </div>
  );
}

export default Navbar;
