export interface WalkthroughScene {
  id: string;
  sceneNumber: number;
  timeRange: string;
  durationSeconds: number;
  title: string;
  aspectCovered: string;
  status: 'ready' | 'pending';
  frames?: [string, string];
  voiceoverEnglish: string;
  voiceoverUrdu: string;
  videoPrompt: string;
  cameraDirection: string;
  onScreenBeats: [string, string, string];
  proTip: string;
}

export const LESSON_1_WALKTHROUGH_SCENES: WalkthroughScene[] = [
  {
    id: 'l1_scene_01',
    sceneNumber: 1,
    timeRange: '00:00 – 00:12',
    durationSeconds: 12,
    title: 'Deep Micellar Cleanse & Skin Diagnosis',
    aspectCovered: 'Oil removal, clean bare canvas & identifying dry vs. oily zones',
    status: 'ready',
    frames: [
      '/src/assets/images/scene1_cleanse_wide_1795179938416.jpg',
      '/src/assets/images/scene1_cleanse_closeup_1795179941545.jpg',
    ],
    voiceoverEnglish:
      'Every flawless 16-hour bridal base begins with a spotless canvas. Gently sweep alcohol-free micellar water across the T-zone and cheeks to lift hidden oils while assessing dry patches before any product touches the skin.',
    voiceoverUrdu:
      'Har flawless 16-hour bridal base ki shuruat clean canvas se hoti hai. Alcohol-free micellar water ko soft cotton pad par lekar T-zone aur cheeks par halka sweep karein taake extra oil remove ho aur skin type clearly samajh aaye.',
    videoPrompt:
      '12-second cinematic 16:9 luxury bridal makeup tutorial video, 50mm lens, warm ivory and rose-gold studio. Seconds 0-6: medium shot of a professional female makeup artist gently cleansing a serene South Asian bride’s bare skin with a white cotton pad soaked in clear micellar water from a crystal bottle. Seconds 6-12: smooth slow-motion macro close-up glide across the bride’s cheekbone and nose bridge as the cotton pad sweeps gently upward, revealing fresh dewy natural skin texture, warm softbox key lighting, Vogue Beauty documentary style.',
    cameraDirection: 'Slow 50mm push-in (0–6s) → Macro cheek glide (6–12s)',
    onScreenBeats: [
      'Step 1 · Gently cleanse T-zone & cheeks with alcohol-free micellar water',
      'Assess skin texture: locate oily nose wings & dehydrated patches',
      'Result · Fresh, residue-free bare bridal canvas ready for hydration',
    ],
    proTip:
      'Never use harsh foaming wipes right before bridal makeup—micellar water removes sebum without stripping the moisture barrier.',
  },
  {
    id: 'l1_scene_02',
    sceneNumber: 2,
    timeRange: '00:12 – 00:24',
    durationSeconds: 12,
    title: 'Soothing Rosewater Mist & Balancing Essence',
    aspectCovered: 'pH balancing, calming redness & damping skin for deep serum absorption',
    status: 'pending',
    voiceoverEnglish:
      'Next, mist pure rosewater hydrosol eight inches away from the face. Pressing hydrating essence into slightly damp skin immediately calms redness and doubles the absorption of every skincare layer that follows.',
    voiceoverUrdu:
      'Ab face se aath inch door rakh kar pure rosewater mist spray karein. Halke geelay chehre par hydrating essence press karne se redness foran calm hoti hai aur agla serum double absorb hota hai.',
    videoPrompt:
      '12-second cinematic 16:9 luxury beauty tutorial, warm sunlit bridal salon. Seconds 0-6: slow-motion shot of fine luminous rosewater mist spraying in a delicate cloud from a rose-gold glass atomizer toward a smiling South Asian bride with closed eyes. Seconds 6-12: close-up of the makeup artist gently pressing hydrating essence into the bride’s temples and cheeks with clean fingertips, glistening hydrated micro-sheen, shallow depth of field, warm diffused studio glow.',
    cameraDirection: 'Slow-motion backlit mist spray (0–6s) → Fingertip press close-up (6–12s)',
    onScreenBeats: [
      'Step 2 · Hold rosewater mist 8 inches away for an even micro-veil',
      'Press hydrating essence gently into cheeks & forehead with clean palms',
      'Result · pH-balanced, calm skin primed for maximum hydration hold',
    ],
    proTip:
      'Always apply hyaluronic serum onto slightly damp misted skin—never bone-dry skin—to lock water inside the epidermis.',
  },
  {
    id: 'l1_scene_03',
    sceneNumber: 3,
    timeRange: '00:24 – 00:36',
    durationSeconds: 12,
    title: 'Hyaluronic Barrier Serum & 5-Min Massage',
    aspectCovered: 'Plumping fine lines, barrier locking & preventing foundation separation',
    status: 'pending',
    voiceoverEnglish:
      'Dispense three drops of hyaluronic barrier serum and glide upward along the cheekbones and smile lines. Follow with a lightweight ceramide moisturizer and peptide lip balm, letting everything settle for five full minutes.',
    voiceoverUrdu:
      'Teen drops hyaluronic barrier serum lekar cheekbones aur smile lines par upward massage karein. Phir lightweight ceramide moisturizer aur peptide lip balm lagayein aur poore 5 minute absorb hone dein taake base bilkul na phate.',
    videoPrompt:
      '12-second cinematic 16:9 beauty masterclass clip. Seconds 0-6: close-up of a glass dropper placing clear hyaluronic serum onto a makeup artist’s fingertips, then gliding upward along a South Asian bride’s cheekbones and smile lines in a relaxing lymphatic massage. Seconds 6-12: close-up applying glossy peptide lip balm with a disposable wand as the bride’s skin glows with plush glass-skin hydration, soft luxury vanity lights.',
    cameraDirection: 'Dropper macro shot (0–5s) → Upward massage & lip prep glide (5–12s)',
    onScreenBeats: [
      'Step 3 · Apply 3 drops hyaluronic serum with upward lymphatic sweeps',
      'Seal dry patches with ceramide cream + nourish lips with peptide balm',
      'Wait 5 minutes · Prevents foundation separation around nose & smile lines',
    ],
    proTip:
      'Rushing straight from moisturizer into primer is the #1 cause of pilling—use the 5-minute pause to organize brushes or start brows.',
  },
  {
    id: 'l1_scene_04',
    sceneNumber: 4,
    timeRange: '00:36 – 00:48',
    durationSeconds: 12,
    title: 'Zone-Specific Illuminating & Gripping Primer',
    aspectCovered: 'T-zone pore blurring vs. high-point bridal luminosity & 16-hour grip',
    status: 'pending',
    voiceoverEnglish:
      'Pro artists never use one primer everywhere. Press a pea-sized blurring primer strictly into the T-zone pores, then sweep an illuminating gripping primer over the outer cheeks for luminous, tear-proof bridal longevity.',
    voiceoverUrdu:
      'Pro makeup artists kabhi ek primer pooray chehre par nahi lagate. Pea-sized pore-blurring primer sirf T-zone par press karein, aur cheekbones par illuminating gripping primer lagayein taake base 16 ghante fresh aur glowing rahe.',
    videoPrompt:
      '12-second cinematic 16:9 luxury bridal makeup video. Seconds 0-6: close-up of makeup artist pressing silky translucent pore-blurring primer onto the sides of the bride’s nose and forehead center using gentle tapping motions. Seconds 6-12: applying champagne illuminating gripping primer across the high cheekbones with a sleek rose-gold synthetic brush, skin catching a soft pearlescent glow under warm studio lighting.',
    cameraDirection: 'T-zone tapping close-up (0–6s) → Cheekbone pearl-glow sweep (6–12s)',
    onScreenBeats: [
      'Step 4 · Zone-Prime: press pore-blurring primer strictly into the T-zone',
      'Sweep illuminating gripping primer across cheekbones & outer perimeter',
      'Wait 45 seconds · Let primer turn slightly tacky for maximum bridal grip',
    ],
    proTip:
      'Press—don’t rub—pore primer into enlarged pores around the nose so it fills micro-texture smoothly.',
  },
  {
    id: 'l1_scene_05',
    sceneNumber: 5,
    timeRange: '00:48 – 01:00',
    durationSeconds: 12,
    title: 'Precision Peach Under-Eye Color Correction',
    aspectCovered: 'Neutralizing dark circles & pigmentation around mouth without grey cast',
    status: 'pending',
    voiceoverEnglish:
      'Before foundation, neutralize blue or grey undertones using a whisper-thin veil of peach color corrector. Dot strictly where darkness sits under the inner eyes and around the mouth corners so foundation never turns ashy.',
    voiceoverUrdu:
      'Foundation se pehle under-eye dark circles aur mouth corners ki pigmentation par halka sa peach color corrector dot karein. Yeh grey ya ashy cast ko bilkul khatam kar deta hai aur base ko natural bright banata hai.',
    videoPrompt:
      '12-second cinematic 16:9 editorial bridal tutorial. Seconds 0-6: macro shot of a small synthetic precision brush picking up warm peach cream color corrector from a stainless palette and dotting tiny micro-layers directly onto the inner tear-trough darkness beneath a South Asian bride’s eyes. Seconds 6-12: delicate placement around the outer mouth corners, ultra-clean natural studio lighting, crisp depth of field.',
    cameraDirection: 'Stainless palette pickup (0–4s) → Inner under-eye micro-dotting (4–12s)',
    onScreenBeats: [
      'Step 5 · Pick up micro-thin peach corrector on a precision brush',
      'Target only true discoloration: inner under-eyes & mouth corners',
      'Rule · Less is more—sheer neutralization prevents cakey under-eyes',
    ],
    proTip:
      'Match corrector tone to skin depth: soft peach for light-to-medium tones, deeper warm orange for rich deep complexions.',
  },
  {
    id: 'l1_scene_06',
    sceneNumber: 6,
    timeRange: '01:00 – 01:12',
    durationSeconds: 12,
    title: 'Damp Beauty Sponge Pressing & Canvas Check',
    aspectCovered: 'Seamless corrector melting, crease check & foundation readiness',
    status: 'pending',
    voiceoverEnglish:
      'Finally, bounce the pointed tip of a damp teardrop beauty sponge gently over the peach corrector until the edges vanish. Inspect in natural daylight—your plump, balanced, illuminated bridal canvas is officially ready for foundation.',
    voiceoverUrdu:
      'Aakhir mein damp teardrop beauty sponge ki pointed tip se peach corrector ko halka bounce karke seamlessly blend karein. Natural light mein check karein—ab aapka smooth, plump aur glowing bridal canvas foundation ke liye 100% ready hai!',
    videoPrompt:
      '12-second cinematic 16:9 luxury bridal makeup finale shot. Seconds 0-6: close-up of a damp blush-pink teardrop beauty sponge softly bouncing with its tapered tip beneath the South Asian bride’s eyes, melting the peach corrector invisibly into luminous hydrated skin. Seconds 6-12: graceful slow pull-back revealing the bride’s radiant, even, dewy bare-prepped face smiling softly in warm studio sunlight, editorial beauty masterclass finish.',
    cameraDirection: 'Macro sponge bouncing (0–6s) → Radiant full-face reveal pull-back (6–12s)',
    onScreenBeats: [
      'Step 6 · Bounce damp teardrop sponge tip—never drag across corrector',
      'Check under-eyes & smile lines in natural daylight for zero creasing',
      'Complete · Plump, luminous bridal canvas ready for Lesson 2 Foundation!',
    ],
    proTip:
      'Squeeze your damp sponge inside a clean microfiber towel first—excess water dilutes corrector and breaks primer grip.',
  },
];
