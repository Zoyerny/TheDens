import Image from "next/image";

export interface User {
  id: string;
  username: string;
}

export default function UsersListHome() {

  return (
    <div id="connectedUsers">
      <ul>
        <li>
          <Image src="/svg/OpenNav.svg" width={38} height={25} alt="Open Nav" />
          <div className="contentUser">
            <h3 className="NameUser">Allan</h3>
            <h4 className="subUser">Mora - Dessin</h4>
            <div className="line"></div>
          </div>
        </li>

      </ul>
    </div>
  );
}
