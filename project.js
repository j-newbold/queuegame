class Project {
    constructor(ar) {
        this.area = ar;
        if (this.area.clickDest == null) {
            this.selectable = 'false';
        } else {
            this.selectable = 'true';
        }
        this.tick = 0;
        this.shape = new fabric.Rect({
            left: this.area.nextSlotLeft,
            top: this.area.nextSlotTop,
            fill: 'green',
            width: projWidth,
            height: projWidth,
            cornerStyle: 'circle',
            rx: 2,
            ry: 2,
            hoverCursor: 'default'
        });
        this.percComplete = new fabric.Rect({
            left: this.area.nextSlotLeft,
            top: this.area.nextSlotTop,
            fill: 'black',
            width: projWidth,
            height: 0,
            cornerStyle: 'circle',
            rx: 2,
            ry: 2,
            hoverCursor: 'default'
        });
        let tempVar = this;
        this.shape.on('selected', this.changeArea.bind(tempVar));
        this.percComplete.on('selected', this.changeArea.bind(tempVar));
        canvas.add(this.shape);
        canvas.add(this.percComplete);
    }

    changeArea(proj) {
        if (this.area.clickDest != null) {
            let index = this.area.projectList.indexOf(this);
            this.area.projectList.splice(index, 1)[0];
            this.area.clickDest.addProject(this);
        } else {
            console.log("object selection error: object should not be selectable");
        }
    }

    moveTo(left, top) {
        this.shape.set('left', left);
        this.shape.set('top', top);
        this.shape.setCoords();
        this.percComplete.set('left', left);
        this.percComplete.set('top', top);
        this.percComplete.setCoords();
        canvas.renderAll();
    }
}