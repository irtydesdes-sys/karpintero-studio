/* Motor REAL de optimización de corte (shelf packing) — ver karpintero_build.js */
(function (global) {
  function optimizarCorte(piezas, tableroLargo, tableroAncho, kerf) {
    kerf = kerf || 3.2;
    var items = piezas.map(function (p) {
      return { id: p.id, descripcion: p.descripcion, w: p.largo_mm, h: p.ancho_mm };
    }).sort(function (a, b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); });

    var boards = [];
    function newBoard() { return { w: tableroLargo, h: tableroAncho, shelves: [], usedArea: 0 }; }

    items.forEach(function (item) {
      var placed = false;
      for (var bi = 0; bi < boards.length && !placed; bi++) {
        var board = boards[bi];
        for (var si = 0; si < board.shelves.length && !placed; si++) {
          var shelf = board.shelves[si];
          if (item.h <= shelf.h && (shelf.usedW + item.w + kerf) <= board.w) {
            shelf.pieces.push(Object.assign({ x: shelf.usedW, y: shelf.y }, item));
            shelf.usedW += item.w + kerf;
            board.usedArea += item.w * item.h;
            placed = true;
          }
        }
        if (!placed) {
          var usedH = board.shelves.reduce(function (s, sh) { return s + sh.h + kerf; }, 0);
          if (usedH + item.h <= board.h) {
            var ns = { y: usedH, h: item.h, usedW: item.w + kerf, pieces: [Object.assign({ x: 0, y: usedH }, item)] };
            board.shelves.push(ns);
            board.usedArea += item.w * item.h;
            placed = true;
          }
        }
      }
      if (!placed) {
        var nb = newBoard();
        nb.shelves.push({ y: 0, h: item.h, usedW: item.w + kerf, pieces: [Object.assign({ x: 0, y: 0 }, item)] });
        nb.usedArea = item.w * item.h;
        boards.push(nb);
      }
    });

    var totalBoardArea = boards.length * tableroLargo * tableroAncho;
    var totalUsed = boards.reduce(function (s, b) { return s + b.usedArea; }, 0);
    var desperdicioPct = totalBoardArea > 0 ? (1 - totalUsed / totalBoardArea) * 100 : 0;
    return { boards: boards, tablerosNecesarios: boards.length, desperdicioPct: desperdicioPct };
  }
  global.KarpinteroOptimizer = { optimizarCorte: optimizarCorte };
})(window);
