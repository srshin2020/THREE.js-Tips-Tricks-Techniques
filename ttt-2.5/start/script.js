var scene, camera, renderer, clock, mixers, actions, mode;

init();

function init(){
  const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00aaff);
  
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(-1, 1, 6);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 2);
  light.position.set( 0, 1, 10);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(1,2,0);
  controls.update();
  
  mode = 'open';
  const btn = document.getElementById("btn");
  btn.addEventListener('click', function(e){
    if (actions !== undefined && actions.length>0){
      const btn = document.getElementById("btn");
      if (mode=="open"){
        actions.forEach( action => {
          action.timeScale = 1;
          action.reset();
          action.play();
        });
        mode = 'close';
        btn.innerHTML = 'Close Gates';
      }else{
        actions.forEach( action => {
          action.timeScale = -1;
          const clip = action.getClip();
          action.reset();
          action.time = clip.duration;
          action.play();
        });
        mode = 'open';
        btn.innerHTML = 'Open Gates';
      }
    }
  })
  
  //Load meshes here
  const loader = new THREE.GLTFLoader();
  loader.setPath(assetPath);
  loader.load('gate.glb', function(object){
    mixers = [];
    actions = [];
    
    scene.add(object.scen);
  });
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  const dt = clock.getDelta();
  if (mixers) mixers.forEach(mixer => mixer.update(dt));
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}