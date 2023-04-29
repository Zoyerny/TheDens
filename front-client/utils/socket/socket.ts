import { io, Socket } from "socket.io-client";

class SocketConnection {
    private socket: Socket | null = null;

    constructor(private userId: string, private accessToken: string, private refreshToken: string) {
        this.userId = userId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.createSocketConnection();
    }

    private createSocketConnection() {
        console.log("creation du socket !! : ")
        if (!this.accessToken) {
            throw new Error("Token is required to create a socket connection.");
        }
        console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
        this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
            query: {
                token: this.accessToken,
                refreshToken: this.refreshToken,
                userId: this.userId,
            },
        });
    }

    updateTokens(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        if (this.socket) {
            this.socket.io.opts.query = {
                token: this.accessToken,
                refreshToken: this.refreshToken,
                userId: this.userId,
            };
        }
    }

    getSocket() {
        return this.socket;
    }
}

export default SocketConnection;
