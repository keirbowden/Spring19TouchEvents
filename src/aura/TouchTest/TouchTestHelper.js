({
    setupCanvas : function(component)
    {
        try
        {
            if (!component.get('v.initialised')) {
                this.log(component, 'Setting up canvas');
                this.canvas = document.querySelector('#paint');
                this.ctx = this.canvas.getContext('2d');
                this.resizeCanvas();
               	this.ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );
                
                /* Mouse/touch Capturing Work */
                var self=this;
                this.canvas.addEventListener("touchmove", function(e) {
                    self.updateMousePosition(component, e, self.canvas);
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }, false);
                
                var onPaint = function(e) {
                    self.log(component, 'Drawing line to ' + self.mouse.x + ',' + self.mouse.y);
                    self.ctx.lineTo(self.mouse.x, self.mouse.y);
                    self.ctx.stroke();
                    self.empty=false;
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                };
                
                this.canvas.addEventListener("touchstart", function(e) {
                    self.updateMousePosition(component, e, self.canvas);
                    self.ctx.beginPath();
                    self.log(component, 'Moving to ' + self.mouse.x + ',' + self.mouse.y);
                    self.ctx.moveTo(self.mouse.x, self.mouse.y);
                    self.canvas.addEventListener(self.mouseMoveEvent, onPaint, false);
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }, false);
                
                this.canvas.addEventListener("touchend", function(e) {
                    self.canvas.removeEventListener(self.mouseMoveEvent, onPaint, false);
                    // self.updateMousePosition(e, self.canvas);
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }, false);
                
                component.set('v.initialised', true);
            }
        }
        catch (e) 
        {
            alert('Exception :( - ' + e);
        }
    },
    updateMousePosition : function (component, event, canvas) {
        try
        {
            var target;
                this.log(component, 'mobile!');
                this.log(component, 'Changed touches = ' + event.changedTouches);
                target = event.changedTouches[0];
                this.log(component, 'Target = ' + target);
	            var rect=canvas.getBoundingClientRect();
    	        this.log(component, 'Top = ' + rect.top + ', left = ' + rect.left);
			    this.mouse.x = target.clientX - rect.left;
			    this.mouse.y = target.clientY - rect.top;
        }
        catch (e) 
        {
            this.log(component, 'Exception: ' + e);
        }
    },
    resizeCanvas : function() 
    {
        // take pixel ratio into account
        var ratio =  window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.canvas.getContext("2d").scale(ratio, ratio);
	},
    log : function(component, msg){
        var idx=component.get('v.idx');
        console.log(msg);
        var logs=component.get('v.logs');
        if (null==logs) {
            logs=[];
        }
        logs.push(idx + ' ' + msg);
        if (logs.length>10) {
            logs.shift();
        }
        component.set('v.logs', logs);
        idx++;
        component.set('v.idx', idx);
    }
  })