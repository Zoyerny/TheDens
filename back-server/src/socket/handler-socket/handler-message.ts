import { Socket } from 'socket.io';
import { ClientToServerId, ServerToClientId } from '../socket.enums';
import { SendSocketGateway } from '../send-socket';
import { AuthService } from 'src/auth/auth.service';

export const handleUpdateConnected = async (client: Socket, data: any, sendSocketGateway: SendSocketGateway, authService: AuthService) => {
    // Récupérer la liste des utilisateurs connectés
    const connectedUsers = await authService.getUsers();


    // Envoyer la liste des utilisateurs connectés au client
    sendSocketGateway.sendToAll(ServerToClientId.CONNECTED_USERS_LIST, connectedUsers);
};

// ... ajout des fonctions pour les autres types de messages

export const messageHandlers: { [key: string]: (client: Socket, data?: any, sendSocketGateway?: SendSocketGateway, authService?: AuthService) => Promise<void> } = {
    [ClientToServerId.GET_CONNECTED_USERS]: handleUpdateConnected,
    // ... ajout les autres fonctions ici
};

