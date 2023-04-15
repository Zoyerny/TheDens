import Image from "next/image";
import React, { useState } from "react";
import NavSettings from "./NavSettings";

export default function NavMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <button id="ButtonMobile" onClick={handleToggle}>
        {isOpen ? (
          <Image src="/svg/OpenNav.svg" width={38} height={25} alt="Open Nav" />
        ) : (
          <Image
            src="/svg/CloseNav.svg"
            width={38}
            height={25}
            alt="Close Nav"
          />
        )}
      </button>

      {isOpen && (
        <div id="navModal">
          <div className="modal-content">
            <p>Contenu de la modal...</p>
          </div>
          <NavSettings />
        </div>
      )}
    </>
  );
}
