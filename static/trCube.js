var gl;

function testGLError(functionLastCalled) {

    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }

    return true;
}

function initialiseGL(canvas) {
    try {
 // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return true;
}

var shaderProgram;

function initialiseBuffer() {
		
    var vertexData = [
		-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,//3
        0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,//1
		0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,//2
				
		-0.5, 0.5, 0.5,		1.0, 1.0, 1.0, 0.5,		0.0, 1.0,//3
		0.5, 0.5, -0.5,		1.0, 1.0, 1.0, 0.5,		1.0, 1.0,//2
		-0.5, 0.5, -0.5,	1.0, 1.0, 1.0, 0.5,		0.0, 1.0,//4
		 
		0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		1.0, 1.0,//2
		0.5, -0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		1.0, 0.0,//6
		-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		0.0, 0.0,//8
		   
		-0.5, 0.5, -0.5,	0.0, 0.0, 0.0, 0.5,		0.0, 1.0,//4
		0.5, 0.5, -0.5,		0.0, 0.0, 0.0, 0.5,		1.0, 1.0,//2
		-0.5,-0.5,-0.5,		0.0, 0.0, 0.0, 0.5,		0.0, 0.0,//8
			
		0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,//5
		0.5, -0.5, -0.5,	1.0, 0.5, 0.0, 0.5,		0.0, 1.0,//6
		0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,//2

		0.5, -0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		0.0, 1.0,//5
		0.5, 0.5, -0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,//2
		0.5, 0.5, 0.5,		1.0, 0.5, 0.0, 0.5,		1.0, 1.0,//1
				 
		-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,//4
		-0.5,-0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,//8
		-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,//7
		
		-0.5, 0.5, 0.5,		1.0, 0.0, 0.0, 0.5,		0.0, 1.0,//3
		-0.5, 0.5, -0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 1.0,//4
		-0.5, -0.5, 0.5,	1.0, 0.0, 0.0, 0.5,		0.0, 0.0,//7
		
		-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		0.0, 0.0,//7
		0.5, -0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		1.0, 0.0,//5
		0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		1.0, 1.0,//1
				 
		-0.5, -0.5, 0.5,	0.0, 0.0, 1.0, 0.5,		0.0, 0.0,//7
		0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		1.0, 1.0,//1
		-0.5, 0.5, 0.5,		0.0, 0.0, 1.0, 0.5,		0.0, 1.0,//3
		
		 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,//6
		 0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,//5
		-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,//7
		
		-0.5,-0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,//8
		 0.5, -0.5, -0.5,	0.0, 1.0, 0.0, 0.5,		1.0, 0.0,//6
		-0.5, -0.5, 0.5,	0.0, 1.0, 0.0, 0.5,		0.0, 0.0,//7
    ];
	
    // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();
    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
			varying mediump vec4 color; \
			void main(void) \
			{ \
				gl_FragColor = 1.0 * color;\
			}';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    var vertexShaderSource = '\
			attribute highp vec3 myVertex; \
			attribute highp vec4 myColor; \
			attribute highp vec2 myUV; \
			uniform mediump mat4 Pmatrix; \
			uniform mediump mat4 Vmatrix; \
			uniform mediump mat4 Mmatrix; \
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
                gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
                /*if (gl_Position.w != 0.0) \
                    gl_Position.x = (gl_Position.x/gl_Position.w + 1.0 )*gl_Position.w; \
                else gl_Position.x+=0.0; */\
				color = myColor;\
				texCoord = myUV; \
			}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();

    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
	gl.bindAttribLocation(gl.programObject, 2, "myUV");

    // Link the program
    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

// FOV, Aspect Ratio, Near, Far 
function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
    	0.5/ang, 0 , 0, 0,
        0, 0.5*a/ang, 0, 0,
        0, 0, -(zMax+zMin)/(zMax-zMin), -1,
        0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 ];
}
			
var proj_matrix = get_projection(30, 1.0, 1, 10.0);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
// translating z

view_matrix[14] = view_matrix[14]-3.2;//zoom

function idMatrix(m) {
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0; 
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0; 
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0; 
    m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1; 
}

function mulStoreMatrix(r, m, k) {
    m0=m[0];m1=m[1];m2=m[2];m3=m[3];m4=m[4];m5=m[5];m6=m[6];m7=m[7];
    m8=m[8];m9=m[9];m10=m[10];m11=m[11];m12=m[12];m13=m[13];m14=m[14];m15=m[15];
    k0=k[0];k1=k[1];k2=k[2];k3=k[3];k4=k[4];k5=k[5];k6=k[6];k7=k[7];
    k8=k[8];k9=k[9];k10=k[10];k11=k[11];k12=k[12];k13=k[13];k14=k[14];k15=k[15];

    a0 = k0 * m0 + k3 * m12 + k1 * m4 + k2 * m8;
    a4 = k4 * m0 + k7 * m12 + k5 * m4 + k6 * m8 ;
    a8 = k8 * m0 + k11 * m12 + k9 * m4 + k10 * m8 ;
    a12 = k12 * m0 + k15 * m12 + k13 * m4 + k14 * m8;

    a1 = k0 * m1 + k3 * m13 + k1 * m5 + k2 * m9;
    a5 = k4 * m1 + k7 * m13 + k5 * m5 + k6 * m9;
    a9 = k8 * m1 + k11 * m13 + k9 * m5 + k10 * m9;
    a13 = k12 * m1 + k15 * m13 + k13 * m5 + k14 * m9;

    a2 = k2 * m10 + k3 * m14 + k0 * m2 + k1 * m6;
    a6 =  k6 * m10 + k7 * m14 + k4 * m2 + k5 * m6;
    a10 =  k10 * m10 + k11 * m14 + k8 * m2 + k9 * m6;
    a14 = k14 * m10 + k15 * m14 + k12 * m2 + k13 * m6; 

    a3 = k2 * m11 + k3 * m15 + k0 * m3 + k1 * m7;
    a7 = k6 * m11 + k7 * m15 + k4 * m3 + k5 * m7;
    a11 = k10 * m11 + k11 * m15 + k8 * m3 + k9 * m7;
    a15 = k14 * m11 + k15 * m15 + k12 * m3 + k13 * m7;

    r[0]=a0; r[1]=a1; r[2]=a2; r[3]=a3; r[4]=a4; r[5]=a5; r[6]=a6; r[7]=a7;
    r[8]=a8; r[9]=a9; r[10]=a10; r[11]=a11; r[12]=a12; r[13]=a13; r[14]=a14; r[15]=a15;
}

function mulMatrix(m,k)
{
	mulStoreMatrix(m,m,k);
}

function translate(m, tx,ty,tz) {
   var tm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
   tm[12] = tx; tm[13] = ty; tm[14] = tz; 
   mulMatrix(m, tm); 
}

function scale(m, sx,sy,sz) {
    var tm = [sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]; 
    mulMatrix(m, tm); 
 }

function rotateX(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[5] = c;  rm[6] = s; 
	rm[9] = -s;  rm[10] = c;
	mulMatrix(m, rm); 
}

function rotateY(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[0] = c;  rm[2] = -s;
	rm[8] = s;  rm[10] = c; 
	mulMatrix(m, rm); 
}

function rotateZ(m, angle) {
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
    var s = Math.sin(angle);

	rm[0] = c;  rm[1] = s;
	rm[4] = -s;  rm[5] = c; 
	mulMatrix(m, rm); 
}

function normalizeVec3(v)
{
	sq = v[0]*v[0] + v[1]*v[1] + v[2]*v[2]; 
	sq = Math.sqrt(sq);
	if (sq < 0.000001 ) // Too Small
		return -1; 
	v[0] /= sq; v[1] /= sq; v[2] /= sq; 
}

function rotateArbAxis(m, angle, axis)
{
	var axis_rot = [0,0,0];
	var ux, uy, uz;
	var rm = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; 
    var c = Math.cos(angle);
	var c1 = 1.0 - c; 
    var s = Math.sin(angle);
	axis_rot[0] = axis[0]; 
	axis_rot[1] = axis[1]; 
	axis_rot[2] = axis[2]; 
	if (normalizeVec3(axis_rot) == -1 )
		return -1; 
	ux = axis_rot[0]; uy = axis_rot[1]; uz = axis_rot[2];
	console.log("Log", angle);
	rm[0] = c + ux * ux * c1;
	rm[1] = uy * ux * c1 + uz * s;
	rm[2] = uz * ux * c1 - uy * s;
	rm[3] = 0;

	rm[4] = ux * uy * c1 - uz * s;
	rm[5] = c + uy * uy * c1;
	rm[6] = uz * uy * c1 + ux * s;
	rm[7] = 0;

	rm[8] = ux * uz * c1 + uy * s;
	rm[9] = uy * uz * c1 - ux * s;
	rm[10] = c + uz * uz * c1;
	rm[11] = 0;

	rm[12] = 0;
	rm[13] = 0;
	rm[14] = 0;
	rm[15] = 1;

	mulMatrix(m, rm);
}

rotValue = 0.0; 
animRotValue = 0.0;
save_animRotValue=0.0;
transX = 0.0;
transY = 0.0;
transZ = 0.0;
frames = 1;
tramount = 0.01;
rotamount = 0.01;
currot=0.0;
save_currot=0.0;
function RotAmountinc(){
    rotamount += 0.01;
    document.getElementById("webRotAmount").innerHTML = "RotationAmount : " + rotamount.toFixed(4);
}

function RotAmountdec(){
    if(rotamount>0.01)
        rotamount -= 0.01;
    document.getElementById("webRotAmount").innerHTML = "RotationAmount : " + rotamount.toFixed(4);
}

function animRotateinc()
{
    animRotValue += rotamount;
    currot+=rotamount;
    document.getElementById("rv").innerHTML = "Current Rotate Speed : " + currot.toFixed(4);
}

function animRotatedec()
{
    animRotValue -= rotamount;
    currot-=rotamount;
    document.getElementById("rv").innerHTML = "Current Rotate Speed : " + currot.toFixed(4);
}


function animPause()
{
    save_animRotValue=animRotValue;
    save_currot=currot;
    currot=0;
    document.getElementById("rv").innerHTML = "Current Rotate Speed : " + currot.toFixed(4);
    animRotValue = 0;
    
}

function animResume()
{
    if(animRotValue==0){
        animRotValue=save_animRotValue;
        currot=save_currot;
        document.getElementById("rv").innerHTML = "Current Rotate Speed : " + currot.toFixed(4);
    }
}

function TrAmountinc(){
    tramount += 0.01;
    document.getElementById("webTrAmount").innerHTML = "TranslateAmount : " + tramount.toFixed(4);
}

function TrAmountdec(){
    if(tramount>0.01)
        tramount -= 0.01;
    document.getElementById("webTrAmount").innerHTML = "TranslateAmount : " + tramount.toFixed(4);
}

function trXinc()
{
	transX += tramount;
	document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
}

function trYinc()
{
	transY += tramount;
	document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
}

function trZinc()
{
	transZ += tramount;
	document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
}

function trXdec()
{
	transX -= tramount;
	document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
}

function trYdec()
{
	transY -= tramount;
	document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
}

function trZdec()
{
	transZ -= tramount;
	document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
}

function transreset()
{
    transX = 0.0;
    transY = 0.0;
    transZ = 0.0;
    tramount = 0.01;
    document.getElementById("webTrAmount").innerHTML = "TranslateAmount : " + tramount.toFixed(4);
    document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
    document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
    document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
}

function rotreset()
{
    rotValue = 0.0; 
    animRotValue = 0.0;
    save_animRotValue=0.0;
    rotamount = 0.01;
    currot=0.0;
    save_currot=0.0;
    document.getElementById("rv").innerHTML = "Current Rotate Speed : " + currot.toFixed(4);
    document.getElementById("webRotAmount").innerHTML = "RotationAmount : " + rotamount.toFixed(4);
    document.getElementById("webTrAmount").innerHTML = "TranslateAmount : " + tramount.toFixed(4);
}

function reset(){
    rotValue = 0.0; 
    animRotValue = 0.0;
    save_animRotValue=0.0;
    transX = 0.0;
    transY = 0.0;
    transZ = 0.0;
    tramount = 0.01;
    rotamount = 0.01;
    currot=0.0;
    save_currot=0.0;
    document.getElementById("rv").innerHTML = "Current Rotate Speed : " + currot.toFixed(4);
    document.getElementById("webRotAmount").innerHTML = "RotationAmount : " + rotamount.toFixed(4);
    document.getElementById("webTrAmount").innerHTML = "TranslateAmount : " + tramount.toFixed(4);
    document.getElementById("webTrX").innerHTML = "transX : " + transX.toFixed(4);
    document.getElementById("webTrY").innerHTML = "transY : " + transY.toFixed(4);
    document.getElementById("webTrZ").innerHTML = "transZ : " + transZ.toFixed(4);
    document.getElementById("matrix0").innerHTML = mov_matrix[0].toFixed(4);
	document.getElementById("matrix1").innerHTML = mov_matrix[1].toFixed(4);
	document.getElementById("matrix2").innerHTML = mov_matrix[2].toFixed(4);
	document.getElementById("matrix3").innerHTML = mov_matrix[3].toFixed(4);
	document.getElementById("matrix4").innerHTML = mov_matrix[4].toFixed(4);
	document.getElementById("matrix5").innerHTML = mov_matrix[5].toFixed(4);
	document.getElementById("matrix6").innerHTML = mov_matrix[6].toFixed(4);
	document.getElementById("matrix7").innerHTML = mov_matrix[7].toFixed(4);
	document.getElementById("matrix8").innerHTML = mov_matrix[8].toFixed(4);
	document.getElementById("matrix9").innerHTML = mov_matrix[9].toFixed(4);
	document.getElementById("matrix10").innerHTML = mov_matrix[10].toFixed(4);
	document.getElementById("matrix11").innerHTML = mov_matrix[11].toFixed(4);
	document.getElementById("matrix12").innerHTML = mov_matrix[12].toFixed(4);
	document.getElementById("matrix13").innerHTML = mov_matrix[13].toFixed(4);
	document.getElementById("matrix14").innerHTML = mov_matrix[14].toFixed(4);
	document.getElementById("matrix15").innerHTML = mov_matrix[15].toFixed(4);
}

function renderScene() {

    //console.log("Frame "+frames+"\n");
    frames += 1 ;
    //document.getElementById("frame").innerHTML = "frame : "+frames;
	rotAxis = [1,1,0];

    var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");
	
    idMatrix(mov_matrix); 
	//rotateArbAxis(mov_matrix, rotValue, rotAxis);
    //rotValue += animRotValue; 
    //translate(mov_matrix, transX, 0.0, 0.0); 

    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    //gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
	gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);


    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL); 
	// gl.enable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.blendEquation(gl.FUNC_ADD);

    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    gl.clearDepth(1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    idMatrix(mov_matrix);
    translate(mov_matrix, transX, transY, transZ);
    rotateArbAxis(mov_matrix, rotValue, rotAxis);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    var mov_matrix_save = mov_matrix.slice();

    //1st moon
    
    translate(mov_matrix, -0.75, 0.75, 0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateY(mov_matrix,rotValue*2);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //2nd moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, 0.75, -0.75, 0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateZ(mov_matrix,rotValue*3);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //3rd moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, 0.75, 0.75, -0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateX(mov_matrix,rotValue*3);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //4th moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, -0.75, -0.75, 0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateY(mov_matrix,rotValue*4);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //5th moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, -0.75, 0.75, -0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateZ(mov_matrix,rotValue*5);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //6th moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, 0.75, -0.75, -0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateY(mov_matrix,rotValue*7);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //7th moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, -0.75, -0.75, -0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateZ(mov_matrix,rotValue*4);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //8th moon
    mov_matrix=mov_matrix_save.slice();
    translate(mov_matrix, 0.75, 0.75, 0.75); 
    scale(mov_matrix,0.25,0.25,0.25);
    rotateX(mov_matrix,rotValue*0.5);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    rotValue += animRotValue; 
    //mov_matrix=mov_matrix_save.slice();
    document.getElementById("matrix0").innerHTML = mov_matrix[0].toFixed(4);
	document.getElementById("matrix1").innerHTML = mov_matrix[1].toFixed(4);
	document.getElementById("matrix2").innerHTML = mov_matrix[2].toFixed(4);
	document.getElementById("matrix3").innerHTML = mov_matrix[3].toFixed(4);
	document.getElementById("matrix4").innerHTML = mov_matrix[4].toFixed(4);
	document.getElementById("matrix5").innerHTML = mov_matrix[5].toFixed(4);
	document.getElementById("matrix6").innerHTML = mov_matrix[6].toFixed(4);
	document.getElementById("matrix7").innerHTML = mov_matrix[7].toFixed(4);
	document.getElementById("matrix8").innerHTML = mov_matrix[8].toFixed(4);
	document.getElementById("matrix9").innerHTML = mov_matrix[9].toFixed(4);
	document.getElementById("matrix10").innerHTML = mov_matrix[10].toFixed(4);
	document.getElementById("matrix11").innerHTML = mov_matrix[11].toFixed(4);
	document.getElementById("matrix12").innerHTML = mov_matrix[12].toFixed(4);
	document.getElementById("matrix13").innerHTML = mov_matrix[13].toFixed(4);
	document.getElementById("matrix14").innerHTML = mov_matrix[14].toFixed(4);
	document.getElementById("matrix15").innerHTML = mov_matrix[15].toFixed(4);
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");
    console.log("Start");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (
	function () {
        //	return window.requestAnimationFrame || window.webkitRequestAnimationFrame 
	//	|| window.mozRequestAnimationFrame || 
	   	return function (callback) {
			    // console.log("Callback is"+callback); 
			    window.setTimeout(callback, 10, 10); };
    })();

    (function renderLoop(param) {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
