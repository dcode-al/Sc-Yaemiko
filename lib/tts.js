const tts = require('@google-cloud/text-to-speech');
const { Scraper } = new(require('@neoxr/wb'))
const client = new tts.TextToSpeechClient({ keyFilename: 'media/json/key.json' });

const ttz = async (text, options = {}) => {
  try {
    const { id = 'id-ID-Wavenet-B', emotion = 'default' } = options;

    const settings = {
      senang: { rate: 1.3, pitch: 5, profile: 'small-bluetooth-speaker-class-device' },
      sedih: { rate: 0.9, pitch: -2, profile: 'handset-class-device' },
      marah: { rate: 1.4, pitch: 2, profile: 'small-bluetooth-speaker-class-device' },
      default: { rate: 1.0, pitch: 0, profile: 'handset-class-device' }
    };

    const { rate, pitch, profile } = settings[emotion] || settings.default;

    const request = {
      input: { text },
      voice: { languageCode: 'id-ID', name: id, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: rate, pitch, effectsProfileId: [profile] }
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioBuffer = response.audioContent;
    const url = (await Scraper.uploadFile(audioBuffer)).data.url;

    return { creator: creator, status: true, data: { url } };
  } catch (error) {
    return { creator: creator, status: false, msg: error.message }
  }
};

module.exports = { ttz }