let cubes = [];
let cyl;
let plane;
let planey;
let sphereAttractor;
let movers =[]

function setupThree(){
    sphereAttractor = new Attractor(0,0,0);
    for (i=0; i <500; i++){
        movers.push(new Mover());
    }
    //sphereAttractor.display();
    // for (i=0; i < Math.random(20)+ 10; i++){
    //     cubes[i] = getBox();
    // }
    
     //cyl = getCylinder();
     plane = getPlane();
     plane.rotation.x = -0.5 * Math.PI;
     plane.position.z = 40;
     plane.position.x = 40;
     plane.position.y = -40;

     planey = getPlane();
     //planey.rotation.z = -0.5 * Math.PI;
     planey.position.z = -100;
     planey.position.x = 40;
     planey.position.y = 80;

    //cube.position.x;
    //cube.rotation.x;
    //cube.scale.set(10, 1, 1);
    //cube.scale.x;

   
}

function updateThree(){
    //loop
    sphereAttractor.move()

    for (i=0; i<movers.length; i++){
        movers[i].attract(sphereAttractor.sphere);
        movers[i].move();
    }

}

function getBox(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshLambertMaterial({color: 0xffffff});
    const mesh = new THREE.Mesh( geometry, material );

    // position the cube randomly in the scene
    mesh.position.x = -60 + Math.round((Math.random() * 100));
    mesh.position.y = Math.round((Math.random() * 100));
    mesh.position.z = -100 + Math.round((Math.random() * 150));

    scene.add( mesh );

    return mesh;
}

function getCylinder(){
    const geometry = new THREE.CylinderGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    return mesh;
}

function getSphere(){
    const geometry = new THREE.SphereGeometry( 1, 20, 20);
    const material = new THREE.MeshNormalMaterial( { color: 0xffffff, wireframe: false } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    return mesh;
}

function getPlane(){
    const geometry = new THREE.PlaneGeometry(200, 300);
    const material = new THREE.MeshPhongMaterial({color: 0xffffff});
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    return mesh;
}

function getPointLight(){

// add spotlight for the shadows
    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    // scene.add( spotLight );

    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 100;
    scene.add(pointLight);

    return pointLight;
}

class Attractor{
    constructor(x, y, z){
        // this.pos = new THREE.Vector3(x, y, z);
        // this.vel = new THREE.Vector3(0, 0, 0);
        // this.acc = new THREE.Vector3(0, 0, 0);
        this.sphere = getSphere();
        this.pointLight = getPointLight();
        this.mass = 1;
        this.speed = 0.001;
        this.range = 10;
    }

    move(){

        let x = cos(frameCount * 1 * this.speed)*6*this.range;
        let y = sin(frameCount * 2 * this.speed)*3*this.range;
        let z = sin(frameCount * 4 * this.speed)*5*this.range;

        this.sphere.position.x = x;
        this.sphere.position.y = y;
        this.sphere.position.z = z;

        this.pointLight.position.x = x;
        this.pointLight.position.y = y;
        this.pointLight.position.z = z;
        //z += 0.1;
        

        //return this.pos.x;
      }
      
}

class Mover{
    constructor(x, y, z){
        this.box = getBox();
        this.vel = new THREE.Vector3(0, 0, 0);
        this.acc = new THREE.Vector3(0, 0, 0);
        this.mass = 1 + Math.random(10);
    }

    move(){
        this.vel.add(this.acc);
        let min = new THREE.Vector3(0.2,0.2,0.2);
        let max = new THREE.Vector3(-0.2,-0.2,-0.2);
        this.vel.min(min);
        this.vel.max(max);
        //this.vel.limit(0.2);
        this.box.position.add(this.vel);
        this.acc.multiplyScalar(0.60);
    }

    applyforce(f){
        let force = new THREE.Vector3();
        force = f;
        force.divideScalar(this.mass);
        this.acc.add(force);

    }

    attract(a){
        let force = new THREE.Vector3();
        force.subVectors(a.position, this.box.position);
        force.normalize();
        force.multiplyScalar(0.001);
        this.applyforce(force);
    }
}

let scene, camera, container, renderer;
let controls;
let frame = 0;
let time;
let axes;


function initThree(){
    //scene
    scene = new THREE.Scene();

    //canera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 200;

    // show axes in the screen
    axes = new THREE.AxesHelper(50);
    //scene.add(axes);

     // add subtle ambient lighting
     var ambiColor = "#666464";
     var ambientLight = new THREE.AmbientLight(ambiColor);
     scene.add(ambientLight);

    //renderer
    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setSize(400,400);

    //orbitcontrols
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    //container
    container = document.getElementById("container-three");
    container.appendChild( renderer.domElement );


    var controls = new function () {
        this.ambientColor = "#666464";
        this.pointColor = "#ccffcc";
        this.intensity = 1;
        this.distance = 100;
        this.attractorSpeed = 0.001;
        this.attractorRange = 10;
    };

    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
        sphereAttractor.pointLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
        sphereAttractor.pointLight.intensity = e;
    });

    gui.add(controls, 'distance', 0, 200).onChange(function (e) {
        sphereAttractor.pointLight.distance = e;
    });

    gui.add(controls, 'attractorSpeed', 0, 0.02).onChange(function (e) {
        sphereAttractor.speed = e;
    });

    gui.add(controls, 'attractorRange', 1, 20).onChange(function (e) {
        sphereAttractor.range = e;
    });

    setupThree();

    animate();
}

function animate() {

    //javascript window.requestAnimationFrame
	requestAnimationFrame(animate );

    frame++;
    time = performance.now();
    updateThree();

	renderer.render(scene, camera );
}



