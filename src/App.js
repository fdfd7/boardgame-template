import { Client } from "boardgame.io/client";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { drawPicture, resetOnClicks } from "./canvas";
import { TicTacToe } from "./TicTacToe";
import {onClick} from "./canvas";
import {isDraw,isVictory} from "./TicTacToe"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const isMultiplayer = import.meta.env.VITE_REMOTE === "true";

const multiplayer = isMultiplayer
  ? SocketIO({ server: "localhost:8000" })
  : Local();

export class GameClient {
  constructor(rootElement) {
    this.rootElement = rootElement;

    this.client = Client({
      game: TicTacToe,
    });

    this.client.subscribe((state) => this.update(state));
    this.client.start();

  }

  update(state) {
    resetOnClicks()
    ctx.strokeStyle = `rgb(0 0 0)`
    let fieldSize=150
    let edgingDistanceFactor = 0.4
    let radius_1= 100
    ctx.fillStyle = `rgb(197 107 63)`
    ctx.fillRect(0,0,800,800)
    ctx.clearRect(400-1.5*fieldSize,400-1.5*fieldSize,3*fieldSize,3*fieldSize)
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.fillStyle=`rgb(235 217 184)`
    ctx.moveTo(400-(1.5+edgingDistanceFactor)*fieldSize,400+fieldSize)
    ctx.arcTo(400-(1.5+edgingDistanceFactor)*fieldSize,400-(1.5+edgingDistanceFactor)*fieldSize,400+(1.5+edgingDistanceFactor)*fieldSize,400-(1.5+edgingDistanceFactor)*fieldSize,radius_1)
    ctx.arcTo(400+(1.5+edgingDistanceFactor)*fieldSize,400-(1.5+edgingDistanceFactor)*fieldSize,400+(1.5+edgingDistanceFactor)*fieldSize,400+(1.5+edgingDistanceFactor)*fieldSize,radius_1)
    ctx.arcTo(400+(1.5+edgingDistanceFactor)*fieldSize,400+(1.5+edgingDistanceFactor)*fieldSize,400-(1.5+edgingDistanceFactor)*fieldSize,400+(1.5+edgingDistanceFactor)*fieldSize,radius_1)
    ctx.arcTo(400-(1.5+edgingDistanceFactor)*fieldSize,400+(1.5+edgingDistanceFactor)*fieldSize,400-(1.5+edgingDistanceFactor)*fieldSize,400-(1.5+edgingDistanceFactor)*fieldSize,radius_1)
    ctx.lineTo(400-(1.5+edgingDistanceFactor)*fieldSize,400+fieldSize)
    ctx.stroke()
    ctx.fill()
    ctx.lineWidth = 10
    
    for(let j=1; j<=2; j++ ){
      ctx.beginPath()
      ctx.moveTo(400+(j-1.5)*fieldSize,400-1.5*fieldSize)
      ctx.lineTo(400+(j-1.5)*fieldSize,400+1.5*fieldSize)
      ctx.stroke()
    }
    for(let i=1; i<=2; i++ ){
      ctx.beginPath()
      ctx.moveTo(400-1.5*fieldSize,400+(i-1.5)*fieldSize)
      ctx.lineTo(400+1.5*fieldSize,400+(i-1.5)*fieldSize)
      ctx.stroke()
    }
    for(let i=0; i<=2; i++ ){
      for(let j=0; j<=2; j++ ){
        onClick (400+(j-1.5)*fieldSize, 400+(i-1.5)*fieldSize, fieldSize, fieldSize, () => {this.client.moves.clickCell(3*i+j)} ) 
      }
    }

    
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        ctx.lineWidth = 10
        if (state.G.cells[i * 3 + j] == 0) {
          ctx.beginPath()
          ctx.strokeStyle = `rgb(0 0 255)`
          ctx.arc(
            400 - fieldSize + j * fieldSize,
            400 - fieldSize + i * fieldSize,
            0.4 * fieldSize,
            0,
            Math.PI * 2,
            false,
          )
          ctx.stroke()
        }
        if (state.G.cells[i * 3 + j] == 1) {
          ctx.beginPath()
          ctx.strokeStyle = `rgb(255 0 0)`
          ctx.moveTo(
            400 - fieldSize + j * fieldSize - 0.4 * fieldSize,
            400 - fieldSize + i * fieldSize - 0.4 * fieldSize,
          )
          ctx.lineTo(
            400 - fieldSize + j * fieldSize + 0.4 * fieldSize,
            400 - fieldSize + i * fieldSize + 0.4 * fieldSize,
          )
          ctx.moveTo(
            400 - fieldSize + j * fieldSize - 0.4 * fieldSize,
            400 - fieldSize + i * fieldSize + 0.4 * fieldSize,
          )
          ctx.lineTo(
            400 - fieldSize + j * fieldSize + 0.4 * fieldSize,
            400 - fieldSize + i * fieldSize - 0.4 * fieldSize,
          )
          ctx.stroke()
        }
      }
    }
    let winner_=isVictory(state.G.cells)
    let gameEnd = (isDraw(state.G.cells)==true||winner_!=undefined)
    if(gameEnd==true){
      let radius_2= 50
      ctx.beginPath()
      ctx.fillStyle = `rgb(255 255 255 / 95%)`
      ctx.moveTo(50,400)
      ctx.arcTo( 50,400-0.8*fieldSize,750,400-0.8*fieldSize,radius_2)
      ctx.arcTo(750,400-0.8*fieldSize,750,400+0.8*fieldSize,radius_2)
      ctx.arcTo(750,400+0.8*fieldSize,50,400+0.8*fieldSize,radius_2)
      ctx.arcTo( 50,400+0.8*fieldSize,50,400-0.8*fieldSize,radius_2)
      ctx.lineTo(50,400)
      ctx.fill()
      
      ctx.font = "60px sans-serif"
      ctx.textAlign = "center"
      let textYPosition = 420
      if(isDraw(state.G.cells)==true&&winner_==undefined){
        ctx.fillStyle = `rgb(50 50 50)`
        ctx.fillText("Draw!",400,textYPosition)

      }
      if(winner_==0){
        ctx.fillStyle = `rgb(0 0 255)`
        ctx.fillText("Player 1 won the game",400,textYPosition)
      }
      if(winner_==1){
        ctx.fillStyle = `rgb(255 0 0)`
        ctx.fillText("Player 2 won the game",400,textYPosition)
      }
    }
      
  }
}

const appElement = document.getElementById("app");
const app = new GameClient(appElement);
