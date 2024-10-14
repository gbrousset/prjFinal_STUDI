const OfferCard = ({ offer, isSelected, toggleOfferSelection }) => {
    const cardStyle = {
        backgroundColor: isSelected ? '#d1ffd1' : '#ffffff', 
        border: '1px solid #ccc',
        padding: '20px',
        margin: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const handleCardClick = () => {
        if (offer.quantity_total > 0) {
            toggleOfferSelection(offer);
        }
    };

    return (
        <div
            className="offer-card"
            style={cardStyle}
            onClick={handleCardClick}
        >
            <h3>{offer.offer_name}</h3>
            <p>{offer.description}</p>
            <p>Prix : {offer.price} €</p>
            <p>Disponibilité : {offer.quantity_total} disponibles</p>
            {offer.quantity_total === 0 && (
                <p style={{ color: 'red' }}>Cette offre n'est plus disponible.</p>
            )}
        </div>
    );
};

export default OfferCard;
