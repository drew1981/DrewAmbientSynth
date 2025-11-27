/**
 * PolyWave Studio - Standalone Vanilla JS Version
 */

// --- CONSTANTS ---

const ECO_MAX_VOICES = 6;
const HQ_MAX_VOICES = 16;

const NOTES = [
  { note: 'C', octave: 3, frequency: 130.81, isSharp: false },
  { note: 'C#', octave: 3, frequency: 138.59, isSharp: true },
  { note: 'D', octave: 3, frequency: 146.83, isSharp: false },
  { note: 'D#', octave: 3, frequency: 155.56, isSharp: true },
  { note: 'E', octave: 3, frequency: 164.81, isSharp: false },
  { note: 'F', octave: 3, frequency: 174.61, isSharp: false },
  { note: 'F#', octave: 3, frequency: 185.00, isSharp: true },
  { note: 'G', octave: 3, frequency: 196.00, isSharp: false },
  { note: 'G#', octave: 3, frequency: 207.65, isSharp: true },
  { note: 'A', octave: 3, frequency: 220.00, isSharp: false },
  { note: 'A#', octave: 3, frequency: 233.08, isSharp: true },
  { note: 'B', octave: 3, frequency: 246.94, isSharp: false },
  { note: 'C', octave: 4, frequency: 261.63, isSharp: false },
  { note: 'C#', octave: 4, frequency: 277.18, isSharp: true },
  { note: 'D', octave: 4, frequency: 293.66, isSharp: false },
  { note: 'D#', octave: 4, frequency: 311.13, isSharp: true },
  { note: 'E', octave: 4, frequency: 329.63, isSharp: false },
  { note: 'F', octave: 4, frequency: 349.23, isSharp: false },
  { note: 'F#', octave: 4, frequency: 369.99, isSharp: true },
  { note: 'G', octave: 4, frequency: 392.00, isSharp: false },
  { note: 'G#', octave: 4, frequency: 415.30, isSharp: true },
  { note: 'A', octave: 4, frequency: 440.00, isSharp: false },
  { note: 'A#', octave: 4, frequency: 466.16, isSharp: true },
  { note: 'B', octave: 4, frequency: 493.88, isSharp: false },
];

const KEYBOARD_MAP = {
  'a': 0, 'w': 1, 's': 2, 'e': 3, 'd': 4,
  'f': 5, 't': 6, 'g': 7, 'y': 8, 'h': 9, 'u': 10, 'j': 11,
  'k': 12, 'o': 13, 'l': 14, 'p': 15, ';': 16, '\'': 18,
};

const MUSICAL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES = {
    'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'Major': [0, 2, 4, 5, 7, 9, 11],
    'Minor': [0, 2, 3, 5, 7, 8, 10],
    'Pentatonic': [0, 3, 5, 7, 10],
    'WholeTone': [0, 2, 4, 6, 8, 10]
};

const DEFAULT_PARAMS = {
  performanceMode: 'HQ',
  oscillator: { type: 'sawtooth', detune: 0 },
  filter: { type: 'lowpass', cutoff: 2000, resonance: 5, envAmount: 1000 },
  envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8 },
  lfo: { rate: 0, depth: 0, target: 'cutoff' },
  granular: { enabled: false, mix: 0.4, grainSize: 0.1, density: 0.5, spread: 0.8, feedback: 0.2 },
  delay: { enabled: false, time: 0.5, feedback: 0.3, mix: 0.4, pitchRandom: 0, rootKey: 'C', scale: 'Major' },
  master: { gain: 0.4, reverbMix: 0.3, reverbType: 'hall' },
};

const PRESETS = [
    { name: "Init Saw", params: DEFAULT_PARAMS },
    {
        name: "Soft Pad",
        params: {
            performanceMode: 'HQ',
            oscillator: { type: 'triangle', detune: 5 },
            filter: { type: 'lowpass', cutoff: 600, resonance: 2, envAmount: 400 },
            envelope: { attack: 0.8, decay: 1.5, sustain: 0.6, release: 2.0 },
            lfo: { rate: 0.5, depth: 20, target: 'pitch' },
            granular: { enabled: false, mix: 0.3, grainSize: 0.1, density: 0.5, spread: 0.5, feedback: 0 },
            delay: DEFAULT_PARAMS.delay,
            master: { gain: 0.5, reverbMix: 0.6, reverbType: 'hall' }
        }
    },
    {
        name: "Granular Cloud",
        params: {
            performanceMode: 'HQ',
            oscillator: { type: 'sine', detune: 0 },
            filter: { type: 'bandpass', cutoff: 1500, resonance: 1, envAmount: 0 },
            envelope: { attack: 0.5, decay: 0.5, sustain: 1.0, release: 2.0 },
            lfo: { rate: 0.2, depth: 0, target: 'pitch' },
            granular: { enabled: true, mix: 0.7, grainSize: 0.2, density: 0.95, spread: 1.0, feedback: 0.6 },
            delay: DEFAULT_PARAMS.delay,
            master: { gain: 0.5, reverbMix: 0.5, reverbType: 'shimmer' }
        }
    },
    {
        name: "Rhythmic Delay",
        params: {
            performanceMode: 'HQ',
            oscillator: { type: 'square', detune: -5 },
            filter: { type: 'lowpass', cutoff: 1200, resonance: 4, envAmount: 500 },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 },
            lfo: { rate: 0, depth: 0, target: 'cutoff' },
            granular: { enabled: false, mix: 0, grainSize: 0.1, density: 0.5, spread: 0, feedback: 0 },
            delay: { enabled: true, time: 0.3, feedback: 0.5, mix: 0.5, pitchRandom: 0.8, rootKey: 'C', scale: 'Minor' },
            master: { gain: 0.4, reverbMix: 0.2, reverbType: 'hall' }
        }
    }
];

// --- ENGINE CLASS ---

class SynthEngine {
  constructor(initialParams) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.params = JSON.parse(JSON.stringify(initialParams));

    this.activeVoices = new Map();
    this.heldNotes = new Set();
    this.activeGrains = [];
    this.activeDelayGrains = [];
    this.granularWriteIndex = 0;
    this.delayWriteIndex = 0;
    this.grainSpawnTimer = 0;
    this.delayTimer = 0;
    this.MAX_GRAINS = 40;
    
    // Buffer for recording
    this.recordedBuffer = null;

    // Chain Setup
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.ratio.value = 4;
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.params.master.gain;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.85;

    this.recorderDest = this.ctx.createMediaStreamDestination();
    
    // Effects
    this.reverbNode = this.ctx.createConvolver();
    this.dryNode = this.ctx.createGain();
    this.wetNode = this.ctx.createGain();

    this.granularDry = this.ctx.createGain();
    this.granularWet = this.ctx.createGain();
    
    this.delayDry = this.ctx.createGain();
    this.delayWet = this.ctx.createGain();

    // Script Processors
    this.granularNode = this.ctx.createScriptProcessor(4096, 2, 2);
    this.granularBuffer = new Float32Array(this.ctx.sampleRate * 2);
    this.granularNode.onaudioprocess = this.processGranular.bind(this);

    this.delayNode = this.ctx.createScriptProcessor(4096, 2, 2);
    this.delayBuffer = new Float32Array(this.ctx.sampleRate * 4);
    this.delayNode.onaudioprocess = this.processDelay.bind(this);

    // Input
    this.inputGain = this.ctx.createGain();
    this.inputGain.gain.value = 0;
    this.inputSendToFx = this.ctx.createGain();
    this.inputDry = this.ctx.createGain();

    // Wiring
    this.voiceDestination = this.ctx.createGain();
    
    // Voice -> Granular
    this.voiceDestination.connect(this.granularDry);
    this.voiceDestination.connect(this.granularNode);
    this.granularNode.connect(this.granularWet);

    // Granular Out -> Delay
    const granularOutput = this.ctx.createGain();
    this.granularDry.connect(granularOutput);
    this.granularWet.connect(granularOutput);

    granularOutput.connect(this.delayDry);
    granularOutput.connect(this.delayNode);
    this.delayNode.connect(this.delayWet);

    // Delay Out -> Reverb
    const delayOutput = this.ctx.createGain();
    this.delayDry.connect(delayOutput);
    this.delayWet.connect(delayOutput);

    delayOutput.connect(this.dryNode);
    delayOutput.connect(this.reverbNode);
    this.reverbNode.connect(this.wetNode);

    // Master Sum
    this.dryNode.connect(this.compressor);
    this.wetNode.connect(this.compressor);
    
    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(this.recorderDest);

    // Input Routing
    this.inputGain.connect(this.inputDry);
    this.inputGain.connect(this.inputSendToFx);
    this.inputDry.connect(this.compressor);
    this.inputSendToFx.connect(this.reverbNode);

    this.generateReverbBuffers();
    this.updateReverbState();
    this.updateGranularState();
    this.updateDelayState();
  }

  processGranular(e) {
      if (!this.params.granular.enabled) {
          e.outputBuffer.getChannelData(0).fill(0);
          e.outputBuffer.getChannelData(1).fill(0);
          return;
      }
      const inputL = e.inputBuffer.getChannelData(0);
      const inputR = e.inputBuffer.getChannelData(1);
      const outputL = e.outputBuffer.getChannelData(0);
      const outputR = e.outputBuffer.getChannelData(1);
      const { grainSize, density, spread, feedback } = this.params.granular;
      
      const sampleRate = this.ctx.sampleRate;
      const minInterval = sampleRate * 0.001; 
      const maxInterval = sampleRate * 0.2;
      const spawnInterval = maxInterval - (Math.pow(density, 0.5) * (maxInterval - minInterval));
      const grainDurationSamples = Math.floor(grainSize * sampleRate);

      for (let i = 0; i < inputL.length; i++) {
          const monoIn = (inputL[i] + inputR[i]) * 0.5;
          this.granularBuffer[this.granularWriteIndex] = monoIn;

          let currentSampleL = 0;
          let currentSampleR = 0;

          for (let g = this.activeGrains.length - 1; g >= 0; g--) {
              const grain = this.activeGrains[g];
              if (grain.position >= grain.duration) {
                  this.activeGrains.splice(g, 1);
                  continue;
              }
              let readIdx = (grain.bufferIndex + Math.floor(grain.position)) % this.granularBuffer.length;
              if (readIdx < 0) readIdx += this.granularBuffer.length;
              
              const sample = this.granularBuffer[readIdx];
              const progress = grain.position / grain.duration;
              const window = 4 * progress * (1 - progress);
              const panned = sample * window;
              
              currentSampleL += panned * (1 - Math.max(0, grain.pan));
              currentSampleR += panned * (1 + Math.min(0, grain.pan));
              grain.position += grain.speed;
          }

          if (feedback > 0) {
              const safeFeedback = Math.min(0.95, feedback);
              this.granularBuffer[this.granularWriteIndex] += (currentSampleL + currentSampleR) * 0.5 * safeFeedback;
          }

          outputL[i] = currentSampleL;
          outputR[i] = currentSampleR;
          this.granularWriteIndex = (this.granularWriteIndex + 1) % this.granularBuffer.length;

          this.grainSpawnTimer--;
          if (this.grainSpawnTimer <= 0) {
              this.grainSpawnTimer = spawnInterval * (0.5 + Math.random());
              if (this.activeGrains.length < this.MAX_GRAINS) {
                  const offset = Math.floor(Math.random() * spread * sampleRate * 0.5);
                  let startIdx = this.granularWriteIndex - offset;
                  if (startIdx < 0) startIdx += this.granularBuffer.length;
                  
                  this.activeGrains.push({
                      bufferIndex: startIdx,
                      position: 0,
                      speed: 1.0 + (Math.random() * 0.05 - 0.025) * spread,
                      duration: grainDurationSamples,
                      pan: (Math.random() * 2 - 1) * spread
                  });
              }
          }
      }
  }

  processDelay(e) {
      if (!this.params.delay.enabled) {
          e.outputBuffer.getChannelData(0).fill(0);
          e.outputBuffer.getChannelData(1).fill(0);
          return;
      }
      const inputL = e.inputBuffer.getChannelData(0);
      const inputR = e.inputBuffer.getChannelData(1);
      const outputL = e.outputBuffer.getChannelData(0);
      const outputR = e.outputBuffer.getChannelData(1);
      const { time, feedback, pitchRandom, rootKey, scale } = this.params.delay;
      
      const sampleRate = this.ctx.sampleRate;
      const delaySamples = Math.floor(time * sampleRate);
      const allowedIntervals = SCALES[scale];

      for (let i = 0; i < inputL.length; i++) {
          const monoIn = (inputL[i] + inputR[i]) * 0.5;
          this.delayBuffer[this.delayWriteIndex] = monoIn;

          let outL = 0;
          let outR = 0;

          for (let g = this.activeDelayGrains.length - 1; g >= 0; g--) {
              const grain = this.activeDelayGrains[g];
              if (grain.position >= grain.duration) {
                  this.activeDelayGrains.splice(g, 1);
                  continue;
              }
              let readIdx = (grain.bufferIndex + Math.floor(grain.position)) % this.delayBuffer.length;
              if (readIdx < 0) readIdx += this.delayBuffer.length;
              
              const sample = this.delayBuffer[readIdx];
              const progress = grain.position / grain.duration;
              let window = 1;
              if (progress < 0.1) window = progress / 0.1;
              if (progress > 0.9) window = (1 - progress) / 0.1;
              
              const panned = sample * window * grain.gain;
              outL += panned * (1 - Math.max(0, grain.pan));
              outR += panned * (1 + Math.min(0, grain.pan));
              grain.position += grain.speed;
          }

          if (feedback > 0) {
             this.delayBuffer[this.delayWriteIndex] += (outL + outR) * 0.5 * feedback;
          }

          outputL[i] = outL;
          outputR[i] = outR;
          this.delayWriteIndex = (this.delayWriteIndex + 1) % this.delayBuffer.length;

          this.delayTimer--;
          if (this.delayTimer <= 0) {
              this.delayTimer = delaySamples;
              if (this.activeDelayGrains.length < this.MAX_GRAINS) {
                  let startIdx = this.delayWriteIndex - delaySamples;
                  if (startIdx < 0) startIdx += this.delayBuffer.length;
                  
                  let speed = 1.0;
                  if (pitchRandom > 0.05 && Math.random() <= pitchRandom) {
                       const interval = allowedIntervals[Math.floor(Math.random() * allowedIntervals.length)];
                       const octave = Math.random() > 0.7 ? (Math.random() > 0.5 ? 12 : -12) : 0;
                       speed = Math.pow(2, (interval + octave) / 12);
                  }

                  this.activeDelayGrains.push({
                      bufferIndex: startIdx,
                      position: 0,
                      speed: speed,
                      duration: delaySamples,
                      pan: (Math.random() * 0.4 - 0.2),
                      gain: 1.0
                  });
              }
          }
      }
  }

  generateReverbBuffers() {
      const isEco = this.params.performanceMode === 'Eco';
      const hallDecay = isEco ? 1.2 : 2.5;
      const shimmerDecay = isEco ? 2.0 : 4.0;
      this.hallBuffer = this.createImpulse(hallDecay, hallDecay, false);
      this.shimmerBuffer = this.createImpulse(shimmerDecay, 1.2, true);
  }

  createImpulse(duration, decay, shimmer) {
      const len = this.ctx.sampleRate * duration;
      const buff = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
      const L = buff.getChannelData(0);
      const R = buff.getChannelData(1);
      for (let i = 0; i < len; i++) {
          const n = i / len;
          const env = Math.pow(1 - n, decay);
          let noise = (Math.random() * 2 - 1);
          if (shimmer) {
              noise *= (1 + Math.sin(i * 0.3));
              if (i < 500) noise *= 0.1;
          }
          L[i] = noise * env;
          R[i] = noise * env;
      }
      return buff;
  }

  updateReverbState() {
      const { reverbType, reverbMix } = this.params.master;
      if (reverbType === 'off') {
          this.wetNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
          this.dryNode.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1);
      } else {
          const buff = reverbType === 'hall' ? this.hallBuffer : this.shimmerBuffer;
          if (this.reverbNode.buffer !== buff) this.reverbNode.buffer = buff;
          this.wetNode.gain.setTargetAtTime(reverbMix, this.ctx.currentTime, 0.1);
          this.dryNode.gain.setTargetAtTime(1 - (reverbMix * 0.4), this.ctx.currentTime, 0.1);
      }
  }

  updateGranularState() {
      const { enabled, mix } = this.params.granular;
      if (enabled) {
          this.granularDry.gain.setTargetAtTime(1 - mix, this.ctx.currentTime, 0.1);
          this.granularWet.gain.setTargetAtTime(mix, this.ctx.currentTime, 0.1);
      } else {
          this.granularDry.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1);
          this.granularWet.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
  }

  updateDelayState() {
      const { enabled, mix } = this.params.delay;
      if (enabled) {
          this.delayDry.gain.setTargetAtTime(1 - mix, this.ctx.currentTime, 0.1);
          this.delayWet.gain.setTargetAtTime(mix, this.ctx.currentTime, 0.1);
      } else {
          this.delayDry.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1);
          this.delayWet.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
  }

  updateParams(newParams) {
      const oldMode = this.params.performanceMode;
      this.params = JSON.parse(JSON.stringify(newParams));
      
      if (oldMode !== this.params.performanceMode) {
          this.generateReverbBuffers();
          this.updateReverbState();
      }
      
      this.masterGain.gain.setTargetAtTime(this.params.master.gain, this.ctx.currentTime, 0.1);
      this.updateReverbState();
      this.updateGranularState();
      this.updateDelayState();
      this.activeVoices.forEach(v => v.updateParams(this.params));
  }

  playNote(index, freq) {
      this.resumeContext();
      const maxVoices = this.params.performanceMode === 'Eco' ? ECO_MAX_VOICES : HQ_MAX_VOICES;
      
      if (this.activeVoices.size >= maxVoices) {
          const oldest = this.activeVoices.keys().next().value;
          if (oldest !== undefined) this.stopNote(oldest);
      }
      if (this.activeVoices.has(index)) {
          this.activeVoices.get(index).stop();
          this.activeVoices.delete(index);
      }

      const v = new Voice(this.ctx, this.voiceDestination, freq, this.params);
      v.start();
      this.activeVoices.set(index, v);
  }

  stopNote(index) {
      const v = this.activeVoices.get(index);
      if (!v) return;
      if (this.isHoldEnabled) {
          this.heldNotes.add(index);
      } else {
          v.stop();
          this.activeVoices.delete(index);
          this.heldNotes.delete(index);
      }
  }

  setHold(enabled) {
      this.isHoldEnabled = enabled;
      if (!enabled) {
          this.heldNotes.forEach(idx => {
              const v = this.activeVoices.get(idx);
              if (v) v.stop();
              this.activeVoices.delete(idx);
          });
          this.heldNotes.clear();
      }
  }

  resumeContext() {
      if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  // --- Recorder & Input methods ---
  async initAudioInput() {
      try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false }});
          this.inputSource = this.ctx.createMediaStreamSource(s);
          this.inputSource.connect(this.inputGain);
          return true;
      } catch(e) { console.error(e); return false; }
  }

  setInputGain(v) { this.inputGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
  setInputFXSend(en) { this.inputSendToFx.gain.setTargetAtTime(en ? 1 : 0, this.ctx.currentTime, 0.1); }

  startRecording() {
      this.recordedChunks = [];
      this.recordedBuffer = null;
      this.mediaRecorder = new MediaRecorder(this.recorderDest.stream, { mimeType: 'audio/webm' });
      this.mediaRecorder.ondataavailable = e => { if(e.data.size > 0) this.recordedChunks.push(e.data); };
      this.mediaRecorder.start();
  }

  stopRecording() {
      return new Promise(resolve => {
          if (!this.mediaRecorder) return resolve(null);
          this.mediaRecorder.onstop = async () => {
             // Decode for Waveform
             const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
             const ab = await blob.arrayBuffer();
             const buff = await this.ctx.decodeAudioData(ab);
             this.recordedBuffer = buff;
             resolve(buff);
          };
          this.mediaRecorder.stop();
      });
  }

  playRecording(loop) {
      if(!this.recordedBuffer) return;
      if(this.playbackSource) this.playbackSource.stop();
      
      this.playbackSource = this.ctx.createBufferSource();
      this.playbackSource.buffer = this.recordedBuffer;
      this.playbackSource.loop = loop;
      this.playbackSource.connect(this.ctx.destination);
      this.playbackSource.start();
  }

  stopPlayback() {
      if(this.playbackSource) { this.playbackSource.stop(); this.playbackSource = null; }
  }

  clearRecording() { this.recordedChunks = []; this.recordedBuffer = null; this.stopPlayback(); }
}

class Voice {
    constructor(ctx, dest, freq, params) {
        this.ctx = ctx; this.params = params; this.frequency = freq;
        this.startTime = ctx.currentTime;
        this.osc = ctx.createOscillator();
        this.filter = ctx.createBiquadFilter();
        this.amp = ctx.createGain();
        this.lfo = ctx.createOscillator();
        this.lfoGain = ctx.createGain();
        
        this.osc.connect(this.filter);
        this.filter.connect(this.amp);
        this.amp.connect(dest);
        this.lfo.connect(this.lfoGain);
        
        this.setup();
    }
    
    setup() {
        const t = this.ctx.currentTime;
        const p = this.params;
        this.osc.type = p.oscillator.type;
        this.osc.frequency.value = this.frequency;
        this.osc.detune.value = p.oscillator.detune;
        
        this.filter.type = p.filter.type;
        this.filter.Q.value = p.filter.resonance;
        this.filter.frequency.setValueAtTime(p.filter.cutoff, t);
        this.filter.frequency.linearRampToValueAtTime(Math.min(22000, p.filter.cutoff + p.filter.envAmount), t + p.envelope.attack);
        this.filter.frequency.exponentialRampToValueAtTime(Math.max(10, p.filter.cutoff + (p.filter.envAmount * p.envelope.sustain)), t + p.envelope.attack + p.envelope.decay);

        this.lfo.type = 'sine';
        this.lfo.frequency.value = p.lfo.rate;
        let dm = 1;
        if(p.lfo.target === 'cutoff') dm = 100;
        else if(p.lfo.target === 'pitch') dm = 10;
        else if(p.lfo.target === 'amp') dm = 0.5;
        this.lfoGain.gain.value = p.lfo.depth * dm;
        
        this.lfoGain.disconnect();
        if(p.lfo.target === 'pitch') this.lfoGain.connect(this.osc.detune);
        else if(p.lfo.target === 'cutoff') this.lfoGain.connect(this.filter.frequency);
        else if(p.lfo.target === 'amp') this.lfoGain.connect(this.amp.gain);

        this.amp.gain.setValueAtTime(0, t);
        this.amp.gain.linearRampToValueAtTime(1, t + p.envelope.attack);
        this.amp.gain.exponentialRampToValueAtTime(Math.max(0.001, p.envelope.sustain), t + p.envelope.attack + p.envelope.decay);
    }

    start() { this.osc.start(this.startTime); this.lfo.start(this.startTime); }
    stop() {
        const t = this.ctx.currentTime;
        const r = this.params.envelope.release;
        this.amp.gain.cancelScheduledValues(t);
        this.amp.gain.setValueAtTime(this.amp.gain.value, t);
        this.amp.gain.exponentialRampToValueAtTime(0.001, t + r);
        this.filter.frequency.cancelScheduledValues(t);
        this.filter.frequency.setValueAtTime(this.filter.frequency.value, t);
        this.filter.frequency.exponentialRampToValueAtTime(this.params.filter.cutoff, t + r);
        this.osc.stop(t + r + 0.1);
        this.lfo.stop(t + r + 0.1);
    }
    
    updateParams(newParams) {
        this.params = newParams;
        const t = this.ctx.currentTime;
        this.osc.type = newParams.oscillator.type;
        this.osc.detune.setTargetAtTime(newParams.oscillator.detune, t, 0.1);
        this.filter.Q.setTargetAtTime(newParams.filter.resonance, t, 0.1);
        this.filter.frequency.setTargetAtTime(newParams.filter.cutoff, t, 0.1);
        this.lfo.frequency.setTargetAtTime(newParams.lfo.rate, t, 0.1);
        this.lfoGain.disconnect();
        let dm = 1;
        if(newParams.lfo.target === 'cutoff') dm = 100;
        else if(newParams.lfo.target === 'pitch') dm = 10;
        else if(newParams.lfo.target === 'amp') dm = 0.5;
        this.lfoGain.gain.setTargetAtTime(newParams.lfo.depth * dm, t, 0.1);
        
        if(newParams.lfo.target === 'pitch') this.lfoGain.connect(this.osc.detune);
        else if(newParams.lfo.target === 'cutoff') this.lfoGain.connect(this.filter.frequency);
        else if(newParams.lfo.target === 'amp') this.lfoGain.connect(this.amp.gain);
    }
}

// --- UI CONTROLLER ---

let engine = null;
let currentParams = JSON.parse(JSON.stringify(DEFAULT_PARAMS));
let isHold = false;

document.addEventListener('DOMContentLoaded', () => {
    
    // Init Engine
    engine = new SynthEngine(currentParams);

    // --- Helpers ---
    const updateParam = (path, value) => {
        const parts = path.split('.');
        if (parts.length === 2) currentParams[parts[0]][parts[1]] = value;
        engine.updateParams(currentParams);
    };

    // --- INIT KNOBS ---
    document.querySelectorAll('.knob-container').forEach(el => {
        const label = el.dataset.label;
        const path = el.dataset.param;
        const min = parseFloat(el.dataset.min);
        const max = parseFloat(el.dataset.max);
        const step = parseFloat(el.dataset.step || '1');
        
        // Get initial value
        const parts = path.split('.');
        const initialVal = currentParams[parts[0]][parts[1]];

        // Create HTML
        el.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-2 select-none group w-20">
                <div class="relative cursor-ns-resize group-hover:scale-105 transition-transform knob-control" style="width: 60px; height: 60px;">
                    <svg width="60" height="60" class="knob-svg">
                         <circle cx="30" cy="30" r="28.5" fill="transparent" stroke="#333" stroke-width="3" stroke-dasharray="134 179" stroke-linecap="round" transform="rotate(135 30 30)"></circle>
                         <circle class="knob-value-ring" cx="30" cy="30" r="28.5" fill="transparent" stroke="#d4d4d4" stroke-width="3" stroke-dasharray="0 179" transform="rotate(135 30 30)" stroke-linecap="round"></circle>
                    </svg>
                </div>
                <div class="flex flex-col items-center gap-0.5">
                    <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">${label}</span>
                    <span class="knob-text text-[10px] font-mono text-neutral-300 tabular-nums leading-none">${initialVal.toFixed(step < 1 ? 2 : 0)}</span>
                </div>
            </div>
        `;
        
        const knobControl = el.querySelector('.knob-control');
        const valueRing = el.querySelector('.knob-value-ring');
        const textDisplay = el.querySelector('.knob-text');
        
        const updateVisuals = (val) => {
            const range = max - min;
            const pct = (val - min) / range;
            const circumference = 2 * Math.PI * 28.5;
            const arcLength = 0.75 * circumference;
            valueRing.style.strokeDasharray = `${pct * arcLength} ${circumference}`;
            textDisplay.textContent = val.toFixed(step < 1 ? 2 : 0);
        };

        updateVisuals(initialVal);

        // Logic
        let startY, startVal;
        const onMove = (e) => {
            e.preventDefault();
            const deltaY = startY - e.clientY;
            const range = max - min;
            let newVal = startVal + (deltaY / 200) * range;
            newVal = Math.max(min, Math.min(max, newVal));
            if (step) newVal = Math.round(newVal / step) * step;
            updateVisuals(newVal);
            updateParam(path, newVal);
        };
        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            valueRing.style.stroke = '#d4d4d4';
        };
        
        knobControl.addEventListener('mousedown', (e) => {
            startY = e.clientY;
            const parts = path.split('.');
            startVal = currentParams[parts[0]][parts[1]];
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
            valueRing.style.stroke = '#ffffff';
        });
    });

    // --- INIT SLIDERS (Vertical) ---
    document.querySelectorAll('.slider-vertical-container').forEach(el => {
        const label = el.dataset.label;
        const path = el.dataset.param;
        const min = parseFloat(el.dataset.min);
        const max = parseFloat(el.dataset.max);
        
        const parts = path.split('.');
        const initialVal = currentParams[parts[0]][parts[1]];

        el.className = "flex items-center justify-center select-none flex-col gap-2 h-full";
        el.innerHTML = `
            <div class="relative h-36 w-8 flex items-center justify-center">
               <input type="range" min="${min}" max="${max}" step="0.01" value="${initialVal}" 
               class="absolute w-32 h-1 origin-center -rotate-90 appearance-none bg-neutral-800 rounded-full cursor-pointer focus:outline-none slider-input">
            </div>
            <div class="flex flex-col items-center gap-0.5">
                <span class="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">${label}</span>
                <span class="slider-text text-[9px] font-mono text-neutral-300">${initialVal.toFixed(2)}</span>
            </div>
        `;
        
        const input = el.querySelector('input');
        const text = el.querySelector('.slider-text');
        input.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            text.textContent = val.toFixed(2);
            updateParam(path, val);
        });
    });

    // --- STANDARD SELECTS ---
    const bindSelect = (id, path) => {
        const el = document.getElementById(id);
        if(!el) return;
        el.value = path.split('.').reduce((o, i) => o[i], currentParams);
        el.addEventListener('change', (e) => updateParam(path, e.target.value));
    };
    bindSelect('osc-type', 'oscillator.type');
    bindSelect('filter-type', 'filter.type');

    // --- CUSTOM BUTTON GROUPS ---
    const bindBtnGroup = (containerId, path, valAttr) => {
        const container = document.getElementById(containerId);
        if(!container) return;
        const buttons = container.querySelectorAll('button');
        const updateClass = (val) => {
            buttons.forEach(btn => {
                const isActive = btn.dataset[valAttr] === val;
                btn.className = btn.className.replace(isActive ? 'bg-transparent text-neutral-500 border-neutral-800' : 'bg-white text-black border-white', ''); // reset roughly
                btn.className = isActive 
                    ? `text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold border bg-white text-black border-white`
                    : `text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold border border-neutral-800 text-neutral-500`;
            });
        };
        const initialVal = path.split('.').reduce((o, i) => o[i], currentParams);
        updateClass(initialVal);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset[valAttr];
                updateParam(path, val);
                updateClass(val);
            });
        });
    };
    bindBtnGroup('lfo-target-container', 'lfo.target', 'value');

    // Reverb Type Buttons
    const reverbBtns = document.querySelectorAll('#reverb-type-container button');
    const updateRevBtns = (val) => {
        reverbBtns.forEach(btn => {
            const isActive = btn.dataset.type === val;
            btn.className = isActive
                ? `text-[10px] px-4 py-2 rounded uppercase font-bold tracking-widest border transition-all bg-white text-black border-white`
                : `text-[10px] px-4 py-2 rounded uppercase font-bold tracking-widest border transition-all bg-transparent text-neutral-600 border-neutral-800`;
        });
    };
    reverbBtns.forEach(btn => btn.addEventListener('click', () => {
        const val = btn.dataset.type;
        updateParam('master.reverbType', val);
        updateRevBtns(val);
    }));

    // Performance Mode
    const perfBtns = document.querySelectorAll('.perf-btn');
    perfBtns.forEach(btn => btn.addEventListener('click', () => {
        const val = btn.dataset.mode;
        currentParams.performanceMode = val;
        engine.updateParams(currentParams);
        perfBtns.forEach(b => {
             const active = b.dataset.mode === val;
             b.className = active 
                ? 'perf-btn text-[10px] font-bold px-3 py-1 rounded transition-colors uppercase tracking-wider bg-white text-black'
                : 'perf-btn text-[10px] font-bold px-3 py-1 rounded transition-colors uppercase tracking-wider text-neutral-500 hover:text-white';
        });
    }));

    // --- TOGGLES ---
    const bindToggle = (id, path, labelOn, labelOff) => {
        const btn = document.getElementById(id);
        const update = () => {
            const val = path.split('.').reduce((o, i) => o[i], currentParams);
            btn.textContent = val ? labelOn : labelOff;
            btn.className = val 
                ? 'text-[9px] px-2 py-0.5 border rounded uppercase font-bold tracking-wider bg-white text-black border-white'
                : 'text-[9px] px-2 py-0.5 border rounded uppercase font-bold tracking-wider bg-transparent text-neutral-600 border-neutral-800';
        };
        update();
        btn.addEventListener('click', () => {
            const curr = path.split('.').reduce((o, i) => o[i], currentParams);
            updateParam(path, !curr);
            update();
        });
    };
    bindToggle('granular-toggle', 'granular.enabled', 'ON', 'BYPASS');
    bindToggle('delay-toggle', 'delay.enabled', 'ON', 'BYPASS');

    // --- PRESETS ---
    const presetSelect = document.getElementById('preset-select');
    PRESETS.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = p.name;
        presetSelect.appendChild(opt);
    });
    presetSelect.addEventListener('change', (e) => {
        if(e.target.value === 'Custom') return;
        const p = PRESETS.find(pr => pr.name === e.target.value);
        if(p) {
            currentParams = JSON.parse(JSON.stringify(p.params));
            engine.updateParams(currentParams);
            alert("Preset loaded. (Note: UI knobs do not visually update in this version)");
        }
    });

    // --- DELAY KEYS ---
    const keySel = document.getElementById('delay-root');
    MUSICAL_KEYS.forEach(k => { const o = document.createElement('option'); o.value=k; o.textContent=k; keySel.appendChild(o); });
    keySel.addEventListener('change', e => updateParam('delay.rootKey', e.target.value));
    
    const scaleSel = document.getElementById('delay-scale');
    Object.keys(SCALES).forEach(k => { const o = document.createElement('option'); o.value=k; o.textContent=k; scaleSel.appendChild(o); });
    scaleSel.addEventListener('change', e => updateParam('delay.scale', e.target.value));

    // --- KEYBOARD ---
    const kbContainer = document.getElementById('keyboard-container');
    const noteMap = new Map(); // index -> div
    NOTES.forEach((note, i) => {
        if (note.isSharp) return;
        const key = document.createElement('div');
        key.className = "relative flex-1 border-r border-b border-l border-black rounded-b-sm mx-[1px] bg-neutral-600 hover:bg-neutral-500 transition-colors duration-75";
        key.dataset.index = i;
        key.innerHTML = `<div class="absolute bottom-2 w-full text-center text-[10px] font-bold pointer-events-none text-neutral-800">${note.note}${note.octave}</div>`;
        kbContainer.appendChild(key);
        noteMap.set(i, key);

        // Check sharp
        const next = NOTES[i+1];
        if (next && next.isSharp) {
            const sharp = document.createElement('div');
            sharp.className = "absolute -right-3 top-0 w-5 h-28 z-20 rounded-b-sm border border-black bg-black";
            sharp.dataset.index = i+1;
            key.appendChild(sharp);
            noteMap.set(i+1, sharp);
        }
    });

    const triggerNoteOn = (idx) => {
        const el = noteMap.get(idx);
        if(el) {
            if(NOTES[idx].isSharp) el.className = "absolute -right-3 top-0 w-5 h-28 z-20 rounded-b-sm border border-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]";
            else el.className = "relative flex-1 border-r border-b border-l border-black rounded-b-sm mx-[1px] transition-colors duration-75 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10";
        }
        engine.playNote(idx, NOTES[idx].frequency);
    };
    const triggerNoteOff = (idx) => {
        const el = noteMap.get(idx);
        if(el) {
            if(NOTES[idx].isSharp) el.className = "absolute -right-3 top-0 w-5 h-28 z-20 rounded-b-sm border border-black bg-black";
            else el.className = "relative flex-1 border-r border-b border-l border-black rounded-b-sm mx-[1px] transition-colors duration-75 bg-neutral-600 hover:bg-neutral-500";
        }
        engine.stopNote(idx);
    };

    // Mouse Events for Keyboard
    noteMap.forEach((el, idx) => {
        el.addEventListener('mousedown', (e) => { e.stopPropagation(); triggerNoteOn(idx); });
        el.addEventListener('mouseup', (e) => { e.stopPropagation(); triggerNoteOff(idx); });
        el.addEventListener('mouseleave', (e) => { e.stopPropagation(); triggerNoteOff(idx); });
    });

    // Computer Keyboard
    const activeKeys = new Set();
    window.addEventListener('keydown', (e) => {
        const idx = KEYBOARD_MAP[e.key.toLowerCase()];
        if(idx !== undefined && !e.repeat && !activeKeys.has(idx)) {
            activeKeys.add(idx);
            triggerNoteOn(idx);
        }
    });
    window.addEventListener('keyup', (e) => {
        const idx = KEYBOARD_MAP[e.key.toLowerCase()];
        if(idx !== undefined) {
            activeKeys.delete(idx);
            triggerNoteOff(idx);
        }
    });

    // --- HOLD ---
    const holdBtn = document.getElementById('hold-btn');
    holdBtn.addEventListener('click', () => {
        isHold = !isHold;
        engine.setHold(isHold);
        holdBtn.textContent = `Hold ${isHold ? '[ON]' : '[OFF]'}`;
        holdBtn.className = isHold 
            ? "px-4 py-1 rounded font-bold text-[10px] uppercase tracking-[0.15em] transition-all border bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            : "px-4 py-1 rounded font-bold text-[10px] uppercase tracking-[0.15em] transition-all border bg-transparent border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300";
    });

    // --- VISUALIZER & INPUT ---
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    let vizMode = 'spectrum';
    const dataArray = new Uint8Array(2048);
    
    const drawViz = () => {
        requestAnimationFrame(drawViz);
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = '#171717';
        ctx.fillRect(0,0,w,h);
        
        if (vizMode === 'spectrum') {
            engine.analyser.getByteFrequencyData(dataArray);
            const barWidth = w / 128;
            for(let i=0; i<128; i++) {
                const v = dataArray[Math.floor(i*8)] / 255;
                const bh = v * h;
                const l = 20 + (v*80);
                ctx.fillStyle = `hsl(0, 0%, ${l}%)`;
                if(bh>1) ctx.fillRect(i*barWidth, h-bh, barWidth-1, bh);
            }
        } else {
            engine.analyser.getByteTimeDomainData(dataArray);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            const slice = w/2048;
            let x=0;
            for(let i=0; i<2048; i++) {
                const v = dataArray[i]/128.0;
                const y = v * h/2;
                if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                x+=slice;
            }
            ctx.stroke();
        }
    };
    drawViz();

    canvas.parentElement.addEventListener('click', () => {
        vizMode = vizMode === 'spectrum' ? 'waveform' : 'spectrum';
        document.getElementById('viz-mode-label').textContent = vizMode;
    });

    // Input Logic
    let inputActive = false;
    document.getElementById('activate-input-btn').addEventListener('click', async (e) => {
        if(!inputActive) {
            const ok = await engine.initAudioInput();
            if(ok) {
                inputActive = true;
                e.target.textContent = "Deactivate Input";
                document.getElementById('input-active-led').className = "w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]";
            }
        } else {
             engine.setInputGain(0);
             inputActive = false;
             e.target.textContent = "Activate Input";
             document.getElementById('input-active-led').className = "w-2 h-2 rounded-full bg-neutral-800";
        }
    });
    
    const inGainSlider = document.getElementById('input-gain-slider');
    inGainSlider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        document.getElementById('input-gain-display').textContent = Math.round(v*100) + '%';
        engine.setInputGain(v);
    });
    
    let inFx = true;
    const inFxBtn = document.getElementById('input-fx-toggle');
    inFxBtn.addEventListener('click', () => {
        inFx = !inFx;
        engine.setInputFXSend(inFx);
        inFxBtn.className = `w-8 h-4 rounded-full relative transition-colors border border-neutral-700 ${inFx ? 'bg-white border-white' : 'bg-transparent'}`;
        inFxBtn.firstElementChild.className = `absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${inFx ? 'left-4.5 bg-black' : 'left-0.5 bg-neutral-600'}`;
    });

    // --- RECORDER ---
    let isRec = false;
    const recBtn = document.getElementById('rec-btn');
    const playBtn = document.getElementById('play-btn');
    const clearBtn = document.getElementById('clear-btn');
    const loopToggle = document.getElementById('loop-toggle');
    const tapeCanvas = document.getElementById('tape-canvas');
    const tapeCtx = tapeCanvas.getContext('2d');
    let loopRec = false;
    
    const drawTapeWaveform = (buffer) => {
        const w = tapeCanvas.width;
        const h = tapeCanvas.height;
        tapeCtx.fillStyle = '#171717';
        tapeCtx.fillRect(0,0,w,h);
        
        if (!buffer) return;
        
        const data = buffer.getChannelData(0);
        const step = Math.ceil(data.length / w);
        const amp = h / 2;
        
        tapeCtx.fillStyle = '#ffffff';
        tapeCtx.beginPath();
        for(let i=0; i < w; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j=0; j<step; j++) {
                const datum = data[(i*step)+j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            tapeCtx.fillRect(i, (1+min)*amp, 1, Math.max(1, (max-min)*amp));
        }
    };
    
    // Clear canvas initially
    drawTapeWaveform(null);

    recBtn.addEventListener('click', async () => {
        if(isRec) {
            const buffer = await engine.stopRecording();
            drawTapeWaveform(buffer);
            isRec = false;
            recBtn.textContent = 'Rec';
            recBtn.className = "py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all bg-transparent text-neutral-500 border-neutral-700 hover:text-white hover:border-neutral-500";
            playBtn.disabled = false;
            clearBtn.disabled = false;
            document.getElementById('tape-loaded-msg').classList.remove('hidden');
        } else {
            engine.clearRecording();
            drawTapeWaveform(null);
            engine.startRecording();
            isRec = true;
            recBtn.textContent = 'Stop';
            recBtn.className = "py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-black border-white";
            playBtn.disabled = true;
            clearBtn.disabled = true;
            document.getElementById('tape-loaded-msg').classList.add('hidden');
        }
    });

    playBtn.addEventListener('click', () => {
        if(playBtn.textContent === 'Stop') {
            engine.stopPlayback();
            playBtn.textContent = 'Play';
            playBtn.className = "py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all bg-transparent text-neutral-500 border-neutral-700";
        } else {
            engine.playRecording(loopRec);
            playBtn.textContent = 'Stop';
            playBtn.className = "py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-black border-white";
        }
    });

    clearBtn.addEventListener('click', () => {
        engine.clearRecording();
        drawTapeWaveform(null);
        playBtn.disabled = true;
        document.getElementById('tape-loaded-msg').classList.add('hidden');
    });

    loopToggle.addEventListener('click', () => {
        loopRec = !loopRec;
        loopToggle.className = `w-8 h-4 rounded-full relative transition-colors border border-neutral-700 ${loopRec ? 'bg-white border-white' : 'bg-transparent'}`;
        loopToggle.firstElementChild.className = `absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${loopRec ? 'left-4.5 bg-black' : 'left-0.5 bg-neutral-600'}`;
    });
});