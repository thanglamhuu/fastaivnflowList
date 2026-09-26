import { ThemeConfig } from './types';
export const CAMPAIGN_THEMES: Record<string, ThemeConfig> = {
  lifestyle: {
    id: 'lifestyle',
    name: 'Đời sống & Streetwear',
    description: 'Phong cách tự nhiên, gần gũi, dạo phố. Tuyệt vời cho Tiktok, Reels chốt sale.',
    scenes: [
      {
        id: 'ls_1', label: "Cầm trên tay ở Công viên", lockType: 'product_only',
        prompt_template: "SUBJECT: Một đôi giày thời trang chunky chi tiết siêu thực. POSITION: Lơ lửng góc 3/4 bên phải khung hình. QUALITY: 8K, hyper-realistic, ảnh quảng cáo cao cấp. ENVIRONMENT: Bối cảnh công viên mờ ảo, ánh sáng xuyên qua kẽ lá. Bố cục có text overlay thanh lịch. LIGHTING: Ánh sáng studio khuếch tán mềm mại.",
        video_action_context: "Slow handheld camera movement, gentle sunlight flickering through leaves, product stays in sharp focus."
      },
      {
        id: 'ls_2', label: "Phối đồ Jean (Pov)", lockType: 'product_only',
        prompt_template: "Góc máy top-down POV. Bàn tay cô gái cầm dây giày thả lỏng tự nhiên, phía dưới là đùi mặc quần jean xanh nhạt phai màu. Bối cảnh đường phố tối màu phía sau.",
        video_action_context: "Subtle dangling motion of the shoes, camera breathes gently, shallow depth of field on the jeans."
      },
      {
        id: 'ls_3', label: "Chân mang giày (Cận cảnh)", lockType: 'product_and_feet',
        prompt_template: "Cận cảnh bàn chân mang giày gác lên bậc thềm đá ngoài trời, KHÔNG lộ mặt. Góc máy thấp hướng thẳng vào đôi giày làm chủ thể chính chiếm 70% khung hình. Sân vườn đơn giản, nắng vàng.",
        video_action_context: "Camera tilts down slightly, feet tap gently to the rhythm, stable outdoor lighting."
      },
      {
        id: 'ls_4', label: "Kawaii Lookbook", lockType: 'full_body',
        prompt_template: "Toàn thân, cô gái mang giày phong cách kawaii, tạo dáng bước đi trên lối đi lát gạch. Phía sau là bãi cỏ xanh và công viên. Ánh sáng tự nhiên tươi sáng, lấy nét sâu vào trang phục và giày.",
        video_action_context: "Model steps forward dynamically, skirt flows in the wind, camera tracks the movement, very cinematic."
      },
      {
        id: 'ls_5', label: "Cozy Korean Lifestyle", lockType: 'product_only',
        prompt_template: "Giày đặt trên giường có ga trải giường màu trắng nhăn tự nhiên, cạnh cửa sổ có rèm sáo. Đèn ngủ ánh sáng vàng ấm áp. Phong cách lookbook Hàn Quốc ấm cúng.",
        video_action_context: "Slow horizontal slider movement, warm dust particles dancing in the light ray from the window."
      },
      {
        id: 'ls_6', label: "Unboxing Hộp Giấy", lockType: 'product_only',
        prompt_template: "Giày đặt nghiêng trong hộp carton màu sáng mở nắp, góc chụp từ trên xuống (flat lay). Chất liệu giày chi tiết nổi bật trên nền giấy lót tối màu.",
        video_action_context: "Static top-down camera, subtle shifting of the tissue paper due to light wind, slow zoom in."
      }
    ]
  },
  studio: {
    id: 'studio',
    name: 'Studio Sang Trọng',
    description: 'Tôn vinh chất liệu sản phẩm, bóng bẩy, nghệ thuật. Phù hợp cho Website, Banner.',
    scenes: [
      {
        id: 'st_1', label: "Bục tối giản hiện đại", lockType: 'product_only',
        prompt_template: "Hai chiếc giày đặt trên bục khối hình học trắng. Nền studio màu kem với chi tiết lông vũ trắng mềm mại phía sau. Ánh sáng high-key, đổ bóng mềm.",
        video_action_context: "Slow cinematic pan around the pedestal, lighting reveals the rich texture of the shoes."
      },
      {
        id: 'st_2', label: "Nền lụa studio cao cấp", lockType: 'product_only',
        prompt_template: "Giày đặt trên mặt phẳng bóng. Nền phía sau là lụa màu xám nhạt uốn lượn uyển chuyển tạo chuyển động. Bố cục sang trọng, tối giản.",
        video_action_context: "The silk background billows gracefully in slow motion, studio lights reflect elegantly off the product."
      },
      {
        id: 'st_3', label: "Đen phản gương đen", lockType: 'product_and_feet',
        prompt_template: "Chân siêu mẫu thon dài mang giày, tạo dáng kiêu kỳ. Nền studio đen tuyền chân không, sàn acrylic đen bóng như gương phản chiếu hoàn hảo. Không thấy mặt.",
        video_action_context: "Camera gracefully pushes in, specular highlights gleam along the legs and footwear."
      },
      {
        id: 'st_4', label: "Chất lỏng 3D phản chiếu", lockType: 'product_only',
        prompt_template: "Giày lơ lửng giữa trung tâm, sàn đen phản chiếu. Xung quanh là dải chất lỏng 3D màu sắc uốn lượn mượt mà bay lơ lửng, bọt nước thủy tinh. Đèn studio chiếu từ trên xuống.",
        video_action_context: "Liquid shapes orbit slowly around the shoe, droplets float effortlessly in zero gravity."
      },
      {
        id: 'st_5', label: "Spotlight rực rỡ", lockType: 'product_only',
        prompt_template: "Một chiếc nằm ngang, một chiếc đứng nghiêng tựa vào bục. Đèn spotlight tròn cực mạnh chiếu từ phía sau tạo hào quang. Sàn acrylic đen, không gian dramatic.",
        video_action_context: "The background spotlight pulses subtly, rim lighting wraps around the shoe edges."
      },
      {
        id: 'st_6', label: "Tương tác cầm nắm", lockType: 'product_only',
        prompt_template: "Cận cảnh bàn tay đang tinh chỉnh khóa/quai giày. Giày chiếm trung tâm, hậu cảnh là thành phố blur mờ mịt (bokeh). Nổi bật chi tiết kỹ thuật của sản phẩm.",
        video_action_context: "Hands firmly adjust the shoe strap, natural urban background bokeh shimmers softly."
      }
    ]
  },
  creative: {
    id: 'creative',
    name: 'Sáng tạo & Phá cách',
    description: 'Concept độc lạ, góc máy dị, gây chú ý mạnh (Hook 3s đầu).',
    scenes: [
      {
        id: 'cr_1', label: "Khổng lồ (Oversized)", lockType: 'full_body',
        prompt_template: "Một chiếc giày khổng lồ lấp đầy khung hình. Phía xa, một cô gái châu Á phong cách streetwear nhỏ bé đang đứng tựa vào chiếc giày. Tương phản kích thước mạnh mẽ.",
        video_action_context: "Dynamic low angle, clouds move rapidly in the background, model shifts weight confidently."
      },
      {
        id: 'cr_2', label: "Không trọng lượng", lockType: 'product_only',
        prompt_template: "Sản phẩm lơ lửng góc 3/4. Nền xếp lớp các khối hình học và vải rủ bồng bềnh. Typography khổng lồ mờ ảo hòa quyện vào phông nền.",
        video_action_context: "Product rotates imperceptibly in mid-air, soft gravity-defying motion."
      },
      {
        id: 'cr_3', label: "Đồ họa trừu tượng (Vector)", lockType: 'product_only',
        prompt_template: "Giày nằm ở trung tâm. Nền background pha trộn giữa nhiếp ảnh thực tế và các đường nét đồ họa pop-art lượn sóng (squiggly lines). Trendy, rực rỡ.",
        video_action_context: "Abstract vector lines undulate rhythmically around the highly realistic shoe."
      },
      {
        id: 'cr_4', label: "Retrowave / Neon", lockType: 'product_only',
        prompt_template: "Giày nổi bật giữa ánh sáng Cyberpunk. Nền gradient đen vũ trụ xuống cam neon chói lóa. Ánh sáng ven viền giày sắc nét.",
        video_action_context: "Neon lights flicker subtly, light bloom effect breathes to a synthwave rhythm."
      },
      {
        id: 'cr_5', label: "Không gian âm nhạc", lockType: 'product_and_feet',
        prompt_template: "Góc chụp từ hông trở xuống. Cô gái mặc quần short jean rách ngồi trên thùng loa acoustic đen xù xì, chân vắt chéo mang giày. Đèn neon hắt mờ.",
        video_action_context: "Pounding bass vibrates the acoustic foam slightly, neon rim lights slowly cycle colors."
      },
      {
        id: 'cr_6', label: "Trên tay em bé", lockType: 'product_only',
        prompt_template: "Giày người lớn được mô phỏng thu nhỏ vừa vặn nằm gọn trong lòng bàn tay người. Bối cảnh công viên xanh mướt phía sau.",
        video_action_context: "Fingers twitch gently, shallow depth of field keeps the miniature shoe incredibly sharp."
      }
    ]
  },
  editorial: {
    id: 'editorial',
    name: 'Tạp chí & Đồ họa',
    description: 'Tối ưu không gian để chèn Text/Tính năng. Phù hợp Ads, Print.',
    scenes: [
      {
        id: 'ed_1', label: "Infographic (E-com)", lockType: 'product_only',
        prompt_template: "Bố cục Infographic. Giày đặt ở giữa nền pastel trơn viền mảnh. Xung quanh là không gian trống để điền text, kèm các vòng tròn kính lúp lơ lửng chiếu vào chi tiết.",
        video_action_context: "Static crisp shot. Subtle pulsing glow around the 'magnifying glass' detail circles."
      },
      {
        id: 'ed_2', label: "Streetwear Banner (Split)", lockType: 'full_body',
        prompt_template: "Banner chia nửa. Bên trái là giày chụp studio phông trắng sáng. Bên phải là người mẫu ngồi trên bậc thang đá đường phố vắt chéo chân mang đôi giày đó.",
        video_action_context: "Static split screen. Left side is perfectly still, right side shows gentle wind blowing the model's hair."
      },
      {
        id: 'ed_3', label: "Mirror Selfie Magazine", lockType: 'full_body',
        prompt_template: "Bố cục tạp chí chia dọc. Trái: Cô gái mặc váy ngắn chụp selfie qua gương toàn thân, che mặt, thấy rõ chân mang giày. Phải: Ảnh cận cảnh sản phẩm chụp từ trên xuống nền kem.",
        video_action_context: "Left panel: model subtly adjusts pose. Right panel: static studio lighting. Ultra modern."
      },
      {
        id: 'ed_4', label: "Mockup Sofa Sang Trọng", lockType: 'full_body',
        prompt_template: "Cô gái mặc áo khoác đen, váy xếp ly trắng ngồi gập chân trên sofa lông mịn. Cận cảnh tập trung vào giày và chân. Có quyển tạp chí lấp ló bên trái.",
        video_action_context: "Cinematic medium close up. Ambient light shifts as if clouds are moving outside."
      },
      {
        id: 'ed_5', label: "Pop-art chấm bi", lockType: 'product_only',
        prompt_template: "Flat lay góc từ trên xuống. Nền màu vàng rực rỡ điểm xuyết các khối tròn họa tiết pop-art đa sắc (xanh, nâu, cam). Bố cục gọn gàng, vui nhộn.",
        video_action_context: "Drop shadows elongate slightly as virtual sun moves across the flat lay canvas."
      },
      {
        id: 'ed_6', label: "Đứng đối diện KOC", lockType: 'full_body',
        prompt_template: "Nhân vật đứng, hai tay cầm sản phẩm đưa ra ngang ngực hướng về camera. Focus cực nét vào sản phẩm, mặt KOC blur nhẹ. Nền phòng tối giản.",
        video_action_context: "The character gently rotates the product in her hands to show both sides, natural soft smile."
      }
    ]
  }
};