export type AsanaId = 'tadasana' | 'parsva-sukhasana' | 'urdhva-hastasana' | 'ardha-matsyendrasana';
export type HoldSide = 'center' | 'left' | 'right';
export type Asana = {
  id: AsanaId; name: string; sanskrit: string; description: string; instructions: string[];
  targetSeconds: number; bilateral: boolean; manual: boolean; cameraHint: string;
  overview?: string; benefits?: string; trackingGraceMs?: number;
};

export const asanas: readonly Asana[] = [
  {
    id: 'tadasana', name: 'Tāḍāsana', sanskrit: 'ताडासन', description: 'Adapted Seated Mountain Pose',
    instructions: ['Sit on a stable chair with both feet resting on the floor.', 'Maintain a comfortable upright posture.',
      'Relax the shoulders.', 'Keep the head in a natural position.', 'Breathe normally.'],
    targetSeconds: 20, bilateral: false, manual: false,
    cameraHint: 'Place the camera level in front of you or beside you. Keep at least one shoulder, hip, knee and ankle in view.',
  },
  {
    id: 'parsva-sukhasana', name: 'Pārśva Sukhāsana', sanskrit: 'पार्श्व सुखासन', description: 'Adapted Seated Side Bend',
    instructions: ['Sit comfortably with feet supported.', 'Gently bend the torso toward the left.',
      'Hold without forcing the stretch.', 'Return to the center.', 'Repeat toward the right.'],
    targetSeconds: 15, bilateral: true, manual: false,
    cameraHint: 'Keep both shoulders and hips in view. If one side is hidden, angle the camera slightly toward your front. Stay seated. The camera checks the direction of your lean.',
  },
  {
    id: 'urdhva-hastasana', name: 'Ūrdhva Hastāsana', sanskrit: 'ऊर्ध्व हस्तासन',
    description: 'Seated Upward Salute',
    overview: 'Easy · A gentle seated posture with both arms raised and the torso comfortably upright.',
    benefits: 'Encourages shoulder mobility, upper-body flexibility, upright posture and body awareness.',
    instructions: ['Sit comfortably on a stable chair.', 'Keep both feet flat on the floor.',
      'Begin with both hands resting on your thighs.', 'Slowly raise both arms within a comfortable range.',
      'Keep your shoulders relaxed and elbows comfortably extended.', 'Hold while breathing naturally.',
      'Slowly lower both arms and relax.'],
    targetSeconds: 20, bilateral: false, manual: false, trackingGraceMs: 1000,
    cameraHint: 'Face the camera. Keep both shoulders, elbows and wrists in view, including when your arms are raised.',
  },
];

// Historical result validation and labels still need the original six alternating holds.
const retiredTwist: Asana = {
    id: 'ardha-matsyendrasana', name: 'Ardha Matsyendrāsana', sanskrit: 'अर्ध मत्स्येन्द्रासन',
    description: 'Adapted Seated Spinal Twist',
    instructions: ['Sit upright on a stable chair.', 'Slowly rotate the upper body to one side.',
      'Avoid forcing the movement.', 'Return to the center.', 'Repeat on the opposite side.'],
    targetSeconds: 15, bilateral: true, manual: false,
    cameraHint: 'Frame both shoulders, both hips and at least one knee. If one side is hidden, angle the camera slightly toward your front. Keep your hips facing forward and gently turn your chest toward the indicated side.',
};

export function findActiveAsana(id?: string | string[]) {
  return asanas.find(asana => asana.id === (Array.isArray(id) ? id[0] : id));
}
export function findAsana(id?: string | string[]) {
  return findActiveAsana(id) ?? ((Array.isArray(id) ? id[0] : id) === retiredTwist.id ? retiredTwist : undefined);
}
export function holdCount(asana: Asana) { return asana.bilateral ? 6 : 3; }
export function holdSide(asana: Asana, index: number): HoldSide {
  return asana.bilateral ? (index % 2 === 0 ? 'left' : 'right') : 'center';
}
export const yogaSafety = 'Use a stable chair and breathe naturally. Move within a comfortable range. Stop if you feel pain, dizziness or discomfort.';

export const timingOptions = [5, 10, 15, 20, 30, 45, 60];
export function selectedSeconds(value: string | undefined, fallback: number) {
  const seconds = Number(value);
  return timingOptions.includes(seconds) ? seconds : fallback;
}
