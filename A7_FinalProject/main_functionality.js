var score = 0;
var lives = 3;

scene = new THREE.Scene();

world = new CANNON.World();

function createVirus(){
    
}

var isplaying = true;


let virus = [];
let virusMeshes = [];

setInterval(() => {
    // Create Bouncing Virus

    if(isplaying == true){
        console.log("new Virus");
    }
}, 1000);



var PointerLockControls = function ( camera, cannonBody ) {

    var eyeYPos = 2; // eyes are 2 meters above the ground
    var velocityFactor = 0.2;
    var jumpVelocity = 20;
    var scope = this;
    
    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );
    
    var yawObject = new THREE.Object3D();
    yawObject.position.y = 2;
    yawObject.add( pitchObject );
    
    var quat = new THREE.Quaternion();
    
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    
    var canJump = false;
    
    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0,1,0);
    cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;
    
        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if(contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is
    
        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            canJump = true;
    });
    
    var velocity = cannonBody.velocity;
    
    var PI_2 = Math.PI / 2;
    
    var onMouseMove = function ( event ) {
    
        if ( scope.enabled === false ) return;
    
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;
    
        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    };
    
    var onKeyDown = function ( event ) {
    
        switch ( event.keyCode ) {
    
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
    
            case 37: // left
            case 65: // a
                moveLeft = true; break;
    
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
    
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
    
            case 32: // space
                if ( canJump === true ){
                    velocity.y = jumpVelocity;
                }
                canJump = false;
                break;
        }
    
    };
    
    var onKeyUp = function ( event ) {
    
        switch( event.keyCode ) {
    
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
    
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
    
            case 40: // down
            case 83: // a
                moveBackward = false;
                break;
    
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
    
        }
    
    };
    
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    
    this.enabled = false;
    
    this.getObject = function () {
        return yawObject;
    };
    
    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1);
        quat.multiplyVector3(targetVec);
    }
    
    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function ( delta ) {
    
        if ( scope.enabled === false ) return;
    
        delta *= 0.1;
    
        inputVelocity.set(0,0,0);
    
        if ( moveForward ){
            inputVelocity.z = -velocityFactor * delta;
        }
        if ( moveBackward ){
            inputVelocity.z = velocityFactor * delta;
        }
    
        if ( moveLeft ){
            inputVelocity.x = -velocityFactor * delta;
        }
        if ( moveRight ){
            inputVelocity.x = velocityFactor * delta;
        }
    
        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);
    
        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;
    
        yawObject.position.copy(cannonBody.position);
    };
    };
    
    //########################
    // code start
    
    var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];
    
            var camera, scene, renderer;
            var geometry, material, mesh;
            var controls,time = Date.now();
    
            var blocker = document.getElementById( 'blocker' );
            var instructions = document.getElementById( 'instructions' );
    
            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    
            if ( havePointerLock ) {
    
                var element = document.body;
    
                var pointerlockchange = function ( event ) {
    
                    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
    
                        controls.enabled = true;
    
                        blocker.style.display = 'none';
    
                    } else {
    
                        controls.enabled = false;
    
                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';
    
                        instructions.style.display = '';
    
                    }
    
                }
    
                var pointerlockerror = function ( event ) {
                    instructions.style.display = '';
                }
    
                // Hook pointer lock state change events
                document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    
                document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
    
                instructions.addEventListener( 'click', function ( event ) {
                    instructions.style.display = 'none';
    
                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    
                    if ( /Firefox/i.test( navigator.userAgent ) ) {
    
                        var fullscreenchange = function ( event ) {
    
                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
    
                                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
    
                                element.requestPointerLock();
                            }
    
                        }
    
                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
    
                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
    
                        element.requestFullscreen();
    
                    } else {
    
                        element.requestPointerLock();
    
                    }
    
                }, false );
    
            } else {
    
                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    
            }
    
            initCannon();
            init();
            animate();
    
            function initCannon(){
                // Setup our world
                world.quatNormalizeSkip = 0;
                world.quatNormalizeFast = false;
    
                var solver = new CANNON.GSSolver();
    
                world.defaultContactMaterial.contactEquationStiffness = 1e9;
                world.defaultContactMaterial.contactEquationRelaxation = 4;
    
                solver.iterations = 7;
                solver.tolerance = 0.1;
                var split = true;
                if(split)
                    world.solver = new CANNON.SplitSolver(solver);
                else
                    world.solver = solver;
    
                world.gravity.set(0,-20,0);
                world.broadphase = new CANNON.NaiveBroadphase();
    
                // Create a slippery material (friction coefficient = 0.0)
                physicsMaterial = new CANNON.Material("slipperyMaterial");
                var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                                        physicsMaterial,
                                                                        0.0, // friction coefficient
                                                                        0.3  // restitution
                                                                        );
                // We must add the contact materials to the world
                world.addContactMaterial(physicsContactMaterial);
    
                // Create a sphere
                var mass = 5, radius = 1.3;
                sphereShape = new CANNON.Sphere(radius);
                sphereBody = new CANNON.Body({ mass: mass });
                sphereBody.addShape(sphereShape);
                sphereBody.position.set(0,5,0);
                sphereBody.linearDamping = 0.9;
                world.add(sphereBody);
    
                // Create a plane
                var groundShape = new CANNON.Plane();
                var groundBody = new CANNON.Body({ mass: 0 });
                groundBody.addShape(groundShape);
                groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
                world.add(groundBody);
            }
    
            function init() {
    
                camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
                
                scene.fog = new THREE.Fog( 0x000000, 0, 500 );
    
                var ambient = new THREE.AmbientLight( 0x111111 );
                scene.add( ambient );
    
                light = new THREE.SpotLight( 0xffffff );
                light.position.set( 10, 30, 20 );
                light.target.position.set( 0, 0, 0 );
                if(true){
                    light.castShadow = true;
    
                    light.shadow.camera.near = 20;
                    light.shadow.camera.far = 50;//camera.far;
                    light.shadow.camera.fov = 40;
    
                    light.shadowMapBias = 0.1;
                    light.shadowMapDarkness = 0.7;
                    light.shadow.mapSize.width = 2*512;
                    light.shadow.mapSize.height = 2*512;
    
                    //light.shadowCameraVisible = true;
                }
                scene.add( light );
    
    
    
                controls = new PointerLockControls( camera , sphereBody );
                scene.add( controls.getObject() );
    
                // floor
                geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
                geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    
                material = new THREE.MeshLambertMaterial( { color: 0xeeee00 } );
    
                mesh = new THREE.Mesh( geometry, material );
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add( mesh );
    
                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.shadowMap.enabled = true;
                renderer.shadowMapSoft = true;
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setClearColor( scene.fog.color, 1 );
    
                document.body.appendChild(renderer.domElement);
    
                window.addEventListener( 'resize', onWindowResize, false );
    
                // Add boxes
                var halfExtents = new CANNON.Vec3(1,1,1);
                var boxShape = new CANNON.Box(halfExtents);
                var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
                for(var i=0; i<1; i++){
                    var x = (Math.random()-0.5)*20;
                    var y = 1 + (Math.random()-0.5)*1;
                    var z = (Math.random()-0.5)*20;
                    var boxBody = new CANNON.Body({ mass: 5 });
                    boxBody.addShape(boxShape);
                    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
                    var boxMesh = new THREE.Mesh( boxGeometry, material2 );
                    world.add(boxBody);
                    scene.add(boxMesh);
                    boxBody.position.set(x,y,z);
                    boxMesh.position.set(x,y,z);
                    boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;
                    boxes.push(boxBody);
                    boxMeshes.push(boxMesh);
                }


                var loader = new THREE.GLTFLoader();

                loader.load( 'models/virus_1.glb', function ( gltf ) {

                    var halfExtents = new CANNON.Vec3(1,1,1);

                    var ballShape = new CANNON.Sphere(halfExtents);
                    var ballBody = new CANNON.Body({ mass: 1 });

                    ballBody.addShape(ballShape);
                    world.add(ballBody);
                    scene.add(gltf.scene);


                    virus.push(ballBody);
                    virusMeshes.push(gltf.scene);

                    ballBody.position.set(5,0,0);
                    gltf.scene.children[0].position.x = 10;
                    gltf.scene.children[0].position.y = 10;
                    gltf.scene.children[0].position.z = 0;

                }, undefined, function ( error ) {

                    console.error( error );

                } );
            }
    
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
    
            var dt = 1/60;
            function animate() {
                requestAnimationFrame( animate );
                if(controls.enabled){
                    world.step(dt);
    
                    // Update ball positions
                    for(var i=0; i<balls.length; i++){
                        ballMeshes[i].position.copy(balls[i].position);
                        ballMeshes[i].quaternion.copy(balls[i].quaternion);
                    }
    
                    // Update box positions
                    for(var i=0; i<boxes.length; i++){
                        boxMeshes[i].position.copy(boxes[i].position);
                        boxMeshes[i].quaternion.copy(boxes[i].quaternion);
                    }

                    // Update virus positions
                    try{
                        console.log("virs_length", virus.length);
                        for(var i=0; i<virus.length; i++){
                            virusMeshes[i].position.copy(virus[i].position);
                            virusMeshes[i].quaternion.copy(virus[i].quaternion);
                        }
                    }catch(err){

                    }
                }
    
                controls.update( Date.now() - time );
                renderer.render( scene, camera );
                time = Date.now();
    
            }
    
            var ballShape = new CANNON.Sphere(0.2);
            var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);

            var shootDirection = new THREE.Vector3();
            var shootVelo = 35;
            //var projector = new THREE.Projector();
            function getShootDir(targetVec){
                var vector = targetVec;
                targetVec.set(0,0,1);
                vector.unproject(camera);
                var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
                targetVec.copy(ray.direction);
            }
    
            window.addEventListener("click",function(e){
                if(controls.enabled==true){
                    var x = sphereBody.position.x;
                    var y = sphereBody.position.y;
                    var z = sphereBody.position.z;
                    var ballBody = new CANNON.Body({ mass: 1 });

                    // When a body collides with another body, they both dispatch the "collide" event.
                    ballBody.addEventListener("collide",function(e){
                        //console.log("The sphere just collided with the ground!");
                        //console.log("Collided with body:",e.body);
                        //console.log("e:", e.body.mass);
                        if(e.body.mass == 1){
                            e.body.position.set(-100,-100,-100);
                            ballBody.position.set(-100,-100,-100);
                            score += 1;
                            console.log("score", score);
                        }
                        //console.log("Contact between bodies:",e.contact);
                        //console.log("Contact between bodies:",e.contact);
                        //
                    });

                    ballBody.addShape(ballShape);
                    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
                    var ballMesh = new THREE.Mesh( ballGeometry, material2 );
                    world.add(ballBody);
                    scene.add(ballMesh);
                    ballMesh.castShadow = true;
                    ballMesh.receiveShadow = true;
                    balls.push(ballBody);
                    ballMeshes.push(ballMesh);
                    getShootDir(shootDirection);
                    ballBody.velocity.set(  shootDirection.x * shootVelo,
                                            shootDirection.y * shootVelo,
                                            shootDirection.z * shootVelo);
    
                    // Move the ball outside the player sphere
                    x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
                    y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
                    z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
                    ballBody.position.set(x,y,z);
                    ballMesh.position.set(x,y,z);
                }
            });