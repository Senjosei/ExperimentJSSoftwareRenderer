document.onreadystatechange = function(){
    var canvas = document.querySelector("#canvas");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    function Color(r,g,b,a){
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    };

    Size = {
        Width : 1152,
        Height : 648 
    }

    function vertices(x,y,z){
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
    
    window.Renderer = {
        Context : context,
        Width : Size.Width,
        Height : Size.Height,
        EmptyBuffer : new ImageData(Size.Width,Size.Height),
        PixelBuffer : new ImageData(Size.Width,Size.Height)
    };

    Renderer.GetColor = function(x,y){
        var tmp  = y * (this.Width * 4 ) + x * 4;
        var r = this.PixelBuffer.data[tmp];
        var g = this.PixelBuffer.data[tmp + 1];
        var b = this.PixelBuffer.data[tmp + 2];
        var a = this.PixelBuffer.data[tmp + 3];
        return new Color(r,g,b,a)
    };
    
    Renderer.PutColor = function(x,y,pixel){
        var tmp  = y * (this.Width * 4 ) + x * 4;
        this.PixelBuffer.data[tmp] = pixel.R;
        this.PixelBuffer.data[tmp + 1] = pixel.G;
        this.PixelBuffer.data[tmp + 2] = pixel.B;
        this.PixelBuffer.data[tmp + 3] = pixel.A;
    };

    // for(var i = 0; i < Renderer.Width; i++){
    //     for(var j = 0; j < Renderer.Height; j++){
    //         var tmp_pixel = new Color; 
    //         tmp_pixel.R = i % 255;
    //         tmp_pixel.G = i % j % 255;
    //         tmp_pixel.B = j % 255;
    //         tmp_pixel.A = 255;
    //         Renderer.PutColor(i,j,tmp_pixel);
    //     }
    // }

    Renderer.MakeLine = function(x1,y1,x2,y2){
        x1 = Math.floor(x1);
    	x2 = Math.floor(x2);
        y1 = Math.floor(y1);
        y2 = Math.floor(y2);
        var dx = x2-x1;
        var dy = y2-y1;
        var tmp_color = new Color;
        tmp_color.R = 0;
        tmp_color.G = 0;
        tmp_color.B = 0;
        tmp_color.A = 255;

        if(Math.abs(dx) > Math.abs(dy)){
            if(x2 > x1){
                for (var x = x1; x < x2 ; x++){
                    var y = Math.floor(y1 + dy * (x-x1) / dx);
                    if (x >= 0 && y >= 0){
                       Renderer.PutColor(x, y, tmp_color);
                    }
                }
            } else {
                for (var x = x2; x < x1 ; x++){
                    var y = Math.floor(y1 + dy * (x-x1) / dx);
                    if (x >= 0 && y >= 0){
                        Renderer.PutColor(x, y, tmp_color);
                    }
                }
            }
        } else {
            if(y2 > y1){
                for (var y = y1; y < y2 ; y++){
                    var x = Math.floor(x1 + dx * (y-y1) / dy);
                    if (x >= 0 && y >= 0){
                       Renderer.PutColor(x, y, tmp_color);
                    }
                }
            } else {
                for (var y = y2; y < y1 ; y++){
                    var x = Math.floor(x1 + dx * (y-y1) / dy);
                    if (x >= 0 && y >= 0){
                       Renderer.PutColor(x, y, tmp_color);
                    }
               }
            }
        }
    }


    // for (var face of Model.Face){
    //     var x1 = (Model.Vertex[face.V1 - 1].X)*300 + 500;
    //     var y1 = (Model.Vertex[face.V1 - 1].Y)*300 + 300; 

    //     var x2 = (Model.Vertex[face.V2 - 1].X)*300 + 500;
    //     var y2 = (Model.Vertex[face.V2 - 1].Y)*300 + 300; 

    //     var x3 = (Model.Vertex[face.V3 - 1].X)*300 + 500;
    //     var y3 = (Model.Vertex[face.V3 - 1].Y)*300 + 300; 

    //     Renderer.MakeLine(x1,y1,x2,y2);
    //     Renderer.MakeLine(x3,y3,x2,y2);
    //     Renderer.MakeLine(x3,y3,x1,y1);
    // }

    Renderer.Render = function(){
        this.Context.clearRect(0,0, this.Width, this.Height);
        this.Context.putImageData(Renderer.PixelBuffer,0,0);
        this.PixelBuffer.data.set(this.EmptyBuffer.data);
    }


    Renderer.Rotatez = function(vertex,degree){
        var theta = (degree/360) * 2 * Math.PI;
        var x = vertex.X * Math.cos(theta) - vertex.Y * Math.sin(theta);
        var y = vertex.X * Math.sin(theta) + vertex.Y * Math.cos(theta);
        var z = vertex.Z;
        return new vertices(x,y,z);
    }


    Renderer.Rotatey = function(vertex,degree){
        var theta = (degree/360) * 2 * Math.PI;
        var x = vertex.X * Math.cos(theta) + vertex.Z * Math.sin(theta);
        var y = vertex.Y;
        var z = - vertex.X * Math.sin(theta) + vertex.Z * Math.cos(theta);
        return new vertices(x,y,z);
    }

    function PerspectiveProj(vertex, distance){
        return {
            X: vertex.X / (1-vertex.Z/distance),
            Y: vertex.Y / (1-vertex.Z/distance),
            Z: vertex.Z / (1-vertex.Z/distance)
        }
    }

    var deg = 0;
    setInterval(function(){
        for (var face of Model.Face){
            var index1 = face.V1 - 1;
            var index2 = face.V2 - 1;
            var index3 = face.V3 - 1;
            var v1 = Model.Vertex[index1];
            var v2 = Model.Vertex[index2];
            var v3 = Model.Vertex[index3];

            v1 = Renderer.Rotatez(v1, 180);
            v2 = Renderer.Rotatez(v2, 180);
            v3 = Renderer.Rotatez(v3, 180);

            v1 = Renderer.Rotatey(v1, deg);
            v2 = Renderer.Rotatey(v2, deg);
            v3 = Renderer.Rotatey(v3, deg);
            
            v1 = PerspectiveProj(v1,300);
            v2 = PerspectiveProj(v2,300);
            v3 = PerspectiveProj(v3,300);

            x1 = 5*v1.X + 525;
            y1 = 5*v1.Y + 550;
            x2 = 5*v2.X + 525;
            y2 = 5*v2.Y + 550;
            x3 = 5*v3.X + 525;
            y3 = 5*v3.Y + 550;
            Renderer.MakeLine(x1,y1,x2,y2);
            Renderer.MakeLine(x3,y3,x2,y2);
            Renderer.MakeLine(x3,y3,x1,y1);
        }
    Renderer.Render();
    deg += 0.5;
    },100);

    

    


    Renderer.Context.putImageData(Renderer.PixelBuffer,0,0)
}