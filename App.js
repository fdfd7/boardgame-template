import { Client } from "boardgame.io/client";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { resetOnClicks } from "./canvas";
import { TicTacToe } from "./TicTacToe";
//import {drawPicture, onClick} from "./canvas";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const isMultiplayer = import.meta.env.VITE_REMOTE === "true";

const multiplayer = isMultiplayer
  ? SocketIO({ server: "localhost:8000" })
  : Local();

class GameClient {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.createBoard();

    this.client = Client({
      game: TicTacToe,
    });

    this.client.subscribe((state) => this.update(state));
    this.client.start();
    this.attachListeners();
  }

  update(state) {
    resetOnClicks()
    ctx.fillRect(0,0,100,100)
  }
}

const appElement = document.getElementById("app");
const app = new GameClient(appElement);
