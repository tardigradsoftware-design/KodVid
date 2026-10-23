# Toolbox: use the best tool for each part, and offer it

The goal is the most mind-blowing result, not "everything drawn by Opus". Opus is the director and the renderer: it writes the plan, the timing, the code, the motion, the type, the compositing and the self-review. It is weak at photoreal images, faces, painterly likeness detail, music and voice. For those, bring in specialist tools.

## Illustrated styles are code-only by nature. Real-looking films are not.

Pitch the route that makes the best film first, with its price, then the best free one (SKILL.md step 3). The table below says where code alone is the best look, not where it is the cheap fallback.

Opus 5.5 is an excellent **illustrator**: watercolor characters, flat and stylized-3D cartoons, typography, diagrams, UI, particles, light, motion. Most of the strongest references used **no images at all** (a P(doom) music video, a kinetic lyric video, a title-sequence reel, a product explainer, a wordless short), and "no images, every frame drawn in code" is part of the wow. What it can't do well is **photorealism**: real photos, real faces, realistic footage.

| Style | Default | When to add a model |
|---|---|---|
| Watercolor character | code-only | only if the user wants a specific real person's likeness beyond a cartoon |
| Clean kinetic explainer | code-only (the mascot can be drawn in code and dithered) | a photo-based mascot or real product photos |
| Dark premium explainer | code-only | rarely |
| Broadcast title sequence | code-only | real logos or photos of people in the lineup |
| Kinetic lyric video | code-only | never needed |
| Cinematic animated short | code-only | rarely |
| Image-to-game cinematic | **model images** (that's the premise) | always |
| Editorial HUD film | **model footage** (photoreal is the premise) | always |

Music is different: code can't make it, so Suno is worth offering for most films (or the user brings a track). Sound effects ARE code now: `scripts/sfx.mjs` synthesizes hits, whooshes, UI ticks, risers and impacts deterministically and places them frame-exactly (audio.md); ElevenLabs stays for voice, announcers and organic one-offs.

Understand what the user wants before proposing tools: "a cartoon of my family" is code; "my family, looking like us, in a Pixar-style film" may want model-made character sheets. When unsure, pitch both with their ceilings and let the person choose.

**Offer, never assume.** Not every user has these subscriptions, and credits cost money. At the pitch step, show an **asset plan**: for each asset the film needs, the options (code-only, free route, paid route with a cost estimate), and your recommendation. The user picks. Never spend credits without an explicit yes on the number.

## What each tool is for

| Need | Best tool | Cost notes |
|---|---|---|
| Photoreal or painterly images, character sheets, pose sheets, sets, moodboards, a real person's likeness | **Nano Banana (Pro / 2.5) in the Higgsfield web UI** | Free and unlimited on a Higgsfield plan only in the **web UI** with the **Unlimited** toggle ON. The Higgsfield MCP/API bills ~1 credit per image. If the user is logged in, you can drive the web UI through Chrome (see below). |
| Same, alternative | **GPT image (ChatGPT)** | Covered by the user's ChatGPT subscription. The user pastes your prompt; you read the downloaded result. Strong at text-in-image and UI screens. |
| Moving footage, reference motion, lip-sync to a song | **Seedance 2.5 / Kling / Midjourney video** (via Higgsfield or direct) | Always credits. Read the real price before every render and say it (`references/real-shots.md`). Use for reference motion that code redraws (rotoscoping, see overnight-run.md) or for editorial footage under a code HUD. |
| Music | **Suno** | User generates from your prompt (see audio.md). Ask for full length. |
| Sound effects (hits, whooshes, UI ticks, risers, impacts, chimes) | **`scripts/sfx.mjs`: code-synthesized, free, deterministic** | Default. 10 kinds x variants, placed by exact film frame over the music bed with ducking, a -1 dBTP ceiling and an audibility check (see audio.md). |
| Voice, announcer, organic one-off SFX (animals, crowds, real-world foley) | **ElevenLabs** (or Higgsfield `generate_audio`) | User's subscription or credits. Place on exact hit frames. |
| Upscale, background removal, reframe | Higgsfield tools | Credits; or do keying in code for flat backgrounds (free). |
| Lyrics, word timestamps | **whisper.cpp** local: `whisper-cli -m <model.bin> -f audio.wav -l <lang> -ml 1 -sow` (whisper.cpp with the large-v3-turbo model) | Free. Transcripts of sung lyrics are rough; ask the user for the real lyrics and use the timestamps. |
| Isolate vocals to find exact hits | **demucs** local: `python -m demucs --two-stems=vocals -o sep song.mp3` (demucs in a Python environment) | Free. Then read vocal onsets from the vocals stem's loudness. |
| Tempo | onset autocorrelation (see audio.md) | Free. Lock the beat grid to the vocal onsets. |

(On any machine, check what is installed and offer to install what is missing.)

## Driving the Higgsfield web UI for free images (when the user is logged in)

Chrome MCP on higgsfield.ai/ai/image: pick **Nano Banana Pro** (badged UNLIMITED), toggle **Unlimited** ON in the prompt bar (the button then reads "Unlimited ✦"; never toggle Unlimited on GPT Image 2, it opens a paid upsell). Set long prompts via the Lexical editor state in JS instead of typing (typing 2k chars freezes the tab). Upload references through the uploads panel's file input. Queue 2 at a time (the web UI runs ~4 concurrently and the user may be using it too). Fetch results with the free MCP `show_generations` read and curl them down. Video is not covered by Unlimited.


## Seedance lip-sync at scale (public production record, Sep 2026)

Proven on 47 clips + 30 continuations, ~86% of sung seconds verified in sync (~$93 at 720p via OpenRouter):

1. **Condition every singing clip on both the plate image and the exact audio window** of the song, and quote the words in the prompt: `@Image1 sings @Audio1. She lip-syncs to @Audio1 exactly, every word in time: "…"`.
2. **The key fact: Seedance copies the reference audio into its own soundtrack, and the mouth follows THAT soundtrack**, which drifts from the real vocal partway through. So sync is measurable, not eyeballable: compare the clip's returned soundtrack against the real vocal (spectrogram/alignment) to find the divergence point.
3. **Cut on the last eighth note before the drift** and cover the rest with a continuation clip starting from that frame. In the final mix, replace all clip audio with the real song.
4. Dedicated lip-sync models (LatentSync class) are the fallback, not the plan.
5. Keep generation inputs **in color**: plates graded to mono come back grey and lose the image-model look; grade in post.

**Characters: stylized in code, realistic from a model.** Lesson from a song clip (Sep 2026): pushing a code-drawn human toward realism (7-head proportions, anatomy, hands, close-ups) looked fine in stills but twisted in motion (necks, hands, legs), and the user said the animation quality failed. Code characters should stay stylized (picture-book proportions, simple joints, emotion through posture, light, silhouette and back views). If the user wants realistic people, offer an image/video model for the character with code for everything else.

## Seek-compatible libraries (and the ones never to use)

film.html renders frames out of order, so any animation library must be driven by t:
- **Anime.js:** create timelines with `autoplay: false`, then `anim.seek(t * 1000)` in `renderFrame`.
- **Theatre.js:** hand-tune camera paths and keyframes in its studio UI, then `sequence.position = t` in `renderFrame` (ship the exported state JSON, not the studio).
- **Our own `springs.js`** for everything else (closed-form, `timing.md`).
- **Never** a real-time-only library (GSAP tickers left running, CSS transitions/animations, physics engines stepped by the clock, Lottie in autoplay): they drift from t and fail the gate's determinism check. Motion ideas that need them get rebuilt as functions of t (`motion-kit.md`).

## Free asset sources

- **Mixkit** (mixkit.co): free music and SFX, no attribution required; check each item's licence line.
- **svgl.app:** clean SVG logos of real brands and tools, for inline icons and "works with" rows (real integrations only; brand marks stay the brand's).
- **3dicons.co:** CC0 3D icon set, several styles and angles; good for explainer cards.

## Deciding code vs. model assets

- Characters that must **move a lot** (dance, fight, act): code-drawn (watercolor engine) or model-made **pose sheets** that code animates. Single stills can only slide.
- **Recognizable real people:** model-made images from their photo (keep kids stylized unless the parent explicitly wants realistic).
- **Type, UI, diagrams, HUDs, charts, counters:** always code. Crisper and perfectly timed.
- **Photoreal footage:** a video model, with a code layer on top for intelligence and timing.
- **A mix is usually best:** model for beauty, code for motion, timing and type.

**Web UI mechanics learned the hard way (Sep 2026):**
- A page reload switches Unlimited back **off**. Re-check the toggle before every Generate.
- Reference images from earlier sessions stay attached. Hover each thumbnail and click its top-right X before generating.
- Reference slots clear after every Generate. Uploads take 5-15 s, and a second upload can replace the first instead of adding one; zoom-check the slots before clicking Generate.
- Never click the slot tile itself: it opens the native file picker (Escape closes it). Use `find` for the file input and upload through it.
- To reuse a finished image as the reference for the next one (burst pairs, a character's identity), open the + panel, go to the Generations tab and click its tile.
- The window size can change mid-session; re-find elements instead of reusing old coordinates.
