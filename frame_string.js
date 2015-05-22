function frameString(object,actions,speed,length,loop){
    return new FrameString(object,actions,speed,length,loop);
}

function FrameString(object,actions,speed,length,loop){
    this.timer = null;
    this.actions = new Array();
    this.speed = 1;
    this.frequency = 100;
    this.object = null;
    this._length = 0;
    this.length = length;
    this.loop = true;
    this.animation_function = 'linear';

    if(object) this.setObject(object);
    if(actions) this.setActions(actions);
    if(speed) this.speed = speed;
    if(loop) this.loop = loop;

    FrameString.ANIMATIONS.push(this);
}

FrameString.ANIMATIONS = new Array();

FrameString.prototype.loop = function(loop){
    this.loop = loop;
    return this;
};

FrameString.prototype.animationFunction = function(animation_function){
    this.animation_function = animation_function;
    return this;
};

FrameString.prototype.speed = function(speed){
    this.speed = speed;
    return this;
};

FrameString.prototype.setObject = function(el){
    this.object = $(el);
    return this;
};

FrameString.prototype.setAction = function(property,value,time,duration){
    if(!duration) duration = 1;
    this.actions.push([property,value,time,duration]);
    if(duration) time += duration;
    if(!this.length && time > this._length) this._length = time + 1;
    return this;
};

FrameString.prototype.setActions = function(actions){
    var c;
    for(var k in actions){
        c = actions[k];
        this.setAction(c[0],c[1],c[2]);
    }
    return this;
};

FrameString.prototype.stop = function(){
    clearTimeout(this.timer);
};

FrameString.prototype.start = function(){
    var length = this.actions.length;
    if(this.object && length>0){
        var actions,duration,animation_function, af= new Array();
        var frame_length = this.speed * this.frequency;
        var obj = this;
        var __length = (this.length) ? this.length : this._length;
        var frame_animation_length = (frame_length/1000).toFixed(2);
        //var af = [];

        var animate = function(index){
            if(index > __length){
                if(!obj.loop){ return false; }
                index = 0;
                af = new Array();
            }

            for(var i = 0; i<length; i++){
                actions = obj.actions[i];
                if(actions[2] == index){
                    duration = actions[3];
                    animation_function = (duration * frame_animation_length)+'s '+actions[0];
                    af.push(animation_function);
                    animation_function = af.join(', ');

                    obj.object.css({'transition':animation_function,'-moz-transition':animation_function,'-webkit-transition':animation_function,'-o-transition':animation_function,'-ms-transition':animation_function});
                    obj.object.css(actions[0],actions[1]);
                }
            }

            obj.timer = setTimeout(function(){
                animate(index + 1);
            },frame_length);
        };

        animate(0);
    }
};
