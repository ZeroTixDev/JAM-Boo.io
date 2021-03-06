const msgpack = require("msgpack-lite");

function Input(msg, client) {
  if (msg.m == "kd" || msg.m == "ku") {
    const v = msg.m == "kd" ? 1 : 0;
    if(client.alive == true){
      if (msg.k == 87 || msg.k == 'w') {
        client.up = -v;
      }
      if (msg.k == 83 || msg.k == 's') {
        client.down = v;
      }
      if (msg.k == 65 || msg.k == 'a') {
        client.left = -v;
      }
      if (msg.k == 88 || msg.k == 'd') {
        client.right = v;
      }
    }
    if ((msg.k == 32 || msg.k == ' ') && msg.m == "kd") {
      if (client.invis == 0 && client.reload >= 3 && client.alive == true) {
        client.invis = 90 + (client.reload - 3) * 20;
        client.baseinvis = 90 + (client.reload - 3) * 20;
        client.ws.send(msgpack.encode({
          m: "bi",
          i: client.baseinvis
        }));
        client.reload = 0;
      } else if(client.alive == false) {
        client.respawn = true;
      }
    }
  } else if (msg.m == "m" && client.reload > 0 && client.alive == true) {
    const r_x = msg.x - (msg.w / 2) + client.x;
    const r_y = msg.y - (msg.h / 2) + client.y;
    const dir = Math.atan2(r_y - client.y, r_x - client.x);
    if (client.invis > 0) {
      client.invis = -300;
    }
    client.attack(dir);
  }
}

module.exports = Input;