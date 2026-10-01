export function initializeFluidBackground(canvas) {
if (!canvas) return function cleanupMissingCanvas() {};
var gl = canvas.getContext("webgl", { alpha: true, antialias: false });
if (!gl) return function cleanupUnavailableWebGL() {};

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();

var SIM_HEIGHT = 3.0, cScale, simWidth;
function updateScale() { cScale = canvas.height / SIM_HEIGHT; simWidth = canvas.width / cScale; }
updateScale();

var FLUID_CELL = 0, AIR_CELL = 1, SOLID_CELL = 2;
function clamp(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }

class FlipFluid {
  constructor(density, width, height, spacing, particleRadius, maxParticles) {
    this.density = density;
    this.fNumX = Math.floor(width / spacing) + 1;
    this.fNumY = Math.floor(height / spacing) + 1;
    this.h = Math.max(width / this.fNumX, height / this.fNumY);
    this.fInvSpacing = 1.0 / this.h;
    this.fNumCells = this.fNumX * this.fNumY;
    this.u = new Float32Array(this.fNumCells);
    this.v = new Float32Array(this.fNumCells);
    this.du = new Float32Array(this.fNumCells);
    this.dv = new Float32Array(this.fNumCells);
    this.prevU = new Float32Array(this.fNumCells);
    this.prevV = new Float32Array(this.fNumCells);
    this.p = new Float32Array(this.fNumCells);
    this.s = new Float32Array(this.fNumCells);
    this.cellType = new Int32Array(this.fNumCells);
    this.maxParticles = maxParticles;
    this.particlePos = new Float32Array(2 * maxParticles);
    this.particleColor = new Float32Array(3 * maxParticles);
    this.particleVel = new Float32Array(2 * maxParticles);
    this.particleDensity = new Float32Array(this.fNumCells);
    this.particleRestDensity = 0.0;
    this.particleRadius = particleRadius;
    this.numParticles = 0;
    this.pInvSpacing = 1.0 / (2.2 * particleRadius);
    this.pNumX = Math.floor(width * this.pInvSpacing) + 1;
    this.pNumY = Math.floor(height * this.pInvSpacing) + 1;
    this.pNumCells = this.pNumX * this.pNumY;
    this.numCellParticles = new Int32Array(this.pNumCells);
    this.firstCellParticle = new Int32Array(this.pNumCells + 1);
    this.cellParticleIds = new Int32Array(maxParticles);
    
    // Base particle color initialized to #FF6B86
    for (var i = 0; i < maxParticles; i++) { 
      this.particleColor[3*i] = 1.0;       
      this.particleColor[3*i+1] = 0.4196;  
      this.particleColor[3*i+2] = 0.5255;  
    }
  }

  integrateParticles(dt, gravity) {
    for (var i = 0; i < this.numParticles; i++) {
      this.particleVel[2*i+1] += dt * gravity;
      this.particlePos[2*i] += this.particleVel[2*i] * dt;
      this.particlePos[2*i+1] += this.particleVel[2*i+1] * dt;
    }
  }

  pushParticlesApart(numIters) {
    var np=this.numParticles, pos=this.particlePos, invS=this.pInvSpacing, pnx=this.pNumX, pny=this.pNumY;
    this.numCellParticles.fill(0);
    for (var i=0;i<np;i++) { var xi=clamp(Math.floor(pos[2*i]*invS),0,pnx-1); var yi=clamp(Math.floor(pos[2*i+1]*invS),0,pny-1); this.numCellParticles[xi*pny+yi]++; }
    var first=0; for (var i=0;i<this.pNumCells;i++) { first+=this.numCellParticles[i]; this.firstCellParticle[i]=first; } this.firstCellParticle[this.pNumCells]=first;
    for (var i=0;i<np;i++) { var xi=clamp(Math.floor(pos[2*i]*invS),0,pnx-1); var yi=clamp(Math.floor(pos[2*i+1]*invS),0,pny-1); var c=xi*pny+yi; this.firstCellParticle[c]--; this.cellParticleIds[this.firstCellParticle[c]]=i; }
    var minDist=2.0*this.particleRadius, minDist2=minDist*minDist, fcp=this.firstCellParticle, cpi=this.cellParticleIds;
    for (var iter=0;iter<numIters;iter++) {
      for (var i=0;i<np;i++) {
        var px=pos[2*i],py=pos[2*i+1], pxi=Math.floor(px*invS), pyi=Math.floor(py*invS);
        var x0=Math.max(pxi-1,0),y0=Math.max(pyi-1,0),x1=Math.min(pxi+1,pnx-1),y1=Math.min(pyi+1,pny-1);
        for (var xi=x0;xi<=x1;xi++) for (var yi=y0;yi<=y1;yi++) { var c=xi*pny+yi; for (var j=fcp[c];j<fcp[c+1];j++) {
          var id=cpi[j]; if(id===i) continue;
          var dx=pos[2*id]-px,dy=pos[2*id+1]-py,d2=dx*dx+dy*dy;
          if(d2>minDist2||d2===0) continue;
          var d=Math.sqrt(d2),s=0.5*(minDist-d)/d; dx*=s; dy*=s;
          pos[2*i]-=dx; pos[2*i+1]-=dy; pos[2*id]+=dx; pos[2*id+1]+=dy;
        }}
      }
    }
  }

  enforceWalls() {
    var h=this.h,r=this.particleRadius,minX=h+r,maxX=(this.fNumX-1)*h-r,minY=h+r,maxY=(this.fNumY-1)*h-r;
    var pos=this.particlePos,vel=this.particleVel;
    for (var i=0;i<this.numParticles;i++) { var i2=2*i;
      if(pos[i2]<minX){pos[i2]=minX;vel[i2]=0;} if(pos[i2]>maxX){pos[i2]=maxX;vel[i2]=0;}
      if(pos[i2+1]<minY){pos[i2+1]=minY;vel[i2+1]=0;} if(pos[i2+1]>maxY){pos[i2+1]=maxY;vel[i2+1]=0;}
    }
  }

  applyForceField(cx, cy, pushStrength, mvx, mvy) {
    var speed = Math.sqrt(mvx*mvx + mvy*mvy);
    if (speed < 0.3) return;
    var invSpd=1/speed, dirX=mvx*invSpd, dirY=mvy*invSpd;
    var speedT = clamp((speed-0.3)/7.7, 0, 1); speedT *= (2-speedT);
    var reach = (0.06+speedT*0.59)*(0.5+pushStrength*0.5);
    var sideW = reach*(0.35+speedT*0.25), invSide=1/sideW;
    var forceMag = speedT*pushStrength*22, scatterMag = forceMag*0.12;
    var cutoff2 = reach*reach*4, minFwd = -reach*0.1, fwdRange = reach-minFwd;
    var pos=this.particlePos, vel=this.particleVel;
    for (var i=0;i<this.numParticles;i++) {
      var dx=pos[2*i]-cx, dy=pos[2*i+1]-cy, d2=dx*dx+dy*dy;
      if(d2>=cutoff2||d2<0.0001) continue;
      var fwd=dx*dirX+dy*dirY; if(fwd<=minFwd||fwd>=reach) continue;
      var latX=dx-fwd*dirX, latY=dy-fwd*dirY, lat=Math.sqrt(latX*latX+latY*latY);
      if(lat>=sideW) continue;
      var fT=1-(fwd-minFwd)/fwdRange, lT=1-lat*invSide, fall=fT*fT*lT*lT;
      vel[2*i]+=dirX*fall*forceMag; vel[2*i+1]+=dirY*fall*forceMag;
      if(lat>0.001){var inv=fall*scatterMag/lat; vel[2*i]+=latX*inv; vel[2*i+1]+=latY*inv;}
    }
  }

  updateParticleDensity() {
    var n=this.fNumY,h=this.h,h1=this.fInvSpacing,h2=0.5*h,d=this.particleDensity,pos=this.particlePos;
    d.fill(0);
    for (var i=0;i<this.numParticles;i++) {
      var x=clamp(pos[2*i],h,(this.fNumX-1)*h), y=clamp(pos[2*i+1],h,(this.fNumY-1)*h);
      var x0=Math.floor((x-h2)*h1),tx=((x-h2)-x0*h)*h1,x1=Math.min(x0+1,this.fNumX-2);
      var y0=Math.floor((y-h2)*h1),ty=((y-h2)-y0*h)*h1,y1=Math.min(y0+1,this.fNumY-2);
      var sx=1-tx,sy=1-ty;
      if(x0<this.fNumX&&y0<this.fNumY) d[x0*n+y0]+=sx*sy;
      if(x1<this.fNumX&&y0<this.fNumY) d[x1*n+y0]+=tx*sy;
      if(x1<this.fNumX&&y1<this.fNumY) d[x1*n+y1]+=tx*ty;
      if(x0<this.fNumX&&y1<this.fNumY) d[x0*n+y1]+=sx*ty;
    }
    if(this.particleRestDensity===0){var sum=0,cnt=0;for(var i=0;i<this.fNumCells;i++){if(this.cellType[i]===FLUID_CELL){sum+=d[i];cnt++;}}if(cnt>0)this.particleRestDensity=sum/cnt;}
  }

  transferVelocities(toGrid, flipRatio) {
    var n=this.fNumY,h=this.h,h1=this.fInvSpacing,h2=0.5*h,pos=this.particlePos,pvel=this.particleVel;
    if(toGrid){this.prevU.set(this.u);this.prevV.set(this.v);this.du.fill(0);this.dv.fill(0);this.u.fill(0);this.v.fill(0);
      for(var i=0;i<this.fNumCells;i++) this.cellType[i]=this.s[i]===0?SOLID_CELL:AIR_CELL;
      for(var i=0;i<this.numParticles;i++){var xi=clamp(Math.floor(pos[2*i]*h1),0,this.fNumX-1);var yi=clamp(Math.floor(pos[2*i+1]*h1),0,this.fNumY-1);if(this.cellType[xi*n+yi]===AIR_CELL)this.cellType[xi*n+yi]=FLUID_CELL;}
    }
    for(var comp=0;comp<2;comp++){
      var dx=comp===0?0:h2, dy=comp===0?h2:0, ff=comp===0?this.u:this.v, pf=comp===0?this.prevU:this.prevV, dd=comp===0?this.du:this.dv;
      for(var i=0;i<this.numParticles;i++){
        var x=clamp(pos[2*i],h,(this.fNumX-1)*h), y=clamp(pos[2*i+1],h,(this.fNumY-1)*h);
        var x0=Math.min(Math.floor((x-dx)*h1),this.fNumX-2),tx=((x-dx)-x0*h)*h1,x1=Math.min(x0+1,this.fNumX-2);
        var y0=Math.min(Math.floor((y-dy)*h1),this.fNumY-2),ty=((y-dy)-y0*h)*h1,y1=Math.min(y0+1,this.fNumY-2);
        var sx=1-tx,sy=1-ty,d0=sx*sy,d1=tx*sy,d2=tx*ty,d3=sx*ty;
        var nr0=x0*n+y0,nr1=x1*n+y0,nr2=x1*n+y1,nr3=x0*n+y1;
        if(toGrid){var pv=pvel[2*i+comp];ff[nr0]+=pv*d0;dd[nr0]+=d0;ff[nr1]+=pv*d1;dd[nr1]+=d1;ff[nr2]+=pv*d2;dd[nr2]+=d2;ff[nr3]+=pv*d3;dd[nr3]+=d3;}
        else{var off=comp===0?n:1;var v0=this.cellType[nr0]!==AIR_CELL||this.cellType[nr0-off]!==AIR_CELL?1:0;var v1=this.cellType[nr1]!==AIR_CELL||this.cellType[nr1-off]!==AIR_CELL?1:0;var v2=this.cellType[nr2]!==AIR_CELL||this.cellType[nr2-off]!==AIR_CELL?1:0;var v3=this.cellType[nr3]!==AIR_CELL||this.cellType[nr3-off]!==AIR_CELL?1:0;var dS=v0*d0+v1*d1+v2*d2+v3*d3;
          if(dS>0){var picV=(v0*d0*ff[nr0]+v1*d1*ff[nr1]+v2*d2*ff[nr2]+v3*d3*ff[nr3])/dS;var corr=(v0*d0*(ff[nr0]-pf[nr0])+v1*d1*(ff[nr1]-pf[nr1])+v2*d2*(ff[nr2]-pf[nr2])+v3*d3*(ff[nr3]-pf[nr3]))/dS;pvel[2*i+comp]=(1-flipRatio)*picV+flipRatio*(pvel[2*i+comp]+corr);}}
      }
      if(toGrid){for(var i=0;i<ff.length;i++)if(dd[i]>0)ff[i]/=dd[i];
        for(var i=0;i<this.fNumX;i++)for(var j=0;j<this.fNumY;j++){var solid=this.cellType[i*n+j]===SOLID_CELL;if(solid||(i>0&&this.cellType[(i-1)*n+j]===SOLID_CELL))this.u[i*n+j]=this.prevU[i*n+j];if(solid||(j>0&&this.cellType[i*n+j-1]===SOLID_CELL))this.v[i*n+j]=this.prevV[i*n+j];}
      }
    }
  }

  solveIncompressibility(numIters, dt, overRelaxation, compensateDrift) {
    this.p.fill(0); this.prevU.set(this.u); this.prevV.set(this.v);
    var n=this.fNumY,cp=this.density*this.h/dt,u=this.u,v=this.v,s=this.s,p=this.p,ct=this.cellType,pd=this.particleDensity,prd=this.particleRestDensity;
    var doComp=prd>0&&compensateDrift;
    for(var iter=0;iter<numIters;iter++){for(var i=1;i<this.fNumX-1;i++){var iN=i*n;for(var j=1;j<this.fNumY-1;j++){var c=iN+j;if(ct[c]!==FLUID_CELL)continue;var sx0=s[c-n],sx1=s[c+n],sy0=s[c-1],sy1=s[c+1],ss=sx0+sx1+sy0+sy1;if(ss===0)continue;var div=u[c+n]-u[c]+v[c+1]-v[c];if(doComp){var comp=pd[c]-prd;if(comp>0)div-=comp;}var pp=-div/ss*overRelaxation;p[c]+=cp*pp;u[c]-=sx0*pp;u[c+n]+=sx1*pp;v[c]-=sy0*pp;v[c+1]+=sy1*pp;}}}
  }

  updateParticleColors(visThreshold) {
    var h1=this.fInvSpacing,bgR=1.0,bgG=0.4196,bgB=0.5255; 
    var dcL=0.35+visThreshold*0.45,dcH=dcL+0.25,invR=1/(dcH-dcL);
    var glR=scene.glowColor[0],glG=scene.glowColor[1],glB=scene.glowColor[2];
    var glI=scene.glowIntensity;
    var fnY=this.fNumY,fnX=this.fNumX,pos=this.particlePos,vel=this.particleVel,col=this.particleColor,pd=this.particleDensity,prd=this.particleRestDensity;
    for(var i=0;i<this.numParticles;i++){
      var i2=i*2,i3=i*3,xi=clamp(Math.floor(pos[i2]*h1),1,fnX-1),yi=clamp(Math.floor(pos[i2+1]*h1),1,fnY-1);
      var vis=0; if(prd>0){var rel=pd[xi*fnY+yi]/prd;vis=rel<dcL?1:rel<dcH?(dcH-rel)*invR:0;}
      var vx=vel[i2],vy=vel[i2+1],t=(vx*vx+vy*vy)/36;if(t>1)t=1;t*=(1.5-0.5*t);
      var cr,cg,cb;
      
      if(t<0.35){
        var s=t/0.35;
        cr = bgR + (1.0 - bgR) * s; 
        cg = bgG + (1.0 - bgG) * s;
        cb = bgB + (1.0 - bgB) * s;
      } else if(t<0.65){
        var s=(t-0.35)/0.3;
        cr=1.0; cg=1.0; cb=1.0;
      } else {
        var s=(t-0.65)/0.35;
        var add = s * glI * 1.5;
        cr=glR+add; cg=glG+add; cb=glB+add;
      }
      var tr=bgR+(cr-bgR)*vis,tg=bgG+(cg-bgG)*vis,tb=bgB+(cb-bgB)*vis;
      col[i3]+=(tr-col[i3])*0.12;col[i3+1]+=(tg-col[i3+1])*0.12;col[i3+2]+=(tb-col[i3+2])*0.12;
    }
  }

  simulate(dt, gravity, flipRatio, pressIters, sepIters, overRelax, compDrift, cx, cy, mvx, mvy, vis, skipCol) {
    this.integrateParticles(dt, gravity);
    this.pushParticlesApart(sepIters);
    this.enforceWalls();
    this.applyForceField(cx, cy, scene.pushStrength, mvx, mvy);
    this.transferVelocities(true);
    this.updateParticleDensity();
    this.solveIncompressibility(pressIters, dt, overRelax, compDrift);
    this.transferVelocities(false, flipRatio);
    if (!skipCol) { this.updateParticleColors(vis); }
  }
}

// Scene configuration
var scene = {
  gravity: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : -9.81, 
  dt: 1/120, 
  flipRatio: 0.98, 
  numPressureIters: window.innerWidth < 700 ? 18 : 28, 
  numParticleIters: 1, 
  overRelaxation: 1.9,
  compensateDrift: true, 
  obstacleX: -10, 
  obstacleY: -10, 
  obstacleVelX: 0, 
  obstacleVelY: 0, 
  pushStrength: 0.85,
  showParticles: true, 
  particleSizeMult: 0.45, 
  visThreshold: 0.43,
  glowColor: [1.0, 1.0, 1.0], 
  glowIntensity: 0.80,
  randomDrift: true, 
  driftTimer: 0, 
  driftActive: false,
  fluid: null, 
  particleTarget: window.innerWidth < 700 ? 900 : 1800, 
  speedMult: 1.0
};

function setupScene() {
  updateScale();
  var target = scene.particleTarget;
  var tankH = SIM_HEIGHT, tankW = simWidth, density = 1000;
  var bestRes = 50, bestDiff = 1e9;
  for (var res = 40; res <= 200; res++) {
    var h = tankH/res, r = 0.3*h, dx = 2*r, dy = Math.sqrt(3)/2*dx;
    var nx = Math.floor((0.6*tankW-2*h-2*r)/dx), ny = Math.floor((0.8*tankH-2*h-2*r)/dy);
    var diff = Math.abs(nx*ny - target);
    if (diff < bestDiff) { bestDiff = diff; bestRes = res; }
  }
  var h = tankH/bestRes, r = 0.3*h, dx = 2*r, dy = Math.sqrt(3)/2*dx;
  var numX = Math.floor((0.6*tankW-2*h-2*r)/dx), numY = Math.floor((0.8*tankH-2*h-2*r)/dy);
  var f = scene.fluid = new FlipFluid(density, tankW, tankH, h, r, numX*numY);
  f.numParticles = numX*numY;
  var p = 0; for (var i=0;i<numX;i++) for (var j=0;j<numY;j++) { f.particlePos[p++]=h+r+dx*i+(j%2===0?0:r); f.particlePos[p++]=h+r+dy*j; }
  var n = f.fNumY; for (var i=0;i<f.fNumX;i++) for (var j=0;j<f.fNumY;j++) { f.s[i*n+j]=(i===0||i===f.fNumX-1||j===0)?0:1; }
  calcStepsPerFrame();
}

// WEBGL RENDERER
var pointVS="attribute vec2 aPos;attribute vec3 aCol;uniform vec2 uDomain;uniform float uPointSize;varying vec3 vCol;void main(){vec4 t=vec4(2.0/uDomain.x,2.0/uDomain.y,-1.0,-1.0);gl_Position=vec4(aPos*t.xy+t.zw,0.0,1.0);gl_PointSize=uPointSize;vCol=aCol;}";
var pointFS=[
  "precision mediump float;",
  "varying vec3 vCol;",
  "uniform float uDisk;",
  "void main(){",
  "  vec2 pc = gl_PointCoord - 0.5;",
  "  float r2 = dot(pc, pc);",
  "  if(uDisk > 1.5){",
  "    float brightness = max(max(vCol.r, vCol.g), vCol.b);",
  "    float glow = brightness * brightness * brightness;",
  "    if(glow < 0.008) discard;",
  "    float d = r2 * 4.0;",  
  "    float falloff = exp(-d * 3.5);",
  "    falloff *= 1.0 - smoothstep(0.7, 1.0, d);",
  "    float a = glow * falloff * 0.55;",
  "    if(a < 0.002) discard;",
  "    gl_FragColor = vec4(vCol, a);",
  "  } else if(uDisk > 0.5){",
  "    if(r2 > 0.25) discard;",
  "    float a = 1.0 - smoothstep(0.06, 0.20, r2);",
  "    gl_FragColor = vec4(vCol, a);",
  "  } else {",
  "    gl_FragColor = vec4(vCol, 1.0);",
  "  }",
  "}"
].join("\n");

function createShader(vs,fs){var v=gl.createShader(gl.VERTEX_SHADER);gl.shaderSource(v,vs);gl.compileShader(v);var f=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(f,fs);gl.compileShader(f);var p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);return p;}

var pointShader=null, posBuffer=null, colBuffer=null;

function draw() {
  gl.viewport(0,0,canvas.width,canvas.height); 
  gl.clearColor(0, 0, 0, 0); 
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  if(!pointShader) pointShader=createShader(pointVS,pointFS);
  var f=scene.fluid;
  
  if(scene.showParticles){
    var ps=2.0*f.particleRadius/simWidth*canvas.width*scene.particleSizeMult;
    if(!posBuffer)posBuffer=gl.createBuffer();if(!colBuffer)colBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);gl.bufferData(gl.ARRAY_BUFFER,f.particlePos,gl.DYNAMIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,colBuffer);gl.bufferData(gl.ARRAY_BUFFER,f.particleColor,gl.DYNAMIC_DRAW);
    gl.useProgram(pointShader);gl.uniform2f(gl.getUniformLocation(pointShader,"uDomain"),simWidth,SIM_HEIGHT);
    var pL=gl.getAttribLocation(pointShader,"aPos"),cL=gl.getAttribLocation(pointShader,"aCol");gl.enableVertexAttribArray(pL);gl.enableVertexAttribArray(cL);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.uniform1f(gl.getUniformLocation(pointShader,"uPointSize"),ps*4);gl.uniform1f(gl.getUniformLocation(pointShader,"uDisk"),2);gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);gl.vertexAttribPointer(pL,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,colBuffer);gl.vertexAttribPointer(cL,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.POINTS,0,f.numParticles);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform1f(gl.getUniformLocation(pointShader,"uPointSize"),ps);gl.uniform1f(gl.getUniformLocation(pointShader,"uDisk"),1);gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);gl.vertexAttribPointer(pL,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,colBuffer);gl.vertexAttribPointer(cL,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.POINTS,0,f.numParticles);
    gl.disableVertexAttribArray(pL);gl.disableVertexAttribArray(cL);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
}

// MOUSE INTERACTION
var mouseMoving=false,mouseStillTimer=0;
function simCoords(cx,cy){var r=canvas.getBoundingClientRect();return{x:(cx-r.left)/cScale,y:(canvas.height-(cy-r.top))/cScale};}
function updateObstacle(x,y,reset){var f=scene.fluid,m=2*f.h;x=clamp(x,m,(f.fNumX-1)*f.h-m);y=clamp(y,m,(f.fNumY-1)*f.h-m);var vx=0,vy=0;if(!reset){vx=(x-scene.obstacleX)/scene.dt;vy=(y-scene.obstacleY)/scene.dt;var mg=Math.sqrt(vx*vx+vy*vy);if(mg>15){vx*=15/mg;vy*=15/mg;}}scene.obstacleX=x;scene.obstacleY=y;scene.obstacleVelX=vx;scene.obstacleVelY=vy;}
function clearObstacle(){scene.obstacleX=-10;scene.obstacleY=-10;scene.obstacleVelX=0;scene.obstacleVelY=0;mouseMoving=false;}

function handlePointerMove(e){
  var c=simCoords(e.clientX,e.clientY);
  if(!mouseMoving){updateObstacle(c.x,c.y,true);mouseMoving=true;}
  else{updateObstacle(c.x,c.y,false);}
  mouseStillTimer=0;
}

function checkMouseStill(dt){
  if(mouseMoving){
    mouseStillTimer+=dt;
    if(mouseStillTimer>0.15) clearObstacle();
  }
}

// RANDOM DRIFT BURSTS
function updateDriftEffect(dt){
  if(!scene.randomDrift)return; scene.driftTimer-=dt;
  if(!scene.driftActive&&scene.driftTimer<=0){if(Math.random()<0.003){scene.driftActive=true;scene.compensateDrift=true;scene.driftTimer=0.15+Math.random()*0.6;}}
  else if(scene.driftActive&&scene.driftTimer<=0){scene.driftActive=false;scene.compensateDrift=false;scene.driftTimer=5+Math.random()*12;}
}

// MAIN LOOP
var lastTime=performance.now(), stepsPerFrame=1;
function calcStepsPerFrame(){var a=simWidth/SIM_HEIGHT;stepsPerFrame=Math.max(1,Math.round(a/1.78));if(stepsPerFrame>3)stepsPerFrame=3;}

var animationFrame = 0;
function update(now){
  if (document.hidden) return;
  var dt=Math.min((now-lastTime)/1000,0.05);lastTime=now;
  updateDriftEffect(dt); checkMouseStill(dt);
  
  var speed=scene.speedMult, extraSteps, simDt;
  if(speed<=1){extraSteps=stepsPerFrame;simDt=scene.dt*speed;}
  else{var tot=stepsPerFrame*speed;extraSteps=Math.min(6,Math.max(1,Math.round(tot)));simDt=scene.dt*(tot/extraSteps);}
  
  var pI=Math.max(10,Math.round(scene.numPressureIters/extraSteps));
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for(var step=0;step<extraSteps;step++){
      scene.fluid.simulate(simDt,scene.gravity,scene.flipRatio,pI,scene.numParticleIters,scene.overRelaxation,scene.compensateDrift,scene.obstacleX,scene.obstacleY,scene.obstacleVelX,scene.obstacleVelY,scene.visThreshold,step<extraSteps-1);
    }
  }
  
  draw();
  animationFrame = requestAnimationFrame(update);
}

// INITIALIZE
function handleResize() { resize(); setupScene(); }
function handleVisibilityChange() {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
    clearObstacle();
  } else {
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(update);
  }
}
window.addEventListener("resize", handleResize);
window.addEventListener("pointermove", handlePointerMove, { passive: true });
document.addEventListener("visibilitychange", handleVisibilityChange);
setupScene();
animationFrame = requestAnimationFrame(update);

return function cleanupFluidBackground() {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("pointermove", handlePointerMove);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
};
}