const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let dws;
let pl_c = false;

const keys = [];
let enemies = [];
let candies = [];
let names = [];
let scores = [];
let lb = [];
let player = {};
let nickname;

function main(ws) {
  ws.onopen = function() {
    dws = ws;
    const payLoad = {
      m: "j",
      n: document.getElementById("nickname").value
    };
    ws.send(msgpack.encode(payLoad));
  }
  ws.onerror = function() {
    error("Connection error, please reload");
  }
  ws.onmessage = e => {
    try {
      const msg = msgpack.decode(new Uint8Array(e.data));
      if (msg.m == "j"){
        nickname = msg.n;
        for(let n in msg.s){
          names.push({
            n: msg.s[n],
            id: msg.i[n]
          });
        }
        candies = msg.c;
        joinGame();
      }
      if(pl_c==true){
        processMsg(msg);
      }
    } catch (err) {
      error(err);
    }
  }
}

const processMsg = msg => {
  if(msg.m=="u"){
    player.x = msg.p.x;
    player.y = msg.p.y;
    enemies = msg.e;
    if(msg.p.s!=undefined){
      lb = [];
      for(let e in enemies){
        lb.push({
          score: enemies[e].s,
          name: names[e].n,
          isClient: false
        })
      }
      lb.push({
        score: msg.p.s,
        name: nickname,
        isClient: true
      })
      lb.sort((a, b)=>b.score-a.score);
      console.log(JSON.stringify(lb));
    }
  } else if(msg.m=="n"){
    names.push({
      n: msg.n,
      id: msg.i
    });
  } else if(msg.m=="rn"){
    names.splice(names.indexOf(names.find(n=>n.id==msg.i)), 1);
  } else if(msg.m=="rc"){
    candies.splice(msg.i, 1);
  } else if(msg.m=="c"){
    candies.push({
      x: msg.x,
      y: msg.y
    });
  }
}