import { VoiceOption, ScriptProjectData } from '../types';
export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'vi-vn-female-1', name: 'Hoài Anh', gender: 'Nữ', accent: 'Bắc', description: 'Nữ trẻ, điềm tĩnh, chuyên nghiệp', sampleTone: 'Giọng đọc tin tức thời sự' },
  { id: 'vi-vn-male-1', name: 'Mạnh Cường', gender: 'Nam', accent: 'Bắc', description: 'Nam trung niên, quyền lực, đĩnh đạc', sampleTone: 'Giọng sếp tổng, lãnh đạo' },
  { id: 'vi-vn-male-2', name: 'Tuấn Tú', gender: 'Nam', accent: 'Nam', description: 'Nam trẻ, năng động, thực dụng', sampleTone: 'Giọng nhân viên văn phòng' },
  { id: 'vi-vn-female-2', name: 'Lan Phương', gender: 'Nữ', accent: 'Nam', description: 'Nữ trẻ, sắc sảo, cá tính', sampleTone: 'Giọng phản biện, tranh luận' },
  { id: 'vi-vn-female-3', name: 'Thùy Chi', gender: 'Nữ', accent: 'Trung', description: 'Nữ nhẹ nhàng, tình cảm', sampleTone: 'Giọng kể chuyện' },
  { id: 'vi-vn-male-3', name: 'Quang Anh', gender: 'Nam', accent: 'Trung', description: 'Nam trầm ấm, tin cậy', sampleTone: 'Giọng thuyết minh' },
];
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
        voiceTone: "Trịch thượng, giả tạo."
      },
      {
        id: "char-2",
        name: "Nam",
        physicalDescription: "Thanh niên 28 tuổi, gương mặt sáng, ánh mắt kiên định nhưng đang mệt mỏi.",
        defaultOutfit: "Áo sơ mi trắng, quần tây xanh đen.",
        voiceTone: "Điềm tĩnh nhưng quyết liệt."
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
        durationSeconds: 5,
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
    model: "Omni 1.1 Flash",
    threads: 4,
    resolution: "720p"
  }
};  