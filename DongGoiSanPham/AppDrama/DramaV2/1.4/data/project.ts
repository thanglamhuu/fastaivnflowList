import { ScriptProjectData, VideoModel } from '../types';
import { MATRIX_12_VOICES } from '../voicePresets';
export const VALID_MODELS: VideoModel[] = ['Omni 1.1 Flash', 'Veo 3.1 - Lite', 'Veo 3.1 - Fast', 'Veo 3.1 - Quality'];
export function normalizeProjectData(raw: any): ScriptProjectData {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_PROJECT;
  }
  const rawProject = raw.project || raw;
  const rawConfig = raw.config || {};
  // 1. Chuẩn hóa Model
  let model: VideoModel = 'Veo 3.1 - Fast';
  if (rawConfig.model && VALID_MODELS.includes(rawConfig.model)) {
    model = rawConfig.model;
  } else if (rawConfig.model && typeof rawConfig.model === 'string') {
    const mStr = rawConfig.model.toLowerCase();
    if (mStr.includes('omni')) model = 'Omni 1.1 Flash';
    else if (mStr.includes('quality')) model = 'Veo 3.1 - Quality';
    else if (mStr.includes('lite')) model = 'Veo 3.1 - Lite';
    else model = 'Veo 3.1 - Fast';
  }
  // 2. Chuẩn hóa Resolution
  const resolution: '360p' | '720p' = rawConfig.resolution === '360p' ? '360p' : '720p';
  // 3. Chuẩn hóa Duration
  let duration = 60;
  if (typeof rawProject.duration === 'number' && !isNaN(rawProject.duration)) {
    duration = rawProject.duration;
  } else if (typeof rawProject.duration === 'string') {
    const parsed = parseInt(rawProject.duration.replace(/[^0-9]/g, ''), 10);
    duration = !isNaN(parsed) && parsed > 0 ? parsed : 60;
  }
  // 4. Chuẩn hóa Characters (Tự động tách base64 từ referenceImageUrl nếu chưa có)
  const rawChars = Array.isArray(rawProject.characters) ? rawProject.characters : [];
  const characters = rawChars.map((char: any, idx: number) => {
    let avatarMedia = char.avatarMedia;
    const refUrl = char.referenceImageUrl || '';
    // Nếu đã có avatarMedia
    if (avatarMedia) {
      let mime = avatarMedia.mimeType || 'image/jpeg';
      let base64 = avatarMedia.base64 || '';
      
      // Nếu base64 rỗng mà avatarMedia.url hoặc referenceImageUrl là data URL
      const candidateDataUrl = avatarMedia.url?.startsWith('data:') ? avatarMedia.url : (refUrl.startsWith('data:') ? refUrl : '');
      if (!base64 && candidateDataUrl) {
        const commaIdx = candidateDataUrl.indexOf(',');
        if (commaIdx !== -1) {
          base64 = candidateDataUrl.substring(commaIdx + 1);
          const header = candidateDataUrl.substring(0, commaIdx);
          const mimeMatch = header.match(/data:([^;]+);base64/);
          if (mimeMatch && mimeMatch[1]) mime = mimeMatch[1];
        }
      }
      avatarMedia = {
        ...avatarMedia,
        mimeType: mime,
        base64,
        url: avatarMedia.url || (base64 ? `data:${mime};base64,${base64}` : refUrl)
      };
    } else if (refUrl || char.mediaId) {
      let base64 = '';
      let mime = 'image/jpeg';
      if (refUrl.startsWith('data:')) {
        const commaIdx = refUrl.indexOf(',');
        if (commaIdx !== -1) {
          base64 = refUrl.substring(commaIdx + 1);
          const header = refUrl.substring(0, commaIdx);
          const mimeMatch = header.match(/data:([^;]+);base64/);
          if (mimeMatch && mimeMatch[1]) mime = mimeMatch[1];
        }
      }
      avatarMedia = {
        mediaId: char.mediaId || `char_ref_${idx}`,
        base64,
        mimeType: mime,
        url: refUrl || (base64 ? `data:${mime};base64,${base64}` : '')
      };
    }
    // Gán selectedVoiceId mặc định nếu chưa có
    let selectedVoiceId = char.selectedVoiceId;
    if (!selectedVoiceId) {
      const nameLower = (char.name || '').toLowerCase();
      const descLower = ((char.physicalDescription || '') + ' ' + (char.voiceTone || '')).toLowerCase();
      const isFemale = nameLower.includes('nữ') || nameLower.includes('chị') || nameLower.includes('cô') || nameLower.includes('bà') || descLower.includes('nữ') || descLower.includes('phụ nữ');
      if (isFemale) {
        selectedVoiceId = 'voice_01'; // Nữ trầm bản lĩnh
      } else {
        selectedVoiceId = idx % 2 === 0 ? 'voice_05' : 'voice_02'; // Nam lãnh đạo / Nam tri kỷ
      }
    }
    return {
      id: char.id || `char-${idx + 1}`,
      name: char.name || `Nhân vật ${idx + 1}`,
      physicalDescription: char.physicalDescription || '',
      defaultOutfit: char.defaultOutfit || '',
      voiceTone: char.voiceTone || '',
      avatarMedia,
      selectedVoiceId
    };
  });
  // 5. Chuẩn hóa Locations (Tự động tách base64 nếu locationMedia.url là data URL)
  const rawLocs = Array.isArray(rawProject.locations) ? rawProject.locations : [];
  const locations = rawLocs.map((loc: any, idx: number) => {
    let locationMedia = loc.locationMedia;
    if (locationMedia) {
      let mime = locationMedia.mimeType || 'image/jpeg';
      let base64 = locationMedia.base64 || '';
      if (!base64 && locationMedia.url?.startsWith('data:')) {
        const commaIdx = locationMedia.url.indexOf(',');
        if (commaIdx !== -1) {
          base64 = locationMedia.url.substring(commaIdx + 1);
          const header = locationMedia.url.substring(0, commaIdx);
          const mimeMatch = header.match(/data:([^;]+);base64/);
          if (mimeMatch && mimeMatch[1]) mime = mimeMatch[1];
        }
      }
      locationMedia = {
        ...locationMedia,
        mimeType: mime,
        base64,
        url: locationMedia.url || (base64 ? `data:${mime};base64,${base64}` : '')
      };
    }
    return {
      id: loc.id || `loc-${idx + 1}`,
      name: loc.name || `Bối cảnh ${idx + 1}`,
      description: loc.description || '',
      locationMedia
    };
  });
  // 6. Chuẩn hóa Shots
  const rawShots = Array.isArray(rawProject.shots) ? rawProject.shots : [];
  const shots = rawShots.map((shot: any, idx: number) => {
    let startFrameMedia = shot.startFrameMedia;
    if (startFrameMedia) {
      let mime = startFrameMedia.mimeType || 'image/jpeg';
      let base64 = startFrameMedia.base64 || '';
      if (!base64 && startFrameMedia.url?.startsWith('data:')) {
        const commaIdx = startFrameMedia.url.indexOf(',');
        if (commaIdx !== -1) {
          base64 = startFrameMedia.url.substring(commaIdx + 1);
          const header = startFrameMedia.url.substring(0, commaIdx);
          const mimeMatch = header.match(/data:([^;]+);base64/);
          if (mimeMatch && mimeMatch[1]) mime = mimeMatch[1];
        }
      }
      startFrameMedia = {
        ...startFrameMedia,
        mimeType: mime,
        base64,
        url: startFrameMedia.url || (base64 ? `data:${mime};base64,${base64}` : '')
      };
    }
    let videoMedia = shot.videoMedia;
    if (videoMedia) {
      let mime = videoMedia.mimeType || 'video/mp4';
      let base64 = videoMedia.base64 || '';
      if (!base64 && videoMedia.url?.startsWith('data:')) {
        const commaIdx = videoMedia.url.indexOf(',');
        if (commaIdx !== -1) {
          base64 = videoMedia.url.substring(commaIdx + 1);
        }
      }
      videoMedia = {
        ...videoMedia,
        mimeType: mime,
        base64,
        url: videoMedia.url || (base64 ? `data:${mime};base64,${base64}` : '')
      };
    }
    let durationSec = shot.durationSeconds;
    if (typeof durationSec === 'string') {
      durationSec = parseInt(durationSec, 10);
    }
    if (!durationSec || isNaN(durationSec)) {
      durationSec = 6;
    }
    return {
      id: shot.id || `shot-${idx + 1}`,
      shotNumber: shot.shotNumber || idx + 1,
      durationSeconds: durationSec,
      title: shot.title || `Shot ${idx + 1}`,
      cameraAngle: shot.cameraAngle || 'Medium shot',
      visualPrompt: shot.visualPrompt || '',
      videoMotionPrompt: shot.videoMotionPrompt || '',
      characterNames: Array.isArray(shot.characterNames) ? shot.characterNames : [],
      dialogue: shot.dialogue ? {
        characterName: shot.dialogue.characterName || '',
        line: shot.dialogue.line || '',
        emotion: shot.dialogue.emotion || 'Normal'
      } : undefined,
      sfxAudioCue: shot.sfxAudioCue || '',
      startFrameMedia,
      videoMedia,
      imageStatus: shot.imageStatus || (startFrameMedia ? 'completed' : 'idle'),
      videoStatus: shot.videoStatus || (videoMedia ? 'completed' : 'idle')
    };
  });
  // 7. Aspect ratio
  const validAspects = ['16:9', '9:16', '1:1', '4:3', '3:4'];
  const rawRatio = rawProject.aspectRatio || rawConfig.ratio || '9:16';
  const aspectRatio = validAspects.includes(rawRatio) ? rawRatio : '9:16';
  return {
    project: {
      title: rawProject.title || 'Dự án Phim AI',
      style: rawProject.style || 'Cinematic, High contrast, 4K quality',
      aspectRatio: aspectRatio as any,
      duration,
      premise: rawProject.premise || '',
      scriptMarkdown: rawProject.scriptMarkdown || '',
      characters,
      locations,
      props: Array.isArray(rawProject.props) ? rawProject.props : [],
      shots
    },
    config: {
      ratio: aspectRatio,
      speed: rawConfig.speed || 1,
      model,
      threads: rawConfig.threads || 4,
      resolution
    }
  };
}
export const DEFAULT_PROJECT: ScriptProjectData = {
  project: {
    title: "Sếp Cướp Công & Cái Kết",
    style: "Cinematic, High contrast, Office drama",
    aspectRatio: "9:16",
    duration: 60,
    premise: "Một nhân viên tài năng bị sếp chiếm đoạt thành quả dự án quan trọng và cách anh ta đòi lại công lý.",
    scriptMarkdown: "# Sếp Cướp Công...",
    characters: [
      {
        id: "char-1",
        name: "Sếp Hùng",
        physicalDescription: "Đàn ông 45 tuổi, đeo kính gọng vàng, bụng phệ nhẹ, vẻ mặt gian xảo.",
        defaultOutfit: "Suit xám cao cấp, cà vạt đỏ.",
        voiceTone: "Trịch thượng, giả tạo.",
        selectedVoiceId: "voice_05"
      },
      {
        id: "char-2",
        name: "Nam",
        physicalDescription: "Thanh niên 28 tuổi, gương mặt sáng, ánh mắt kiên định nhưng đang mệt mỏi.",
        defaultOutfit: "Áo sơ mi trắng, quần tây xanh đen.",
        voiceTone: "Điềm tĩnh nhưng quyết liệt.",
        selectedVoiceId: "voice_02"
      }
    ],
    locations: [
      {
        id: "loc-1",
        name: "Văn phòng Sếp",
        description: "Văn phòng sang trọng với bàn gỗ lớn, view nhìn ra thành phố hiện đại ban đêm."
      },
      {
        id: "loc-2",
        name: "Phòng họp chung",
        description: "Không gian hiện đại với bảng trắng đầy sơ đồ, không khí căng thẳng."
      }
    ],
    props: ["Laptop", "Hồ sơ dự án", "Điện thoại"],
    shots: [
      {
        id: "shot-1",
        shotNumber: 1,
        durationSeconds: 6,
        title: "Đối mặt trong văn phòng",
        cameraAngle: "Medium shot",
        visualPrompt: "Sếp Hùng đang ngồi rung đùi, tay cầm hồ sơ dự án nhìn Nam với vẻ thách thức.",
        videoMotionPrompt: "Slow zoom into Boss's face, slight smirk.",
        characterNames: ["Sếp Hùng", "Nam"],
        dialogue: {
          characterName: "Sếp Hùng",
          line: "Dự án này thành công là nhờ sự chỉ đạo tài tình của tôi. Cậu chỉ là người thực thi thôi.",
          emotion: "Arrogant"
        },
        imageStatus: 'idle',
        videoStatus: 'idle'
      },
      {
        id: "shot-2",
        shotNumber: 2,
        durationSeconds: 6,
        title: "Nam phản kháng",
        cameraAngle: "Close up",
        visualPrompt: "Nam đứng đối diện, đôi mắt nheo lại, tay nắm chặt lại bên hông.",
        videoMotionPrompt: "Static shot, focus on Nam's intense eyes.",
        characterNames: ["Nam"],
        dialogue: {
          characterName: "Nam",
          line: "Tôi đã thức trắng 3 tuần để hoàn thiện thuật toán này. Sếp không thể cướp công trắng trợn như vậy.",
          emotion: "Angry but controlled"
        },
        imageStatus: 'idle',
        videoStatus: 'idle'
      }
    ]
  },
  config: {
    ratio: "9:16",
    speed: 1,
    model: "Veo 3.1 - Fast",
    threads: 4,
    resolution: "720p"
  }
};