document.onreadystatechange = function(){
    var canvas = document.querySelector("#canvas");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    function Color(r,g,b,a){
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }

    function Vec2(x,y){
        this.X = x;
        this.Y = y;
    }

    function Vec3(x,y,z){
        this.X = x;
        this.Y = y;
        this.Z = z;
    }

    function Mat3x1(x,y,z){
        return [x,y,z];
    }

    function Mat3x3(
        a0, a1, a2,
        b0, b1, b2,
        c0, c1, c2
    ){
        return [
            a0, a1, a2,
            b0, b1, b2,
            c0, c1, c2
        ]
    }

    function Mat3x3Mul3x1(m3x3, m3x1){
        var x,y,z;
        x = m3x3[0] * m3x1[0] + m3x3[1] * m3x1[1] + m3x3[2] * m3x1[2];
        y = m3x3[3] * m3x1[0] + m3x3[4] * m3x1[1] + m3x3[5] * m3x1[2];
        z = m3x3[6] * m3x1[0] + m3x3[7] * m3x1[1] + m3x3[8] * m3x1[2];
        return [x,y,z];
    }

    function RotateZ(vertex,deg){
        deg = Math.PI / 180 * deg;
        var cos = Math.cos;
        var sin = Math.sin;
        var vertex = Mat3x1(vertex.X, vertex.Y, vertex.Z);
        var rotation = Mat3x3(
            cos(deg), -sin(deg), 0,
            sin(deg),  cos(deg), 0,
            0       ,  0       , 1
        );
        var tmp = Mat3x3Mul3x1(rotation,vertex);
        return {
            X: tmp[0],
            Y: tmp[1],
            Z: tmp[2],
        }
    }

    function RotateX(vertex,deg){
        deg = Math.PI / 180 * deg;
        var cos = Math.cos;
        var sin = Math.sin;
        var vertex = Mat3x1(vertex.X, vertex.Y, vertex.Z);
        var rotation = Mat3x3(
            1       ,  0       , 0,
            0,cos(deg), -sin(deg),
            0,sin(deg),  cos(deg)
        );
        var tmp = Mat3x3Mul3x1(rotation,vertex);
        return {
            X: tmp[0],
            Y: tmp[1],
            Z: tmp[2],
        }
    }

    function RotateY(vertex,deg){
        deg = Math.PI / 180 * deg;
        var cos = Math.cos;
        var sin = Math.sin;
        var vertex = Mat3x1(vertex.X, vertex.Y, vertex.Z);
        var rotation = Mat3x3(
            cos(deg),0,sin(deg),
            0,1,0,
            -sin(deg),0,cos(deg)
        );
        var tmp = Mat3x3Mul3x1(rotation,vertex);
        return {
            X: tmp[0],
            Y: tmp[1],
            Z: tmp[2],
        }
    }

    function PrespectiveProjection(vertex,distance){
        return {
            X: vertex.X / (1-vertex.Z/distance),
            Y: vertex.Y / (1-vertex.Z/distance),
            Z: vertex.Z / (1-vertex.Z/distance)
        }
    }

    window.Renderer = {
        'Width' : 1920,
        'Height' : 1080,
        'Context' : document.querySelector("#canvas").getContext("2d"),
        'EmptyBuffer' : new ImageData(1920, 1080),
        'PixelBuffer' : new ImageData(1920, 1080),

        'GetPixel' : function(x,y){
            var tmp = y * (this.Width * 4) + x * 4;
            var r = this.PixelBuffer.data[tmp];
            var g = this.PixelBuffer.data[tmp + 1];
            var b = this.PixelBuffer.data[tmp + 2];
            var a = this.PixelBuffer.data[tmp + 3];
            return new Color(r,g,b,a);
        },

        'PutPixel' : function(x,y,color){
            var tmp = y * (this.Width * 4) + x * 4;
            this.PixelBuffer.data[tmp] = color.R;
            this.PixelBuffer.data[tmp + 1] = color.G;
            this.PixelBuffer.data[tmp + 2] = color.B;
            this.PixelBuffer.data[tmp + 3] = color.A;
        },

        'Line' : function(x0,y0,x1,y1,color){
            // if(typeof variable === 'undefined') color = new Color(0,0,0,255);
            x0 = Math.floor(x0);
            x1 = Math.floor(x1);
            y0 = Math.floor(y0);
            y1 = Math.floor(y1);
            var dx = Math.abs(x1 - x0)
            var sx = x0 < x1 ? 1 : -1;
            var dy = Math.abs(y1 - y0)
            var sy = y0 < y1 ? 1 : -1; 
            var err = (dx > dy ? dx : -dy)/2;
            
            while (true) {
                if (x0 >= 0 && y0 >= 0 && x0 < this.Width && y0 < this.Height) this.PutPixel(x0,y0,color);
                if (x0 === x1 && y0 === y1) break;
                var e2 = err;
                if (e2 > -dx) { err -= dy; x0 += sx; }
                if (e2 < dy) { err += dx; y0 += sy; }
            }
        },

        'DrawTriangle' : function(v1,v2,v3){
            if (v1.Y==v2.Y && v1.Y==v3.Y) return;
            var tmp;
            var tmp2;
            if (v1.Y>v2.Y) {tmp = v1; v1 = v2; v2 = tmp};
            if (v1.Y>v3.Y) {tmp = v1; v1 = v3; v3 = tmp};
            if (v2.Y>v3.Y) {tmp = v2; v2 = v3; v3 = tmp};

            Renderer.Line(v1.X,v1.Y,v2.X,v2.Y,{R:0,G:255,B:0,A:255});
            Renderer.Line(v2.X,v2.Y,v3.X,v3.Y,{R:0,G:255,B:0,A:255});
            Renderer.Line(v3.X,v3.Y,v1.X,v1.Y,{R:255,G:0,B:0,A:255});

            var total_height = v3.Y-v1.Y; 
            for (var i=0; i<total_height; i++) { 
                var second_half = i>v2.Y-v1.Y || v2.Y==v1.Y; 
                var segment_height = second_half ? v3.Y-v2.Y : v2.Y-v1.Y; 
                segment_height = Math.floor(segment_height);
                var alpha = i/total_height; 
                var beta  = (i-(second_half ? v2.Y-v1.Y : 0))/segment_height;
                var A = {
                    X: Math.floor( v1.X + (v3.X-v1.X)*alpha ),
                    Y: Math.floor( v1.Y + (v3.Y-v1.Y)*alpha ),
                    Z: Math.floor( v1.Z + (v3.Z-v1.Z)*alpha ),
                };
                var B = {
                    X: Math.floor( second_half ? v2.X + (v3.X-v2.X)*beta : v1.X + (v2.X-v1.X)*beta ),
                    Y: Math.floor( second_half ? v2.Y + (v3.Y-v2.Y)*beta : v1.Y + (v2.Y-v1.Y)*beta ),
                    Z: Math.floor( second_half ? v2.Z + (v3.Z-v2.Z)*beta : v1.Z + (v2.Z-v1.Z)*beta ),
                };
                if (A.X>B.X) {tmp2 = A; A = B; B = tmp2}; 
                for (var j=A.X; j<=B.X; j++) { 
                    this.PutPixel(j, v1.Y+i, {R:255,G:255,B:255,A:255}); 
                } 
            } 
        },

        'Render' : function(){
            this.Context.clearRect(0, 0, this.Width, this.Height);
            this.Context.putImageData(Renderer.PixelBuffer,0,0);
            this.PixelBuffer.data.set(this.EmptyBuffer.data);
        }
    }

    // for(var x = 0; x < Renderer.Width; x++){
    //     for(var y = 0; y < Renderer.Height; y++){
    //         Renderer.PutPixel(
    //             x,
    //             y,
    //             new Color(
    //                 // x % 255,
    //                 // x%y%255,
    //                 // y % 255,
    //                 90,90,90,
    //                 255
    //             )
    //         );
    //     }
    // }

    // for(var i = 0; i < 10; i++){
    //     Renderer.Line(Math.floor(Math.random()*1920),Math.floor(Math.random()*1080),Math.floor(Math.random()*1920),Math.floor(Math.random()*1080))
    // }

    // Renderer.Line(2000,200,2000,500);
    // Renderer.Render();

    var deg = 0;
    // setInterval(function(){ //FACE
    //     for(var face of Model.Face){
    //         var index1 = face.V1 - 1;
    //         var index2 = face.V2 - 1;
    //         var index3 = face.V3 - 1;
    
    //         var v1 = Model.Vertex[index1];
    //         var v2 = Model.Vertex[index2];
    //         var v3 = Model.Vertex[index3];
    
    //         v1 = RotateZ(v1,180);
    //         v2 = RotateZ(v2,180);
    //         v3 = RotateZ(v3,180);

    //         v1 = RotateY(v1,deg);
    //         v2 = RotateY(v2,deg);
    //         v3 = RotateY(v3,deg);

    //         v1 = PrespectiveProjection(v1,1.5);
    //         v2 = PrespectiveProjection(v2,1.5);
    //         v3 = PrespectiveProjection(v3,1.5);
    
    //         Renderer.Line(v1.X*500+960,v1.Y*500+550,v2.X*500+960,v2.Y*500+550);
    //         Renderer.Line(v2.X*500+960,v2.Y*500+550,v3.X*500+960,v3.Y*500+550);
    //         Renderer.Line(v3.X*500+960,v3.Y*500+550,v1.X*500+960,v1.Y*500+550);
    //     }
    //     Renderer.Render();
    //     deg += .2;
    // },100);
    // setInterval(function(){ //FOX
        for(var face of Model.Face){
            var index1 = face.V1 - 1;
            var index2 = face.V2 - 1;
            var index3 = face.V3 - 1;
    
            var v1 = Model.Vertex[index1];
            var v2 = Model.Vertex[index2];
            var v3 = Model.Vertex[index3];
    
            v1 = RotateZ(v1,180);
            v2 = RotateZ(v2,180);
            v3 = RotateZ(v3,180);

            v1 = RotateY(v1,90);
            v2 = RotateY(v2,90);
            v3 = RotateY(v3,90);

            v1 = PrespectiveProjection(v1,300);
            v2 = PrespectiveProjection(v2,300);
            v3 = PrespectiveProjection(v3,300);
    
            v1.X = v1.X*10+960;
            v2.X = v2.X*10+960;
            v3.X = v3.X*10+960;

            v1.Y = v1.Y*10+1000;
            v2.Y = v2.Y*10+1000;
            v3.Y = v3.Y*10+1000;

            Renderer.DrawTriangle(v1,v2,v3);

            // Renderer.Line(v1.X,v1.Y,v2.X,v2.Y);
            // Renderer.Line(v2.X,v2.Y,v3.X,v3.Y);
            // Renderer.Line(v3.X,v3.Y,v1.X,v1.Y);
        }
        Renderer.Render();
        // deg += .2;
    // },100);

    // Renderer.DrawTriangle({
    //     X: 1000,
    //     Y: 100,
    //     Z: 100
    // },{
    //     X: 100,
    //     Y: 110,
    //     Z: 200
    // },{
    //     X: 950,
    //     Y: 900,
    //     Z: 300
    // })

    Renderer.Render();
}