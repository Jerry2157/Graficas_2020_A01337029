let renderer = null, 
scene = null, 
camera = null,
cube = null,
sphere = null,
cone = null,
sphereGroup = null;
let pivots = [];
let canvas_ref = null;

let duration = 5000; // ms
let currentTime = Date.now();

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // Rotate the cube about its Y axis
    //cube.rotation.y += angle;

    // Rotate the sphere group about its Y axis
    // sphereGroup.rotation.y -= angle / 2;
    //sphere.rotation.x += angle;

    // Rotate the cone about its X axis (tumble forward)
    //cone.rotation.z += angle;

    for (i = 0; i < pivots.length; i++) {
        pivots[i].rotation.y -= angle / 2;
    }
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}
function myFunction(){
    console.log("funciona");
}
// Textures
let textureUrl = "../images/ash_uvgrid01.jpg";
let texture = new THREE.TextureLoader().load(textureUrl);
let material = new THREE.MeshPhongMaterial({ map: texture });

let figure_count = 0;
let sat_index = 0;

function AddObject(){
    let x = Math.floor((Math.random() * 10) + 1) - 6;
    let y = Math.floor((Math.random() * 8) + 1) - 5;
    let z = Math.floor((Math.random() * 5) + 1);
    if (figure_count == 0){
        // Cylinder

        // Create a group for the sphere
        cylinderGroup = new THREE.Object3D;
        figurePivotGroup = new THREE.Object3D;

        // Move the sphere group up and back from the cube
        cylinderGroup.position.set(x, y, -5);
        figurePivotGroup.position.set(x, y, -5);
        pivots.push(figurePivotGroup);

        // Create the sphere geometry
        geometry = new THREE.CylinderGeometry( 1, 1, 2, 8 );
        
        // And put the geometry and material together into a mesh
        cylinder = new THREE.Mesh(geometry, material);

        // Add the sphere mesh to our group
        cylinderGroup.add( cylinder );

        // Now add the group to our scene
        scene.add( cylinderGroup );
        scene.add( figurePivotGroup );
        addMouseHandler(canvas_ref,cylinderGroup, figurePivotGroup);

    }else if(figure_count == 1){
        // Icosaedro

        // Create a group for the sphere
        icosaedronGroup = new THREE.Object3D;
        figurePivotGroup = new THREE.Object3D;

        // Move the sphere group up and back from the cube
        icosaedronGroup.position.set(x, y, -5);
        figurePivotGroup.position.set(x, y, -5);
        pivots.push(figurePivotGroup);

        // Create the sphere geometry
        geometry = new THREE.IcosahedronGeometry( 1);
        
        // And put the geometry and material together into a mesh
        icosaedron = new THREE.Mesh(geometry, material);

        // Add the sphere mesh to our group
        icosaedronGroup.add( icosaedron );

        // Now add the group to our scene
        scene.add( icosaedronGroup );
        scene.add( figurePivotGroup );
        addMouseHandler(canvas_ref,icosaedronGroup, figurePivotGroup);
        

    }else if(figure_count == 2){
        // Torus Knot

        // Create a group for the sphere
        icosaedronGroup = new THREE.Object3D;
        figurePivotGroup = new THREE.Object3D;

        // Move the sphere group up and back from the cube
        icosaedronGroup.position.set(x, y, -5);
        figurePivotGroup.position.set(x, y, -5);
        pivots.push(figurePivotGroup);

        // Create the sphere geometry
        geometry = new THREE.TorusKnotGeometry( .5, .2, 100, 16 );
        
        // And put the geometry and material together into a mesh
        icosaedron = new THREE.Mesh(geometry, material);

        // Add the sphere mesh to our group
        icosaedronGroup.add( icosaedron );

        // Now add the group to our scene
        scene.add( icosaedronGroup );
        scene.add( figurePivotGroup );
        addMouseHandler(canvas_ref,icosaedronGroup, figurePivotGroup);
    }
    figure_count += 1;
    if (figure_count == 3){
        figure_count = 0;
    }
}

function AddSat(){
    // Create the cone geometry
    geometry = new THREE.SphereGeometry(.5,20,20);

    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    // Move the cone up and out from the sphere
    sphere.position.set(0, 0, 1.5);
        
    // Add the cone mesh to our group
    pivots[sat_index].add( sphere );

    sat_index += 1;
    addMouseHandler(canvas_ref,sphere);
    animate();
}

function Reset(){
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    canvas = canvas_ref;
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Create a group to hold all the objects
    let cubeGroup = new THREE.Object3D;
    
    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);
}

function createScene(canvas)
{    
    canvas_ref = canvas;
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Create a group to hold all the objects
    let cubeGroup = new THREE.Object3D;
    
    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    // Create the cube geometry
    let geometry = new THREE.CubeGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Tilt the mesh toward the viewer
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    cubeGroup.add( cube );

    cubeGroup.position.set(1, 0, -0.5);

    // Create a group for the sphere
    sphereGroup = new THREE.Object3D;
    cubeGroup.add(sphereGroup);
    
    // Move the sphere group up and back from the cube
    sphereGroup.position.set(0, 3, -4);

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(1, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    // Add the sphere mesh to our group
    sphereGroup.add( sphere );

    // Create the cone geometry
    geometry = new THREE.CylinderGeometry(0, .333, .444, 20, 5);

    // And put the geometry and material together into a mesh
    cone = new THREE.Mesh(geometry, material);

    // Move the cone up and out from the sphere
    cone.position.set(0, 0, 1.5);
        
    // Add the cone mesh to our group
    sphereGroup.add( cone );
    
    // Now add the group to our scene
    //scene.add( cubeGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, cubeGroup);
}