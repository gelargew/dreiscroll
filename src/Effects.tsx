import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { extend } from "@react-three/fiber";

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={2} luminanceThreshold={0.8} luminanceSmoothing={0} />
      <Noise premultiply />
    </EffectComposer>
  );
}
