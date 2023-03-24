const fcanvas = new fabric.Canvas(document.querySelector('#fCanvas'), {
  width: 100,
  height: 100,
});
fcanvas.loadFromJSON(
  {
    version: '3.6.6',
    objects: [],
    selectionColor: 'rgba(100, 100, 255, 0.3)',
    hoverCursor: 'move',
  },
  () => {
    console.log(fcanvas);
    fcanvas.renderAll.bind(fcanvas);
  }
);
