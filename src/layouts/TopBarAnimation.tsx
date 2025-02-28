import { useCallback } from 'react';
import Particles from 'react-particles';
import type { Container, Engine } from 'tsparticles-engine';
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from 'tsparticles-slim'; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
// import { curvesPathName } from "tsparticles-path-curves";
// import {MoveDirection, OutMode} from "tsparticles-engine";

const TopBarAnimation = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: true,
        fpsLimit: 60,
        autoPlay: true,
        detectRetina: true,
        name: 'Sea Anemone',
        emitters: {
          position: {
            x: 50,
            y: 50,
          },
          size: {
            width: 100,
            height: 100,
          },
          rate: {
            quantity: 10,
            delay: 0.1,
          },
        },
        particles: {
          number: {
            value: 60,
          },
          links: {
            distance: 100,
            enable: true,
            triangles: {
              enable: true,
              opacity: 0.01,
            },
          },
          move: {
            enable: true,
            speed: 3,
          },
          size: {
            value: 1,
          },
          /*shape: {
            type: "circle",
          },*/
        },
      }}
    />
  );
};

export default TopBarAnimation;
