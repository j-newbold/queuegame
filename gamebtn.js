class gameBtn {
    constructor(cLeft, cTop, iconPath, tooltip, fxn = null) {
        this.left = cLeft;
        this.top = cTop;
        this.iconPath = iconPath;
        this.function = fxn;
        tooltipDict[cLeft.toString()+cTop.toString()] = tooltip;

        this.bg = new fabric.Rect({
            left: this.left,
            top: this.top,
            fill: btnColor,
            width: btnWidth,
            height: btnWidth,
            selectable: false,
            hoverCursor: 'default'
        })

        fabric.Image.fromURL(this.iconPath, function(oImg) {
            oImg.scaleToWidth(btnWidth);
            oImg.scaleToHeight(btnWidth);
            oImg.set('left',cLeft);
            oImg.set('top',cTop);
            oImg.on('mousedown', fxn);
            oImg.set('selectable', false);
            canvas.add(oImg);
            canvas.setActiveObject(oImg);
            let x = canvas.getActiveObject();
            canvas.discardActiveObject();
            canvas.requestRenderAll();
        });

        this.img = x;

        canvas.add(this.bg);
    }

}