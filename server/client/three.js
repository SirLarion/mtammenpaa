import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const getBareFileName = (path) => path.split("\\").pop().split("/").pop();

function createThreeEnvironment() {
  const scene = new THREE.Scene();

  const fov = 30;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const skyColor = 0xb1e1ff;
  const groundColor = 0xb97a20;
  const intensity = 2.5;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    // Only use preserveDrawingBuffer in DEV mode
    preserveDrawingBuffer: DEV,
  });

  renderer.setPixelRatio(window.devicePixelRatio);

  return {
    scene,
    camera,
    renderer,
  };
}

function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // Slight angle from above
  camera.position.y += 10;
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

function normalizeObjectScale(obj) {
  const normalGeometry = new THREE.BoxGeometry(5, 5, 5);
  normalGeometry.computeBoundingBox();

  let normalSize = new THREE.Vector3();
  let objSize = new THREE.Vector3();
  normalGeometry.boundingBox.getSize(normalSize);
  new THREE.Box3().setFromObject(obj).getSize(objSize);

  const ratio = normalSize.divide(objSize);
  const maxComponent = Math.max(ratio.x, ratio.y, ratio.z);
  const { x, y, z } = obj.scale.multiplyScalar(maxComponent);

  obj.scale.set(x, y, z);
}

function addSaveLink(renderer) {
  var saveLink = document.createElement("a");
  saveLink.id = "three-save";
  saveLink.href = "#";
  saveLink.innerHTML =
    '\
    <svg width="24px" height="24px" stroke-width="2" viewBox="0 0 24 24" fill="none" \
      xmlns="http://www.w3.org/2000/svg" color="#000000"> \
  <path \
    d="M3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z" \
    stroke="#000000" stroke-width="2"></path> \
  <path \
    d="M8.6 9H15.4C15.7314 9 16 8.73137 16 8.4V3.6C16 3.26863 15.7314 3 15.4 3H8.6C8.26863 3 8 3.26863 8 3.6V8.4C8 8.73137 8.26863 9 8.6 9Z" \
    stroke="#000000" stroke-width="2"></path> \
  <path d="M6 13.6V21H18V13.6C18 13.2686 17.7314 13 17.4 13H6.6C6.26863 13 6 13.2686 6 13.6Z" \
    stroke="#000000" stroke-width="2"></path> \
</svg>';

  saveLink.addEventListener("click", () => {
    try {
      const strMime = "image/png";
      const strDownloadMime = "image/octet-stream";

      const imgData = renderer.domElement.toDataURL(strMime);
      const strData = imgData.replace(strMime, strDownloadMime);
      const filename = "test.png";

      saveLink.download = filename;
      saveLink.href = strData;
    } catch (e) {
      console.log(e);
      return;
    }
  });
  renderer.domElement.before(saveLink);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }

  return needResize;
}

function renderFrame({ scene, camera, renderer }) {
  renderer.render(scene, camera);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

function render(envs) {
  envs.forEach(renderFrame);

  requestAnimationFrame(() => render(envs));
}

function createAndRegisterEnvs() {
  const loader = new GLTFLoader();

  const material = new THREE.MeshPhongMaterial({
    color: DEV ? "#252525" : `hsl(${HUE}, 70%, ${DARK_MODE ? 20 : 10}%)`,
  });

  const envs = GEOMETRY_FILES.map((file) => {
    const { scene, camera, renderer } = createThreeEnvironment();

    loader.load(
      file,
      (model) => {
        const object = model.scene;
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = material;
          }
        });
        normalizeObjectScale(object);
        scene.add(object);

        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(object);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        const color = 0xffffff;
        const intensity = 2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-3, 10, 6);
        light.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        scene.add(light);
        scene.add(light.target);

        // set the camera to frame the box
        frameArea(boxSize, boxSize, boxCenter, camera);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(boxCenter.x, boxCenter.y, boxCenter.z);
        controls.update();
      },
      undefined,
      console.error,
    );

    let picture = document.getElementById(getBareFileName(file));
    picture.className = "floating";
    picture.after(renderer.domElement);
    renderFrame({ scene, camera, renderer });

    setTimeout(() => {
      picture.className = "floating transparent";
      setTimeout(() => picture.remove(), 100);
    }, 200);

    if (DEV) {
      addSaveLink(renderer);
    }

    return { scene, camera, renderer };
  });
  GEOMETRY_FILES = [];

  requestAnimationFrame(() => render(envs));
}

createAndRegisterEnvs();

// Rerender THREE environments when doing HTMX partial loads
document.addEventListener("htmx:afterSettle", () => {
  if (GEOMETRY_FILES.length === 0) {
    return;
  }

  createAndRegisterEnvs();
});
