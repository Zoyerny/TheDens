import React, { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav>
      <button id="ButtonMobile" onClick={handleToggle}>
        {isOpen ? (
          <img src="./svg/OpenNav.svg" width="38" height="25" alt="Open Nav" />
        ) : (
          <img
            src="./svg/CloseNav.svg"
            width="38"
            height="25"
            alt="Close Nav"
          />
        )}
      </button>

      {isOpen && (
        <div id="navModal">
          <div className="modal-content">
            <p>Contenu de la modal...</p>
          </div>
        </div>
      )}
    </nav>
  );
}
