class Area {
    constructor(cLeft, cTop, fill, width, height, sideMargin, topMargin, clickDest, maxProjs) {
        this.left = cLeft;
        this.top = cTop;
        this.fill = fill;
        this.width = width;
        this.height = height;
        this.sideMargin = sideMargin;
        this.topMargin = topMargin;
        this.projectList = [];

        this.clickDest = clickDest;
        this.maxProjs = maxProjs;

        this.nextSlotLeft = this.sideMargin + this.left;
        this.nextSlotTop = this.topMargin + this.top;

        this.shape = new fabric.Rect({
            left: this.left,
            top: this.top,
            fill: this.fill,
            width: this.width,
            height: this.height,
            selectable: false,
            hoverCursor: 'default'
        })

        canvas.add(this.shape);
    }

    addProject(proj) {
        if (this.projectList.length >= this.maxProjs) {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            return false;
        } else {
            var x;
            this.findEmptySlot();
            if (proj != null) {
                proj.moveTo(this.nextSlotLeft, this.nextSlotTop);
                proj.area = this;
                this.projectList.push(proj);
                proj.shape.opacity = 1;
                proj.percComplete.opacity = 1;
                x = proj;
            } else {
                x = new Project(this);
                this.projectList.push(x);
            }

            if (this.clickDest != null) {
                x.shape.selectable = true;
                x.percComplete.selectable = true;
            } else {
                x.shape.selectable = false;
                x.percComplete.selectable = false;
            }
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            return true;
        }
    }

    // this does not run efficiently
    findEmptySlot() {
        var found = false;
        var j = 0;
        var skip = false;
        var sLeft = this.left + this.sideMargin;
        var sTop = this.top + this.topMargin;
        if (this.projectList.length == 0) {
            this.nextSlotLeft = this.left + this.sideMargin;
            this.nextSlotTop = this.top + this.topMargin;
            return;
        }
        while (!found) {
            skip = false;
            j = 0;
            while (!skip && j < this.projectList.length) {
                if (sLeft == this.projectList[j].shape.left && sTop == this.projectList[j].shape.top) {
                    skip = true;
                } else {
                    j++;
                }
            }
            if (!skip) {
                found = true;
            } else {
                sLeft += projWidth + this.sideMargin;
                if (sLeft > this.left + this.width - projWidth - this.sideMargin) {
                    
                    sLeft = this.left + this.sideMargin;
                    sTop += this.topMargin + projWidth;
                }
            }
        }
        this.nextSlotLeft = sLeft;
        this.nextSlotTop = sTop;
    }

    findMostComplete() {
        let tempVar = 0;
        let result = 0;
        for (let i=0;i<this.projectList.length;i++) {
            if (this.projectList[i].percComplete.get('height') >= tempVar) {
                tempVar = this.projectList[i].percComplete.get('height')
                result = i;
            }
        }
        return this.projectList[result];
    }
}