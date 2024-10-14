import React from 'react';
import '../App.css';
import '../components/HomePage.css';
import athleticsImage from '../assets/athletics.jpg';
import swimmingImage from '../assets/swimming.jpg';
import gymnasticsImage from '../assets/gymnastics.jpg';

const HomePage = () => {
  return (
    <div>
      <div className="home-container">
        <div className="overlay">
          <h1 className="title_HP">Bienvenue dans le Système de Billetterie Olympique</h1>
          <p>Explorez les offres et obtenez vos billets pour les Jeux Olympiques de 2024 !</p>
        </div>
      </div>

      {/* Section des disciplines sportives */}
      <div className="sports-section">
        <h2>Disciplines Sportives aux JO 2024</h2>

        <div className="sports-container">
          <div className="sport">
            <img src={athleticsImage} alt="Athlétisme" className="sport-image" />
            <div className="sport-description">
              <h3>Athlétisme</h3>
              <p>L'athlétisme est un sport qui inclut la course, le saut et le lancer. C'est l'un des sports les plus anciens des JO.</p>
            </div>
          </div>

          <div className="sport">
            <img src={swimmingImage} alt="Natation" className="sport-image" />
            <div className="sport-description">
              <h3>Natation</h3>
              <p>La natation est un sport aquatique où les athlètes s'affrontent dans diverses épreuves, y compris le crawl et la brasse.</p>
            </div>
          </div>

          <div className="sport">
            <img src={gymnasticsImage} alt="Gymnastique" className="sport-image" />
            <div className="sport-description">
              <h3>Gymnastique</h3>
              <p>La gymnastique combine la force, la flexibilité et la coordination dans une variété de mouvements acrobatiques.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
